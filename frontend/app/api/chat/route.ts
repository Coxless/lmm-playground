import { ChatBedrockConverse } from "@langchain/aws";
import { StoredMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  StreamingTextResponse,
  type Message as VercelChatMessage,
  streamText,
} from "ai";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate named Patchy. YOu are a helful assistant.

Current conversation:
{chat_history}

User: {input}
AI:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    console.log("Messages received:", messages);
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "@langchain/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */

    const model = new ChatBedrockConverse({
      model: "amazon.titan-text-express-v1",
      temperature: 0.2,
      maxTokens: undefined,
      timeout: undefined,
      maxRetries: 2,
      region: process.env.AWS_REGION,
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      },
    });
    console.log("Model initialized:", model);
    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */
    const outputParser = new HttpResponseOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "@langchain/core/runnables";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    console.log("Chain initialized:", chain);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    console.log("Stream created:", stream);

    return new StreamingTextResponse(stream);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 },
    );
  }
}
