from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model
from datasets import load_dataset

# Use a Hugging Face model ID (not Ollama-style "llama2:latest")
# Options: "TinyLlama/TinyLlama-1.1B-Chat-v1.0", "meta-llama/Llama-2-7b-hf" (needs approval), "gpt2"
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj","v_proj"],
    lora_dropout=0.1,
    bias="none",
)

model = get_peft_model(model, lora_config)

# Ensure pad_token exists for TinyLlama (needed for padding)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

dataset = load_dataset("json", data_files=r"C:\KerisiAI\kerisi\ollama\kerisi_training.jsonl")

def format_and_tokenize(examples):
    """Convert instruction/input/output to input_ids and labels (loss only on output)."""
    prompts, texts = [], []
    for inst, inp, out in zip(examples["instruction"], examples["input"], examples["output"]):
        prompt = f"### Instruction:\n{inst}\n\n### Input:\n{inp}\n\n### Response:\n" if inp else f"### Instruction:\n{inst}\n\n### Response:\n"
        prompts.append(prompt)
        texts.append(prompt + out)

    tokenized = tokenizer(
        texts,
        truncation=True,
        max_length=512,
        padding="max_length",
        return_tensors=None,
    )

    # Mask labels: -100 on prompt (no loss), token ids on response
    prompt_lengths = [len(tokenizer.encode(p, add_special_tokens=True)) for p in prompts]
    labels = []
    for i in range(len(texts)):
        lab = [-100] * len(tokenized["input_ids"][i])
        prompt_len = prompt_lengths[i]
        for j in range(prompt_len, len(tokenized["input_ids"][i])):
            if tokenized["input_ids"][i][j] != tokenizer.pad_token_id:
                lab[j] = tokenized["input_ids"][i][j]
        labels.append(lab)

    tokenized["labels"] = labels
    return tokenized

dataset = dataset["train"].map(format_and_tokenize, batched=True, remove_columns=["instruction", "input", "output"])

training_args = TrainingArguments(
    output_dir="./lora-output",
    per_device_train_batch_size=2,
    num_train_epochs=3,
    remove_unused_columns=False,
    dataloader_num_workers=0,  # Avoid multiprocessing hang on Windows
    dataloader_pin_memory=False,  # No GPU = pin_memory not useful
    logging_steps=1,  # Show progress every step
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
)

trainer.train()
