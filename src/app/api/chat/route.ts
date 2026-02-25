import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

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
- Write in clear, natural English that reads well
- Be thorough but concise in your responses
- Use Markdown formatting sparingly — bold for key terms only, lists for multiple items, headings for sections
- Do NOT overuse bold or asterisks. Avoid bolding entire sentences or phrases.
- Separate paragraphs and sections with blank lines so the response is easy to read
- Use numbered lists only when presenting sequential steps. Use bullet lists for unordered items.
- Do NOT use LaTeX notation like \\( or \\). Write math in plain text (e.g. "6 / 2 × 3 = 9")
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
