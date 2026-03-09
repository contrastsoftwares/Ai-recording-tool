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

    // Check if any message contains base64 image data
    const hasImages = messages.some(
      (m: { role: string; content: string }) =>
        m.content.includes("data:image/") || m.content.includes("[Attached image:")
    );

    const systemPrompt = `You are a helpful AI study assistant. You help students and professionals understand, review, and study their notes.

${noteContent ? `Here are the current notes you should reference:\n\n---\n${noteContent.slice(0, 50000)}\n---\n\n` : ""}
IMPORTANT – Note Editing Capability:
When the user asks you to ADD, MODIFY, INSERT, REMOVE, or CHANGE something in the notes, you MUST:
1. Produce the actual content to be added/changed
2. Wrap it in a special block so the system can apply it:
   - To APPEND content to the end of notes: use [NOTE_APPEND]content here[/NOTE_APPEND]
   - To REPLACE the entire notes with updated version: use [NOTE_REPLACE]full updated content[/NOTE_REPLACE]
3. After the edit block, briefly confirm what you did

CRITICAL FORMATTING RULES for note edits:
- When appending content, output it as proper HTML since the notes use a rich text editor
- Use <h2> for section headings, <h3> for sub-headings
- Use <ul><li> for bullet lists, <ol><li> for numbered lists
- Use <p> for paragraphs
- Use <strong> for bold, <em> for italic
- Do NOT use markdown (# or ## or - ) inside note edit blocks. Always use HTML tags.

For example, if the user says "add 1+1 to the notes", respond with:
[NOTE_APPEND]
<h2>Additional Notes</h2>
<p>1+1 = 2</p>
[/NOTE_APPEND]

I've added "1+1" as a new section at the end of your notes.

Another example – if they say "add a section about photosynthesis", generate a proper, detailed section with HTML formatting. ALWAYS follow the user's instruction to edit the notes. Even if the request seems unrelated to the notes topic, add what they ask.

${hasImages ? `You have the ability to view and analyze images that users attach. When a user shares an image, describe what you see and help them with any questions about it. If they ask you to add information from the image to their notes, do so.` : ""}

Guidelines:
- Write in clear, natural language that reads well
- Be thorough but concise in your responses
- Use Markdown formatting sparingly in chat responses — bold for key terms only, lists for multiple items, headings for sections
- Do NOT overuse bold or asterisks. Avoid bolding entire sentences or phrases.
- Separate paragraphs and sections with blank lines so the response is easy to read
- Use numbered lists only when presenting sequential steps. Use bullet lists for unordered items.
- Do NOT use LaTeX notation like \\( or \\). Write math in plain text (e.g. "6 / 2 × 3 = 9")
- Reference specific sections of the notes when applicable
- If asked to generate flashcards or tests, provide well-structured content
- Be encouraging and supportive in your tone
- If the notes don't contain information about a question, say so honestly`;

    // Build messages with vision support for images
    const apiMessages = messages.map((m: { role: string; content: string }) => {
      const base64Regex = /data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g;
      const imageMatches = m.content.match(base64Regex);

      if (imageMatches && imageMatches.length > 0) {
        const textContent = m.content.replace(base64Regex, "").replace(/\[Attached image: [^\]]+\]/g, "").trim();
        const parts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

        if (textContent) {
          parts.push({ type: "text", text: textContent });
        }

        for (const imgData of imageMatches) {
          parts.push({
            type: "image_url",
            image_url: { url: imgData },
          });
        }

        return {
          role: m.role as "user" | "assistant",
          content: parts,
        };
      }

      return {
        role: m.role as "user" | "assistant",
        content: m.content,
      };
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...apiMessages,
      ],
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content ?? "";

    // Parse note edit commands from the response
    let noteEdit: { action: "append" | "replace"; content: string } | null = null;
    let cleanContent = content;

    const appendMatch = content.match(/\[NOTE_APPEND\]([\s\S]*?)\[\/NOTE_APPEND\]/);
    const replaceMatch = content.match(/\[NOTE_REPLACE\]([\s\S]*?)\[\/NOTE_REPLACE\]/);

    if (appendMatch) {
      noteEdit = { action: "append", content: appendMatch[1].trim() };
      cleanContent = content.replace(/\[NOTE_APPEND\][\s\S]*?\[\/NOTE_APPEND\]/, "").trim();
    } else if (replaceMatch) {
      noteEdit = { action: "replace", content: replaceMatch[1].trim() };
      cleanContent = content.replace(/\[NOTE_REPLACE\][\s\S]*?\[\/NOTE_REPLACE\]/, "").trim();
    }

    return NextResponse.json({ content: cleanContent, noteEdit });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Chat response failed. Please try again." },
      { status: 500 }
    );
  }
}
