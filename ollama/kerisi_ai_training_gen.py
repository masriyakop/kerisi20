# Required: pip install torch datasets transformers peft trl bitsandbytes accelerate
# For GPU: pip install torch --index-url https://download.pytorch.org/whl/cu121
import torch
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    BitsAndBytesConfig,
)
from peft import LoraConfig
from trl import SFTConfig, SFTTrainer

# -------------------
# Configuration
# -------------------

model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"   # change if needed
dataset_path = r"C:\KerisiAI\kerisi\ollama\kerisi_training.jsonl"
output_dir = "./qlora-prisma"

USE_GPU = torch.cuda.is_available()
if not USE_GPU:
    print("WARNING: No GPU detected. Training on CPU will be very slow.")
    print("For GPU training, install: pip install torch --index-url https://download.pytorch.org/whl/cu121")

# -------------------
# Load Dataset
# -------------------

dataset = load_dataset("json", data_files=dataset_path, split="train")


def format_instruction(example):
    """Convert instruction/input/output to text format for SFT."""
    inp = f"\n### Input: {example['input']}" if example.get("input") else ""
    example["text"] = f"### Instruction: {example['instruction']}{inp}\n### Response: {example['output']}"
    return example


dataset = dataset.map(format_instruction, remove_columns=["instruction", "input", "output"])

# -------------------
# Load Model (4-bit QLoRA on GPU, full precision on CPU)
# -------------------

if USE_GPU:
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True,
    )
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        quantization_config=bnb_config,
        device_map="auto",
    )
else:
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float32,
        device_map="cpu",
    )

tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# -------------------
# LoRA Config
# -------------------

peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

# -------------------
# Training Arguments (GPU: QLoRA 8-bit optimizer, CPU: AdamW)
# -------------------

training_args = SFTConfig(
    output_dir=output_dir,
    per_device_train_batch_size=1 if not USE_GPU else 2,
    gradient_accumulation_steps=8 if not USE_GPU else 4,
    num_train_epochs=3,
    learning_rate=2e-4,
    logging_steps=10,
    save_strategy="epoch",
    fp16=USE_GPU,
    optim="paged_adamw_8bit" if USE_GPU else "adamw_torch",
    lr_scheduler_type="cosine",
    warmup_steps=50,
    report_to="none",
    dataset_text_field="text",
    dataloader_pin_memory=USE_GPU,
)

# -------------------
# Trainer
# -------------------

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    peft_config=peft_config,
    processing_class=tokenizer,
)

# -------------------
# Train
# -------------------

trainer.train()

# -------------------
# Save Adapter
# -------------------

trainer.model.save_pretrained(output_dir)

print("QLoRA training complete!")
