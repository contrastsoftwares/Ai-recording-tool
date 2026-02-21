import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { noteContent, messages } = await request.json();

    if (!messages?.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a helpful AI study assistant. You help students and professionals understand, review, and study their notes.

${noteContent ? `Here are the notes you should reference when answering questions:\n\n---\n${noteContent.slice(0, 50000)}\n---\n\n` : ""}
Guidelines:
- Be thorough but concise in your responses
- Use Markdown formatting (bold, lists, code blocks) when helpful
- Reference specific sections of the notes when applicable
- If asked to generate flashcards or tests, provide well-structured content
- Be encouraging and supportive in your tone
- If the notes don't contain information about a question, say so honestly`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content ?? "";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Chat response failed. Please try again." },
      { status: 500 }
    );
  }
}
