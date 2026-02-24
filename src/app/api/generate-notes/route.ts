import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

const formatDescriptions: Record<string, string> = {
  "bullet-points": "Concise bullet points highlighting key ideas",
  sentences: "Full sentence paragraphs for detailed reading",
  cornell:
    "Cornell note format with a Cues | Notes table and a Summary section at the bottom",
  outline: "Hierarchical numbered outline (I. A. 1. a.)",
  "key-concepts": "Concept / Definition pairs for every key concept",
  summary: "Brief summary capturing the main points",
  timeline: "Chronological timeline with dates/times and events",
  "qa-format": "Question and answer pairs for active recall",
};

const lengthInstructions: Record<string, string> = {
  short:
    "Keep the notes brief and concise. Focus only on the most important key points. Aim for a short document that can be quickly reviewed — roughly 20-30% of what a full set of notes would be.",
  medium:
    "Create notes with a balanced level of detail. Cover all important topics but don't go into exhaustive detail on every point. This should be a moderate-length document.",
  long:
    "Create comprehensive, fully detailed notes. Cover every important topic, include supporting details, examples, and explanations. Be thorough — this should be a complete reference document.",
};

export async function POST(request: NextRequest) {
  try {
    const { content, formats, title, length } = await request.json();

    if (!content || !formats?.length) {
      return NextResponse.json(
        { error: "Missing content or formats" },
        { status: 400 }
      );
    }

    const formatInstructions = (formats as string[])
      .map((f) => formatDescriptions[f] || f)
      .join("; ");

    const noteLengthGuide =
      lengthInstructions[length as string] || lengthInstructions.medium;

    const systemPrompt = `You are an expert study assistant. Generate comprehensive, well-structured notes from the provided content using Markdown formatting.

The notes MUST follow these format(s): ${formatInstructions}.

Note length requirement: ${noteLengthGuide}

If multiple formats are requested, blend them intelligently into a single cohesive document with clear section headings.

Guidelines:
- Use proper Markdown: headings (##), bold (**text**), lists, tables where appropriate
- Include key terms, definitions, and relationships
- Add a brief summary at the end
- If the content is a transcript, clean up filler words and organize by topic`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate notes from the following content${title ? ` (source: "${title}")` : ""}:\n\n${content.slice(0, 100000)}`,
        },
      ],
      temperature: 0.3,
    });

    const notesContent = response.choices[0]?.message?.content ?? "";

    // Generate a title and tags with a cheaper model
    const metaResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'Given the following notes, provide a JSON object with "title" (short descriptive title, max 60 chars) and "tags" (array of 1-4 short topic tags). Respond ONLY with valid JSON.',
        },
        { role: "user", content: notesContent.slice(0, 3000) },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    let noteTitle = title || "Untitled Notes";
    let tags: string[] = [];
    try {
      const meta = JSON.parse(
        metaResponse.choices[0]?.message?.content ?? "{}"
      );
      if (meta.title) noteTitle = meta.title;
      if (Array.isArray(meta.tags)) tags = meta.tags;
    } catch {
      // Fallback: use provided title
    }

    return NextResponse.json({ title: noteTitle, content: notesContent, tags });
  } catch (error) {
    console.error("Note generation error:", error);
    return NextResponse.json(
      { error: "Note generation failed. Please try again." },
      { status: 500 }
    );
  }
}
