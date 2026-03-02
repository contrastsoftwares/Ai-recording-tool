import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

const formatDescriptions: Record<string, string> = {
  "bullet-points": `## Bullet-Point Notes
Create detailed bullet-point notes organized by topic/theme. Each main topic should be a heading (##) with multiple bullet points beneath it. Include:
- Main ideas as top-level bullets
- Supporting details, examples, and evidence as sub-bullets (indented with spaces)
- Bold (**key terms**) throughout
- Aim for thorough coverage — at least 5-8 main topic sections, each with 3-6 bullets`,

  sentences: `## Detailed Notes
Write thorough paragraph-style notes organized by topic. Each section should have a heading (##) followed by well-developed paragraphs (3-5 sentences each). Include:
- Bold (**key terms and concepts**) for easy scanning
- Multiple paragraphs per section covering all aspects
- Clear transitions between ideas
- Include examples, explanations, and context
- Aim for at least 5-8 sections with substantial content in each`,

  cornell: `## Cornell Notes
Create a Cornell-style notes table formatted as:

| Cue / Question | Notes |
|---|---|
| Key question or cue word | Detailed answer or explanation covering the topic fully |

Create at least 8-12 rows covering all major topics. Each "Notes" cell should be detailed (2-3 sentences minimum). After the table, add a "## Summary" section with a comprehensive paragraph summarizing the entire content.`,

  outline: `## Outline
Create a detailed hierarchical outline using proper numbering:
I. Main Topic
   A. Subtopic
      1. Detail
         a. Sub-detail
   B. Another subtopic
      1. Detail

Cover all major topics with at least 3 levels of depth. Aim for at least 5-8 main sections (Roman numerals) with detailed sub-points.`,

  "key-concepts": `## Key Concepts
Create a comprehensive list of key concepts formatted as:

**Concept Name**: Detailed definition and explanation (2-3 sentences minimum). Include context, significance, and examples where relevant.

Cover at least 10-15 key concepts. Bold the concept name and provide thorough explanations.`,

  summary: `## Summary
Write a thorough, comprehensive summary that captures ALL main points, key arguments, supporting evidence, and conclusions. The summary should:
- Be proportional to the source length (longer content = longer summary)
- Cover every major topic discussed
- Include key facts, figures, and examples
- Be organized in logical paragraphs (at least 3-5 paragraphs for substantial content)
- Highlight **key terms** in bold`,

  timeline: `## Timeline
Create a detailed chronological timeline of events, processes, or developments mentioned in the content. Format as:

**[Date/Time/Period/Stage]** — Detailed description of what happened, its significance, and relevant context (2-3 sentences).

Include at least 8-12 timeline entries. If exact dates aren't available, use relative sequencing (Stage 1, Phase 2, First, Next, etc.) with detailed descriptions.`,

  "qa-format": `## Questions & Answers
Create comprehensive Q&A pairs for active recall study. Format as:

**Q: [Thoughtful question that tests understanding]**
A: [Detailed answer with full explanation, examples, and context — 2-4 sentences minimum]

Create at least 10-15 Q&A pairs covering all major topics. Mix different question types: factual recall, conceptual understanding, application, and analysis.`,
};

const lengthInstructions: Record<string, string> = {
  short:
    "Keep notes concise but still informative. Cover the most important points with enough detail to be useful for revision. Aim for roughly 30-40% of what comprehensive notes would be. Even in short mode, each section should have meaningful content — never write just 1-2 sentences for a section.",
  medium:
    "Create well-developed notes with good detail. Cover all important topics with supporting details and examples. This is the standard level — thorough enough for effective studying. Each section should be substantial.",
  long:
    "Create exhaustive, fully comprehensive notes. Cover EVERY topic in detail with examples, explanations, context, and connections. Include supporting evidence, edge cases, and nuances. This should serve as a complete study reference — leave nothing important out.",
};

export async function POST(request: NextRequest) {
  try {
    const { content, formats, title, length, language } = await request.json();

    if (!content || !formats?.length) {
      return NextResponse.json(
        { error: "Missing content or formats" },
        { status: 400 }
      );
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 10) {
      return NextResponse.json(
        { error: "Content is too short to generate notes. Please provide at least a few sentences." },
        { status: 400 }
      );
    }

    // Build format instructions — each format gets its own detailed section prompt
    const formatSections = (formats as string[])
      .map((f) => formatDescriptions[f] || f)
      .join("\n\n---\n\n");

    const noteLengthGuide =
      lengthInstructions[length as string] || lengthInstructions.medium;

    const languageName = (language as string) || "english";
    const languageInstruction = languageName !== "english"
      ? `\n\nCRITICAL: Generate ALL notes entirely in ${languageName.charAt(0).toUpperCase() + languageName.slice(1)}. Every heading, bullet point, sentence, question, answer, table cell, and summary must be in ${languageName.charAt(0).toUpperCase() + languageName.slice(1)}. Do NOT mix languages.`
      : "";

    const systemPrompt = `You are an expert academic note-taker and study assistant. Your notes are known for being thorough, well-organized, and genuinely useful for studying.

Generate high-quality study notes from the provided content. The notes must be structured using the format(s) specified below.

## Formatting Requirements
${formatSections}

## Length Requirement
${noteLengthGuide}

## Quality Standards
1. **Thoroughness**: Cover ALL significant topics, concepts, and details from the source material. Do not skip or gloss over content.
2. **Rich formatting**: Use Markdown effectively:
   - Headings (## and ###) for clear structure
   - **Bold** for key terms, names, and important concepts (make them visually distinct)
   - Bullet points and numbered lists for organization
   - Tables where data comparison is useful
   - > Blockquotes for important quotes or definitions
3. **Depth**: Every section must have substantial content. A section with just 1-2 lines is unacceptable. Expand with explanations, examples, and context.
4. **Readability**: Use varied sentence structures. Break up dense information into digestible chunks. Add spacing between sections.
5. **Accuracy**: Stay faithful to the source material. Do not invent information.
6. **Single summary rule**: If multiple formats are requested and one of them is "Summary" or "Cornell" (which includes a summary), include ONLY ONE summary section total in the entire document. Never duplicate summaries.
7. **If content is a transcript**: Clean up filler words (um, uh, like), organize by topic rather than chronologically, and extract the core educational content.

## Multi-Format Blending
When multiple formats are requested, create a single cohesive document with clear section headings for each format. Each format section should stand on its own with full content — do not create one format and skimp on another.${languageInstruction}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate comprehensive study notes from the following content${title ? ` (Topic: "${title}")` : ""}:\n\n${content.slice(0, 100000)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 16000,
    });

    const notesContent = response.choices[0]?.message?.content ?? "";

    // Generate a title and tags with a cheaper model
    const metaResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'Given the following notes, provide a JSON object with "title" (short descriptive title, max 60 chars) and "tags" (array of 2-5 short topic tags). Respond ONLY with valid JSON.',
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
