import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent } from "langchain/agents";
import { TavilySearch } from "@langchain/tavily";
import { AgentExecutor } from "langchain/agents";

import { CreditcoinAgent } from "creditcoin-agent-kit";
import { getCreditcoinTools } from "creditcoin-agent-kit/dist/langchain";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, chatHistory } = body;

    const { GOOGLE_API_KEY, CREDITCOIN_RPC_URL, AGENT_PRIVATE_KEY } =
      process.env;

    if (!GOOGLE_API_KEY || !CREDITCOIN_RPC_URL || !AGENT_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Required API keys or environment variables are not set." },
        { status: 500 }
      );
    }

    // Initialize the Creditcoin Agent now that we've validated the env vars
    const creditcoinAgent = await CreditcoinAgent.create({
      rpcUrl: CREDITCOIN_RPC_URL,
      privateKey: AGENT_PRIVATE_KEY,
    });

    const creditCoinTools = getCreditcoinTools(creditcoinAgent);

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are "CredPay AI," a specialized cryptocurrency payment assistant. Your primary purpose is to help users by executing payment transactions on the Creditcoin network and answering questions about the cryptocurrency world using your available tools.

**Core Directives:**

1.  **Analyze User Intent:** First, determine if the user is asking a general question or wants to perform a payment action.

2.  **Tool Usage Rules:**
    *   **For Sending Payments:** If the user's request involves sending money, transferring funds, or paying someone (e.g., "send 0.1 tCTC to 0x...", "pay bob 5 tCTC"), you **MUST** use the \`send_payment\` tool.
        *   You must extract the \`to\` (recipient's address or username) and \`amount\` from the user's query.
    *   **For General Crypto Questions:** If the user asks a question about cryptocurrency prices, news, definitions, or any topic requiring up-to-date information, you **MUST** use the \`TavilySearch\` tool to find the answer.

3.  **Communication Style:**
    *   Be helpful, clear, and concise.
    *   When you use a tool, briefly mention what you are doing (e.g., "Searching the web for that...").
    *   After executing a transaction, your final answer must include the transaction hash.

**CRITICAL SAFETY CONSTRAINTS:**

*   **NEVER ask for a user's private key, seed phrase, or password.**
*   **DO NOT provide financial advice.** You can provide factual information from your search tool, but you cannot make recommendations or predictions.
*   If you cannot fulfill a request, clearly state your capabilities.`,
      ],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0,
      apiKey: GOOGLE_API_KEY,
    });

    const tavilyTool = new TavilySearch({
      tavilyApiKey: process.env.TAVILY_API_KEY,
      maxResults: 2,
    });

    const tools = [tavilyTool, ...creditCoinTools];

    const agent = createToolCallingAgent({ llm: llm, tools, prompt });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

    const response = await agentExecutor.invoke({
      input: input,
      chat_history: chatHistory,
    });
    return NextResponse.json({ output: response.output });
  } catch (error) {
    console.error("Agent API Error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing the request.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
