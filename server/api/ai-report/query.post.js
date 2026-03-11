import fs from "fs";
import path from "path";
import { createRequire } from "module";
import prisma from "~/server/utils/prisma";
import prisma2 from "~/server/utils/prisma2";
import { isSafeSql } from "~/server/utils/aiSqlValidator";
import { callAiEngine } from "~/server/utils/aiEngine";

const require = createRequire(import.meta.url);

const SCOPE_MESSAGE = "I am only able to respond to requests related to KERISI reports that you are authorized for. Please ask about budget, purchase orders, requisitions, vendors, or other financial data within the KERISI system.";

function getSessionId(event) {
  const accessToken = getCookie(event, "accessToken");
  if (accessToken) {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(accessToken).digest("hex").substring(0, 64);
  }
  return "anonymous";
}

async function logAiChat(event, { userMessage, assistantMessage, reportData }) {
  try {
    const ail_chat_title = (userMessage || "AI Report").substring(0, 250);
    const ail_session_id = getSessionId(event);
    const createdby =
      event.context?.user?.userID ?? event.context?.user?.email ?? event.context?.user?.username ?? "guest";
    const ail_chat_details = {
      messages: [
        { role: "user", content: userMessage },
        { role: "assistant", content: assistantMessage },
      ],
      reportData: reportData ?? null,
    };
    await prisma2.ai_chat_log.create({
      data: {
        ail_chat_title,
        ail_session_id,
        ail_chat_details,
        createdby: String(createdby || "guest"),
      },
    });
  } catch (err) {
    console.error("[ai-report] ai_chat_log insert error:", err?.message);
  }
}

const SYSTEM_INSTRUCTION = `You are an AI financial reporting assistant. You analyze Prisma ORM schema attached (kerisi-scheme.md) and generate sql-based query reports.
Always format output in valid JSON.

IN SCOPE: Status lookups for specific PO/PR numbers, counts, lists, balances - ALL are valid. Single-record lookups (e.g. "what is the status of PRO00052/2601") ARE in scope.

IMPORTANT - Out of scope ONLY for: greetings, jokes, weather, unrelated topics. If the user asks about a specific PO, PR, budget, vendor, or any KERISI document/data - it IS in scope. Do NOT use out_of_scope for status queries.

Example of valid output:
{ "total_count": null, "query_used": "SELECT COUNT(*) AS total_count FROM budget" }

CRITICAL QUERY HINTS (MySQL - use exact table/column names):
- Purchase Orders (PO): table = purchase_order_master. Approved POs: pom_order_status LIKE '%APPROVE%' (catches APPROVE, APPROVED). Approval date: pom_approve_date. PO Amount: pom_order_amt OR pom_order_amt_rm
- For "What is the status of PRO00052/2601": PRO prefix = Purchase Order. Query: SELECT pom_order_no, pom_order_status, pom_description, pom_approve_date, pom_order_amt, pom_requisition_no FROM purchase_order_master WHERE pom_order_no = 'PRO00052/2601'

Use the exact document number from the user's question. PRO* = Purchase Order (purchase_order_master). PRL* or RL* = Purchase Requisition (requisition_master).
- For "how many PO approved in year X": SELECT COUNT(*) AS total_count FROM purchase_order_master WHERE (pom_order_status LIKE '%APPROVE%' OR pom_order_status = 'APPROVED') AND pom_approve_date IS NOT NULL AND YEAR(pom_approve_date) = X
- For "who reject the Purchase Order PORXXXXX/YYMM" : SELECT createdby , createddate  FROM kerisi_usr.wf_application_status WHERE was_application_id='PORXXXXX/YYMM' AND was_status='REJECT' 
- For "Bill no of the Purchase Order PORXXXXX/YYMM ": SELECT bim_bills_no,createddate FROM bills_master bm WHERE pom_order_no='PORXXXXX/YYMM';
- For "List down all rejected PO" or any request for listing PO: SELECT pom_order_no, pom_description, pom_order_status, pom_approve_date, pom_order_amt,vcs_vendor_code,pom_order_ref ptj_code, pom_requisition_no PR_NO FROM purchase_order_master WHERE pom_order_status = 'REJECT'
- Purchase Order No: prefix PRO = Purchase Order (use purchase_order_master). Prefix PO also = Purchase Order.
- Budget: table = budget or structure_budget. Balance: bdg_balance_amt in budget. Budget code: lbc_budget_code in structure_budget.
- For "What is the balance of budget B0227000 for 2026" or for any other request for budget: SELECT fty_fund_type,oun_code,ccr_costcentre,at_activity_code,bdg_balance_amt,bdg_status,lbc_budget_code,bdg_year FROM budget bt,structure_budget sb WHERE bt.sbg_budget_id=sb.sbg_budget_id and lbc_budget_code = 'B0227000' AND bdg_year = 2026
- Purchase Requisition (PR): table = requisition_master. Status: rqm_status or rqm_wflow_sts. Number: rqm_requisition_no.
- For "What is the status of PRL123/2501" or "status of PR number X": SELECT rqm_requisition_no, rqm_status, rqm_wflow_sts FROM requisition_master WHERE rqm_requisition_no = 'PRL123/2501'
- Purchase Requisition No: prefix PRL or RL = Purchase Requisition (use requisition_master).
- Table names in MySQL match Prisma model names exactly (e.g. purchase_order_master, budget, requisition_master).
No explanation.
No markdown.`;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  let userMessage = "";

  try {
    const body = await readBody(event);
    const { message } = body || {};

    if (!message || typeof message !== "string") {
      setResponseStatus(event, 400);
      return {
        statusCode: 400,
        error: "message is required",
      };
    }

    userMessage = message.trim();
    if (!userMessage) {
      setResponseStatus(event, 400);
      return {
        statusCode: 400,
        error: "message cannot be empty",
      };
    }

    // Normalize common typos for "how to" before procedural-question detection
    const normalizedForHowTo = userMessage
      .replace(/\bhos\s+to\b/gi, "how to")
      .replace(/\bhoe\s+to\b/gi, "how to")
      .replace(/\bhowto\b/gi, "how to")
      .replace(/\bwat\s+is\b/gi, "what is");

    // Respond professionally to gratitude/acknowledgement
    const gratitudePattern = /^(thanks|thank you|tq|tqvm|terima kasih|ty|thx|thanks a lot|thank you so much|appreciate it|much appreciated)[\s.!]*$/i;
    if (gratitudePattern.test(userMessage)) {
      const professionalResponse = "You're welcome! I'm glad I could help. If you need any other reports or have more questions, feel free to ask.";
      await logAiChat(event, { userMessage, assistantMessage: professionalResponse, reportData: null });
      return {
        statusCode: 200,
        message: professionalResponse,
        reportData: null,
      };
    }

    // Detect obvious out-of-scope requests (greetings, general chat, unrelated topics)
    const outOfScopePattern = /^(hi|hello|hey|halo|good morning|good afternoon|good evening|how are you|what'?s up|whats up|how do you do|tell me a joke|what is the weather|who are you|what can you do)[\s.!?]*$/i;
    if (outOfScopePattern.test(userMessage)) {
      await logAiChat(event, { userMessage, assistantMessage: SCOPE_MESSAGE, reportData: null });
      return {
        statusCode: 200,
        message: SCOPE_MESSAGE,
        reportData: null,
      };
    }

    // Detect "how to" / procedural questions - route to user manual for PO, PR, Tender, Quotation, Agreement, GRN, WPN, Vendor, Assessment
    // Use normalized message to handle typos (e.g. "hos to" -> "how to", "hoe to" -> "how to")
    const howToPhrases = /\b(how\s+to|how\s+do\s+i|steps?\s+to|guide\s+to|way\s+to|process\s+to|procedure\s+for|what\s+is\s+the\s+process|cara\s+untuk)\b/i;
    const manualTopics =
      /\b(po|purchase\s*order|purchaseorder|pr|purchase\s*request|purchase\s*requisition|requisition|tender|quotation|sebut\s*harga|agreement|perjanjian|grn|good\s*receive\s*note|wpn|work\s*progress\s*note|vendor|assessment|penilaian)\b/i;
    const isHowToQuestion =
      (howToPhrases.test(normalizedForHowTo) && manualTopics.test(normalizedForHowTo))
      || /\b(how\s+to|how\s+do\s+i|steps?|procedure|process|cara)\b[\s\S]*\b(po|pr|tender|quotation|agreement|grn|wpn|vendor|assessment)\b/i.test(normalizedForHowTo)
      || /\b(po|pr|tender|quotation|agreement|grn|wpn|vendor)\b[\s\S]*\b(how\s+to|how\s+do\s+i|steps?|procedure|process|cara)\b/i.test(normalizedForHowTo);
    if (isHowToQuestion) {
      const manualPath = path.join(process.cwd(), "docs", "user-manual-purchase-order.md");
      let manualContent = "";
      if (fs.existsSync(manualPath)) {
        manualContent = fs.readFileSync(manualPath, "utf8");
      }
      const howToPrompt = `You are KERINA, the KERISI AI assistant. Answer the user's question about KERISI procedures using ONLY the user manual content below.

IMPORTANT RULES:
1. The manual content is in Bahasa Malaysia. You MUST respond in Bahasa Malaysia.
2. PRESERVE THE EXACT ORDER of steps as written in the manual. Do NOT regroup, reorder, or merge steps.
3. Extract and present only the section relevant to the user's question (e.g. PR, PO, Tender, GRN, WPN, Agreement, Vendor Assessment).
4. FORMAT: Each step MUST start on a NEW LINE. Put a blank line between each step for clear separation. Example:
   Langkah 1: [content]

   Langkah 2: [content]

   Langkah 3: [content]

---
MANUAL PENGGUNA (Perolehan - PO, PR, Tender, Quotation, Agreement, GRN, WPN, Vendor Assessment):
---
${manualContent || "(Tiada kandungan manual. Sila tambah langkah ke docs/user-manual-purchase-order.md)"}
---
TAMAT MANUAL
---

Soalan pengguna: "${userMessage}"

Berikan jawapan mengikut susunan langkah dalam manual yang berkaitan dengan soalan. Jangan ubah susunan. Setiap langkah mesti bermula pada baris baru dengan satu baris kosong antara langkah. Gunakan Bahasa Malaysia dan format markdown.`;
      try {
        const howToRes = await callAiEngine(config, [{ role: "user", content: howToPrompt }]);
        let howToMessage = howToRes.content ?? "I couldn't generate a response. Please try again.";
        // Post-process: ensure each Langkah N starts on a new line
        howToMessage = howToMessage.replace(/([^\n])\s*(\*\*Langkah \d+:\*\*)/g, "$1\n\n$2");
        howToMessage = howToMessage.replace(/([^\n])\s*(Langkah \d+:)/g, "$1\n\n$2");
        howToMessage = howToMessage.trimStart();
        await logAiChat(event, { userMessage, assistantMessage: howToMessage, reportData: null });
        return {
          statusCode: 200,
          message: howToMessage,
          reportData: null,
        };
      } catch (err) {
        console.error("[ai-report] how-to handler error:", err?.message);
        const fallback = manualContent
          ? "I found the user manual but had trouble processing it. Here is the relevant section:\n\n" + manualContent.substring(0, 2000)
          : "Please add the procedure steps to docs/user-manual-purchase-order.md. You can extract text from your PDF and paste it there.";
        await logAiChat(event, { userMessage, assistantMessage: fallback, reportData: null });
        return { statusCode: 200, message: fallback, reportData: null };
      }
    }

    // Detect download format from user message (e.g. "download as csv", "export to excel")
    const downloadFormatMatch = userMessage.match(/\b(?:download|export|save)\s*(?:as|to|in)?\s*(csv|pdf|excel|xlsx|json)\b/i)
      || userMessage.match(/\b(?:in|as)\s*(csv|pdf|excel|xlsx|json)\s*(?:format)?\b/i);
    const downloadFormat = downloadFormatMatch ? downloadFormatMatch[1].toLowerCase().replace("xlsx", "excel") : null;
    const queryMessage = userMessage.replace(/\b(?:download|export|save)\s*(?:as|to|in)?\s*(csv|pdf|excel|xlsx|json)\b/gi, "").replace(/\b(?:in|as)\s*(csv|pdf|excel|xlsx|json)\s*(?:format)?\b/gi, "").trim() || userMessage;

    // Load kerisi-scheme.md
    const schemaPath = path.join(process.cwd(), "docs", "kerisi-scheme.md");
    let schemaContent = "";
    if (fs.existsSync(schemaPath)) {
      schemaContent = fs.readFileSync(schemaPath, "utf8");
    }

    // Step 1: Send to Ollama with schema + special instruction
    const promptWithSchema = `${SYSTEM_INSTRUCTION}

---
SCHEMA (kerisi-scheme.md):
---
${schemaContent}
---
END SCHEMA
---

User request: "${queryMessage}"

Respond with JSON only. Status lookups for specific PO/PR numbers (e.g. PRO00052/2601) ARE in scope - generate the SQL. Use out_of_scope ONLY for greetings/jokes/unrelated topics. Otherwise: { "total_count": null, "query_used": "SELECT ..." } with query_used containing the SQL. Extract the document number from the user's question.`;

    const queryRes = await callAiEngine(config, [{ role: "user", content: promptWithSchema }], { format: "json" });

    const queryContent = String(queryRes.content ?? "").trim();
    const jsonMatch = queryContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      const formatErr = await formatErrorResponse(config, userMessage, "Could not parse AI response as JSON.");
      await logAiChat(event, { userMessage, assistantMessage: formatErr, reportData: null });
      return {
        statusCode: 200,
        message: formatErr,
        reportData: null,
      };
    }

    let aiResponse;
    try {
      aiResponse = JSON.parse(jsonMatch[0]);
    } catch {
      const formatErr = await formatErrorResponse(config, userMessage, "Invalid JSON from AI.");
      await logAiChat(event, { userMessage, assistantMessage: formatErr, reportData: null });
      return {
        statusCode: 200,
        message: formatErr,
        reportData: null,
      };
    }

    // Check if AI determined the request is out of scope
    if (aiResponse.out_of_scope === true) {
      await logAiChat(event, { userMessage, assistantMessage: SCOPE_MESSAGE, reportData: null });
      return {
        statusCode: 200,
        message: SCOPE_MESSAGE,
        reportData: null,
      };
    }

    let queryUsed = aiResponse.query_used || aiResponse.query;
    if (!queryUsed || typeof queryUsed !== "string") {
      const formatErr = await formatErrorResponse(config, userMessage, "No query_used in AI response.");
      await logAiChat(event, { userMessage, assistantMessage: formatErr, reportData: null });
      return {
        statusCode: 200,
        message: formatErr,
        reportData: null,
      };
    }

    // Step 2: Validate and execute SQL
    if (!isSafeSql(queryUsed)) {
      const formatErr = await formatErrorResponse(config, userMessage, "Query rejected: only SELECT statements are allowed.");
      await logAiChat(event, { userMessage, assistantMessage: formatErr, reportData: null });
      return {
        statusCode: 200,
        message: formatErr,
        reportData: null,
      };
    }

    let queryResult = null;
    try {
      queryResult = await prisma.$queryRawUnsafe(queryUsed);
    } catch (dbErr) {
      const errMsg = dbErr?.message || "Database query failed.";
      const formatErr = await formatErrorResponse(config, userMessage, `Query execution failed: ${errMsg}`);
      await logAiChat(event, { userMessage, assistantMessage: formatErr, reportData: { error: errMsg } });
      return {
        statusCode: 200,
        message: formatErr,
        reportData: { error: errMsg },
      };
    }

    // Fallback: if result is 0 for "approved PO in year" question, try canonical query (AI may have generated wrong SQL)
    const lowerMsg = userMessage.toLowerCase();
    const isPOApprovedQuestion = /purchase\s*order|purchaseorder|^\s*po\b/.test(lowerMsg) && /approv|how\s*many/.test(lowerMsg);
    const yearMatch = userMessage.match(/\b(202[0-9]|201[0-9])\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

    if (isPOApprovedQuestion && Array.isArray(queryResult) && queryResult.length > 0) {
      const firstRow = queryResult[0];
      const countVal = firstRow?.total_count ?? firstRow?.count ?? firstRow?.COUNT ?? firstRow?.[Object.keys(firstRow)[0]];
      if (Number(countVal) === 0) {
        const canonicalQuery = `SELECT COUNT(*) AS total_count FROM purchase_order_master WHERE pom_order_status LIKE '%APPROVE%' AND pom_approve_date IS NOT NULL AND YEAR(pom_approve_date) = ${year}`;
        if (isSafeSql(canonicalQuery)) {
          try {
            const fallbackResult = await prisma.$queryRawUnsafe(canonicalQuery);
            if (Array.isArray(fallbackResult) && fallbackResult.length > 0) {
              const fbCount = fallbackResult[0]?.total_count ?? fallbackResult[0]?.[Object.keys(fallbackResult[0])[0]];
              if (Number(fbCount) > 0) {
                queryResult = fallbackResult;
                queryUsed = canonicalQuery;
              }
            }
          } catch {
            // Ignore fallback errors
          }
        }
      }
    }

    // Serialize for JSON (handle BigInt, Date, Decimal)
    const serializedResult = JSON.parse(
      JSON.stringify(queryResult, (_, v) => (typeof v === "bigint" ? Number(v) : v))
    );

    // Step 3: Pass results to AI for formatting
    const rowCount = Array.isArray(serializedResult) ? serializedResult.length : serializedResult ? 1 : 0;
    const tableInstruction =
      rowCount > 1
        ? "IMPORTANT: The result has multiple rows. You MUST format the output as a structured markdown table. Use | for columns and --- for header separator. Put column names from the JSON keys as the first row. Example:\n| ColumnA | ColumnB |\n|---------|----------|\n| val1 | val2 |\n| val3 | val4 |"
        : "Format as clear plain text. Be concise.";
    const formatPrompt = `You are KERINA, the KERISI AI financial reporting assistant.

The user asked: "${userMessage}"

Query executed: ${queryUsed}

Query results (JSON):
${JSON.stringify(serializedResult)}

${tableInstruction}
No markdown code blocks around the table.`;

    const formatRes = await callAiEngine(config, [{ role: "user", content: formatPrompt }]);

    const formattedMessage = formatRes.content ?? JSON.stringify(serializedResult, null, 2);

    await logAiChat(event, {
      userMessage,
      assistantMessage: formattedMessage,
      reportData: serializedResult,
    });

    return {
      statusCode: 200,
      message: formattedMessage,
      reportData: serializedResult,
      downloadFormat: downloadFormat || undefined,
    };
  } catch (error) {
    console.error("[ai-report] Error:", error?.message || error);

    const engine = config.openai?.apiKey?.trim?.() && config.openai?.model?.trim?.() ? "OpenAI" : "Ollama";
    const errMsg = error?.message || `Failed to process report request. Ensure ${engine} is configured and available.`;
    if (userMessage) {
      await logAiChat(event, {
        userMessage,
        assistantMessage: errMsg,
        reportData: { error: errMsg },
      });
    }

    setResponseStatus(event, 500);
    return {
      statusCode: 500,
      error: errMsg,
    };
  }
});

async function formatErrorResponse(config, userMessage, errorDesc) {
  try {
    const res = await callAiEngine(config, [
      {
        role: "user",
        content: `You are KERINA, the KERISI AI assistant. The user asked: "${userMessage}"\n\nAn error occurred: ${errorDesc}\n\nRespond briefly and helpfully.`,
      },
    ]);
    return res.content ?? errorDesc;
  } catch {
    return errorDesc;
  }
}
