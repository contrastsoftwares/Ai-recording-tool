import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

const formatDescriptions: Record<string, string> = {
  "bullet-points": `## Bullet-Point Notes
Create detailed, multi-layered bullet-point notes organized by topic/theme. Structure:

### [Topic Name]
- **Main idea or key point** — elaboration on why it matters and its significance in context
  - Supporting detail, example, or evidence with specific information (names, dates, figures)
  - Additional context: how this relates to the broader subject or real-world applications
  - Connection to other concepts discussed elsewhere in the material
  - Implication or consequence of this point
- **Another main point** — thorough explanation with cause-and-effect reasoning
  - Sub-detail with specifics (names, dates, figures, locations, etc.)
  - Further elaboration: why this matters or what it led to
  - Example or case study illustrating this point
- **A third main point** — analysis or deeper insight
  - Evidence from the source material
  - Comparison or contrast with related ideas

Requirements:
- At least 6-10 main topic sections, each with its own ### heading
- Each topic must have 4-8 top-level bullets MINIMUM
- Every top-level bullet MUST have 3-5 indented sub-bullets with specific, non-redundant details
- **Bold** all key terms, names, important concepts, and critical facts at the top-level bullet
- Use --- dividers between topic sections
- Sub-bullets must add NEW information (evidence, examples, context, implications) — NEVER just rephrase the parent bullet
- Include at least one "So what?" insight per topic explaining why the topic matters in the bigger picture`,

  sentences: `## Detailed Notes
Write thorough paragraph-style notes organized by topic. Structure:

### [Topic Name]
Well-developed opening paragraph with **bolded key terms** explaining the topic in depth. Each paragraph should be 4-6 sentences covering what happened, why it matters, and how it connects to other topics. Include specific details like **names**, **dates**, **statistics**, and **locations**. Do not be vague — anchor every claim in a concrete detail from the source.

A second paragraph expanding on a different aspect of this topic, providing examples, evidence, or deeper analysis. Explain **cause-and-effect** relationships and the **significance** of what is described. Draw connections to other sections of the material.

A third paragraph (where appropriate) offering broader context, implications, or a synthesis of the key takeaways from this topic. What should the reader remember most?

> Key insight or memorable quote from this section, if applicable.

Requirements:
- At least 6-10 topic sections, each with its own ### heading
- Each section must have 3-5 well-developed paragraphs (4-6 sentences each) — NEVER just 1-2 sentences
- **Bold** key terms, names, concepts, dates, and figures LIBERALLY throughout — when scanning, the bolded terms should give a reader a quick overview
- Include specific examples, evidence, and context — not vague generalities
- Use --- dividers between sections
- Use > blockquotes for standout insights, key definitions, or memorable quotes
- Explain WHY things matter, not just WHAT they are — every section needs a "significance" element
- CRITICAL: Do NOT end each section with the same or a near-identical closing sentence. Any closing insight must be UNIQUE to that section's specific content — never reuse a generic boilerplate line (e.g. repeating "The Amazon is a vital ecosystem..." after every section is forbidden).`,

  cornell: `## Cornell Notes
Create a comprehensive Cornell-style notes table:

| Cue / Question | Notes |
|---|---|
| **Key concept or question** | Detailed explanation covering the topic thoroughly. Include specific **facts**, **examples**, and **context**. Explain significance and connections to other topics. Must be 4-6 sentences with concrete details — never vague or surface-level. |
| **Another key topic** | Thorough notes with supporting details, evidence, and real-world relevance. Include **who**, **what**, **when**, **where**, **why**, and **how** as applicable. (4-6 sentences per cell) |
| **Why does [X] matter?** | Analytical response that explains the significance, implications, and connections to broader themes. Include evidence from the source. (4-6 sentences) |

Requirements:
- At least 12-20 rows covering ALL major topics from the entire source material
- Each "Cue" cell should be a meaningful question or concept name in **bold** — mix factual cues ("What is X?") with analytical cues ("Why does X matter?", "How does X relate to Y?")
- Each "Notes" cell must be detailed: 4-6 sentences minimum with specific, concrete information — no single-sentence cells
- Cover topics from the beginning, middle, AND end of the source material proportionally
- After the table, add:
  ### Summary
  3-4 comprehensive paragraphs synthesizing the key themes, arguments, and insights from the entire source. The summary should connect ideas across topics and highlight the most important takeaways. **Bold** key terms throughout.
- The summary must add analytical value — synthesize and connect ideas, do not just repeat table contents`,

  outline: `## Outline
Create a detailed hierarchical outline using NESTED markdown lists. Use a numbered list for main topics and indent nested bullet lists (2 spaces per level) for subtopics and details:

1. **Main Topic — Brief Description of This Section's Focus**
   - Subtopic with clear description and context
     - Specific detail, fact, or example with concrete information
     - Further elaboration, evidence, or supporting data
   - Another subtopic — what it covers and why it matters
     - Detail with supporting evidence from the source
     - How this subtopic connects to the broader theme
   - Significance or implications of this entire topic
2. **Next Main Topic — Description**
   - (Same depth as above...)

Requirements:
- Use a top-level numbered list (1. 2. 3.) for main topics — at least 6-10, more for longer content
- Under each main topic, nest a bulleted list of subtopics (indent 2 spaces before the "-")
- Under each subtopic, nest a further bulleted list of specific details (indent 4 spaces)
- Go at least 3 levels deep throughout — shallow outlines are unacceptable
- Use **bold** for main topic names with a brief description after the em dash
- Cover ALL topics from the entire source material — beginning through end
- The last subtopic under each main topic should address significance/implications
- IMPORTANT: use proper 2-space indentation for nesting so the hierarchy renders correctly — do NOT use "I./A./a." style labels`,

  "key-concepts": `## Key Concepts
Create a comprehensive glossary of key concepts:

---

### **Concept Name**
**Definition:** Clear, precise definition of the concept in 1-2 sentences.

**Explanation:** Why this concept matters and how it fits into the broader subject. What role does it play? What are its key characteristics? (2-3 sentences with specific details)

**Example:** A concrete example or application from the source material that illustrates this concept. (1-2 sentences)

**Connections:** How this concept relates to other key concepts in the material. (1 sentence)

---

### **Another Concept**
(Same structured depth as above...)

---

Requirements:
- At least 12-20 key concepts, more for longer content
- Each concept gets its own ### heading in **bold**
- Each concept entry must include all four parts: Definition, Explanation, Example, and Connections
- Total per concept should be 5-8 sentences — not just a dictionary definition
- **Bold** the sub-labels (Definition, Explanation, Example, Connections) within each entry
- Use --- dividers between concepts
- Cover concepts from the ENTIRE source — beginning, middle, and end
- Order concepts logically (by topic or by order of appearance), not randomly`,

  summary: `## Summary
Write a thorough, comprehensive summary organized into clear subsections:

### Overview
Concise 3-4 sentence overview of the entire topic/content — what is it about, who/what is involved, and what is the central argument or narrative? **Bold** the most critical terms.

### Main Themes and Arguments
Detailed paragraphs covering every major theme. Each theme gets its own well-developed paragraph (4-6 sentences) with **bolded key terms**. Explain not just what each theme is, but why it matters and how it connects to the overall subject. Cover themes from the entire source.

### Key Evidence and Examples
The most important supporting details, data points, examples, and evidence. Organize by theme or topic. **Bold** specific facts, names, dates, and figures. Each piece of evidence should be tied to why it matters.

### Implications and Significance
What are the broader implications? What should the reader take away? How does this material connect to larger issues, trends, or ideas? What are the most important conclusions?

> **Key Takeaway:** One sentence capturing the single most important insight from the entire source.

Requirements:
- Be proportional to the source length (longer content = longer, more detailed summary)
- At least 5-8 substantial paragraphs organized under ### subheadings
- Cover every major topic discussed across the ENTIRE source — beginning to end
- Include specific key facts, figures, names, and examples — not vague generalities
- **Bold** key terms and important concepts HEAVILY throughout — a reader skimming the bold text alone should get the main ideas
- Explain significance and connections, not just surface-level facts
- End with a > blockquote "Key Takeaway" capturing the most important insight
- Use --- dividers between subsections`,

  timeline: `## Timeline
Create a detailed chronological timeline covering the ENTIRE source material:

---

### **[Date/Time/Period/Stage 1]**
Detailed description of what happened during this period. Include **who** was involved, **what** specifically occurred, and **where** it took place. Explain **why** this event or development matters in the broader context. Provide connections to what came before and what follows. (3-5 sentences)

---

### **[Date/Time/Period/Stage 2]**
Next event or development with similar detail. Include the key players, specific actions, and outcomes. Explain how this builds on the previous stage and sets up what comes next. (3-5 sentences)

---

### **[Date/Time/Period/Stage 3]**
Continue with same depth...

---

(Continue for ALL major events/stages throughout the entire source)

Requirements:
- At least 10-15 timeline entries MINIMUM (more for longer content — aim for 15-25 for substantial sources like documentaries, lectures, or long articles)
- Each entry MUST have 3-5 sentences of description — entries with only 1-2 sentences are unacceptable
- Use ### headings with **bold** for each time marker so they visually stand out
- Use --- dividers between each timeline entry for visual clarity
- If exact dates are mentioned, use them; otherwise use descriptive sequencing (**Early period**, **Phase 1**, **Meanwhile**, **Following this**, **By mid-point**, **In the final stage**, etc.)
- Cover events from the ENTIRE source — beginning, middle, AND end, with roughly equal coverage across all portions
- Every entry must address: what happened, who was involved, and why it matters
- **Bold** key names, places, and critical terms within descriptions
- The timeline must tell a coherent story — each entry should connect to the narrative arc`,

  "qa-format": `## Questions & Answers
Create comprehensive Q&A pairs that test deep understanding:

---

**Q: [Thoughtful question that requires understanding, not just recall]**

**A:** Detailed answer with full explanation — 4-6 sentences. Start with a direct answer to the question. Then provide supporting **evidence** or **examples** from the source. Explain the context for why this matters. Connect to other topics where relevant. End with a broader insight or implication.

---

**Q: [Another question covering a different topic from a different part of the source]**

**A:** Similarly detailed answer with the same depth and structure...

---

Requirements:
- At least 15-25 Q&A pairs covering ALL major topics from the entire source
- Use --- dividers between each Q&A pair
- Mix question types across these categories (aim for at least 2-3 of each):
  - **Factual recall:** "What are the key characteristics of...?"
  - **Cause and effect:** "Why does X lead to Y?"
  - **Compare/contrast:** "How does X compare to Y?"
  - **Application:** "What would happen if...?" or "How could X be applied to...?"
  - **Synthesis:** "What is the relationship between X and Y?"
  - **Evaluation:** "What is the significance of...?" or "Why is X considered important?"
- Every answer must be 4-6 sentences with specific details — short answers are unacceptable
- **Bold** the "A:" label and **bold** key terms in both questions and answers
- Cover topics from the ENTIRE source material proportionally — beginning, middle, AND end
- Questions should progress from foundational to more analytical/complex as they go`,
};

const lengthInstructions: Record<string, string> = {
  short: `**Length: SHORT — the most compact of the three tiers (but still cover EVERYTHING)**
CRITICAL: You MUST cover ALL topics, facts, and information from the source material. "Short" means each point is brief — NOT fewer topics.
- Each bullet/entry: exactly 1 concise sentence (or a short phrase). No elaboration.
- Sub-bullets: avoid unless essential for clarity.
- Q&A answers: 1-2 sentences, direct and factual.
- Key concepts: definition + 1 short explanation sentence (2 sentences total).
- Paragraph formats (Detailed Notes/Summary): 2-3 short sentences per paragraph.
The goal: a quick-reference guide that touches on EVERYTHING with minimal words. This tier must be clearly SHORTER than Medium.`,
  medium: `**Length: MEDIUM — moderate detail, clearly between Short and Long (cover EVERYTHING)**
CRITICAL: You MUST cover ALL topics, facts, and information from the source material. "Medium" means moderate detail per point.
- Each bullet/entry: 2-3 sentences with a supporting detail or example.
- Sub-bullets: include where they add value.
- Q&A answers: 3-4 sentences with specific details.
- Key concepts: 4-5 sentences (definition, explanation, one example).
- Paragraph formats (Detailed Notes/Summary): 4-5 sentence paragraphs.
This tier must be clearly MORE than Short and clearly LESS than Long.`,
  long: `**Length: LONG — the most detailed of the three tiers (cover EVERYTHING)**
CRITICAL: You MUST cover ALL topics, facts, and information from the source material. "Long" means maximum detail per point.
- Each bullet/entry: 5-8 sentences with examples, context, cause/effect, and analysis.
- Sub-bullets: extensive, covering nuances and edge cases.
- Q&A answers: 6-8 sentences covering all angles.
- Key concepts: 7-10 sentences (Definition, Explanation, Example, Connections, implications).
- Paragraph formats (Detailed Notes/Summary): 6-8 sentence paragraphs with evidence and analysis.
Include supporting evidence, edge cases, nuances, counterarguments, and implications. This tier must be clearly the LONGEST and most detailed — noticeably longer than Medium.`,
};

// Guard the length ordering so Long is always the most detailed and Short the
// least. This prevents the tiers from coming out inverted or too similar.
const lengthOrderingNote = `\n\nIMPORTANT — LENGTH ORDERING: The three length tiers must always satisfy Short < Medium < Long in total detail and word count. Whatever tier is selected above, honor it precisely so the result is unambiguously that tier's level of detail.`;

// Display name + emoji for each format, used to label multi-format sections.
const formatMeta: Record<string, { name: string; emoji: string }> = {
  "bullet-points": { name: "Bullet-Point Notes", emoji: "📝" },
  sentences: { name: "Detailed Notes", emoji: "📄" },
  cornell: { name: "Cornell Notes", emoji: "📇" },
  outline: { name: "Outline", emoji: "🗂️" },
  "key-concepts": { name: "Key Concepts", emoji: "🔑" },
  summary: { name: "Summary", emoji: "🧾" },
  timeline: { name: "Timeline", emoji: "⏳" },
  "qa-format": { name: "Q&A", emoji: "❓" },
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

    // The user selects exactly ONE option: either "mix-and-match" (AI formats
    // each section in the style that best fits it) or a single specific format.
    const isMixAndMatch = (formats as string[]).includes("mix-and-match");
    const selectedFormats = (formats as string[]).filter((f) => f !== "mix-and-match");
    const singleFormat = selectedFormats[0];

    const formatSections = isMixAndMatch
      ? `## Mix & Match Mode — PER-SECTION OPTIMAL FORMATTING

You are an expert study-note designer. Produce ONE cohesive, beautiful study-note document. As you work through the source material, break it into logical sections and format EACH section in whichever single style best suits THAT section's content. Different sections will use different formats — that variety is the whole point.

### How to choose a format for each section
- Lists of facts, features, or takeaways → **bullet points** (concise, scannable)
- Narrative, explanation, or nuanced discussion → **prose paragraphs** (sentences)
- Comparisons, cause/effect, or cue→detail material → a **table** (e.g. Cornell-style or a comparison table)
- Anything chronological (events, stages, history) → a **timeline**
- Sections dense with terms/definitions → a **key-concepts** glossary (Definition / Explanation / Example)
- Hierarchical or step-by-step material → a nested **outline**
- Material a student should self-test on → a few **Q&A** pairs
Pick the ONE best fit per section — do not format the same content two different ways.

### CRITICAL: no repetition
Each fact, topic, and detail must appear EXACTLY ONCE, in the single section/format where it fits best. Do NOT repeat the same information across multiple sections or formats. This is what makes Mix & Match better than picking every format separately.

### Structure
- Give each section a \`## <emoji> <Section Title>\` heading and a \`---\` divider between sections.
- Choose the format that reads best for that section; a well-made document naturally varies between bullets, prose, tables, timelines, etc.

## ABSOLUTE RULE: ZERO CONTENT LOSS
Every topic, fact, argument, example, name, date, and figure from the source MUST appear somewhere in the notes (once). If the source mentions it, your notes must include it.

### Format style references (apply the relevant one to each section):

${Object.entries(formatDescriptions).map(([key, val]) => `---\n\n#### Style: ${key}\n${val}`).join("\n\n")}`
      : (formatDescriptions[singleFormat] || singleFormat);

    // With single-select there is always exactly one choice: Mix & Match, or one
    // specific format applied to the whole note.
    let structureDirective: string;
    if (isMixAndMatch) {
      structureDirective =
        "The user chose Mix & Match. Follow the Mix & Match instructions in the Format Specifications below: format EACH section in the single style that best fits its content, vary formats across sections, and never repeat the same content in more than one place.";
    } else {
      const meta = formatMeta[singleFormat];
      structureDirective = `The user requested ONE format: ${meta?.name || singleFormat}. Produce the ENTIRE note in that single format, following its specification exactly. Do not use any other format.`;
    }

    const noteLengthGuide =
      lengthInstructions[length as string] || lengthInstructions.medium;

    const languageName = (language as string) || "english";
    const languageInstruction = languageName !== "english"
      ? `\n\nCRITICAL: Generate ALL notes entirely in ${languageName.charAt(0).toUpperCase() + languageName.slice(1)}. Every heading, bullet point, sentence, question, answer, table cell, and summary must be in ${languageName.charAt(0).toUpperCase() + languageName.slice(1)}. Do NOT mix languages.`
      : "";

    const isLongContent = content.length > 100000;
    const longContentNote = isLongContent
      ? `\n\n## Important: Long Source Material
The source material is very lengthy. You MUST still cover ALL major topics and themes throughout the ENTIRE transcript/content — from beginning to end. Do not stop partway through or only cover the first portion. To manage length, be more concise in your explanations while ensuring every major topic, event, argument, and theme across the full duration is represented. Prioritize breadth of coverage across the entire source over extreme depth on any single point.`
      : "";

    const systemPrompt = `You are a premium study-note AI that produces beautifully formatted, TurboAI-quality study notes. Your output should look like a polished, visually striking study guide — the kind that top EdTech tools like TurboAI, Notion AI, or premium study apps create.

Generate study notes from the provided content using the format(s) specified below.

## CRITICAL: ZERO CONTENT LOSS — THIS IS THE #1 RULE
A student will use these notes to study for an exam. If ANY information from the source is missing, they could fail a question. You MUST convert ALL information from the source material into notes — every topic, fact, argument, example, name, date, figure, and detail mentioned in the source MUST appear in the output.

- **Format** controls HOW the notes look (bullet points vs Q&A vs summary, etc.) — it NEVER reduces content
- **Length** controls HOW DETAILED each point is (brief vs. thorough) — it NEVER reduces content
- "Short" means each point uses fewer words, NOT that you include fewer points
- "Bullet points" means information is in bullet format, NOT that you leave out information that doesn't fit bullets

If the source material discusses 20 topics, your notes must cover all 20 topics. If it mentions 50 facts, all 50 must appear. NOTHING gets left out. Go through the source material from beginning to end and ensure every section is represented in your output.

## HOW TO STRUCTURE THIS NOTE — READ THIS FIRST
${structureDirective}

## Format Specifications
${formatSections}

## Length
${noteLengthGuide}${lengthOrderingNote}${longContentNote}

## OUTPUT FORMAT — CRITICAL

You MUST output well-structured Markdown. The rendering engine supports: headings (#, ##, ###), **bold**, *italic*, bullet lists (- item), numbered lists (1. item), NESTED lists (indent 2 spaces per level), > blockquotes, --- horizontal rules, and GitHub-flavored tables (| col | col | with a |---|---| separator row).

## DOCUMENT OPENING (write this once, at the very top — before any format section)

1. **Title**: A single # heading with a relevant emoji. Make it compelling and specific.
   Example: \`# 🌍 The Amazon Rainforest: Earth's Green Heart\`
2. **Brief Overview**: Immediately after the title, a 2-3 sentence overview paragraph (NOT a heading) summarizing the topic, scope, and key themes. **Bold** the most important terms.

After the opening, produce the format section(s) exactly as described in "HOW TO STRUCTURE THIS NOTE" above.

## VISUAL POLISH (apply WITHIN each format — never change a format's required structure)

- **Emoji headings**: Start each major \`##\` section heading with a relevant emoji.
- **Bold key terms**: Bold names, dates, figures, and key terms so they are scannable at a glance.
- **Bullet pattern**: In bullet-style content, use \`- **Key Term:** concise explanation\`. This applies ONLY to bullet-based formats — do NOT turn tables, Q&A, timelines, outlines, or prose (Detailed Notes) into bullet lists.
- **Real tables**: When a format requires a table (e.g. Cornell Notes) or when comparing 2+ items, output a GitHub-flavored table with a \`|---|---|\` separator row.
- **Blockquotes**: Use \`>\` sparingly for standout insights or key takeaways.
- **Clean prose**: Remove all transcript artifacts (um, uh, like, you know). No meta-commentary ("This section covers..."). No LaTeX — plain text equations.

## CONTENT QUALITY

- Every point must contain SPECIFIC information — names, dates, numbers, places, examples. Never vague generalities.
- Sub-points must add NEW information — never rephrase the parent.
- Cover ALL major topics from the ENTIRE source — beginning, middle, and end — with roughly equal depth.
- Stay faithful to the source. Do not invent information.
- Write in a clear, educational tone — like a well-crafted modern textbook.

## WHAT NOT TO DO
- Do NOT merge separately-requested formats into one blended document — each requested format MUST appear as its own section in its own distinct structure.
- Do NOT turn every format into bullet points — a Cornell section must be a table, a Q&A section must be Q:/A: pairs, etc.
- Do NOT skip any requested format.
- Do NOT produce sparse notes, surface-level lists, or repetitive sentence patterns.
- Do NOT repeat the same closing/summary sentence across multiple sections — vary the wording and make each unique to its section.
- Do NOT use generic headings like "Key Points" — be specific.
- Do NOT skip a table when a format requires one or when comparing items.${languageInstruction}`;

    // Always use maximum output tokens — GPT-4o caps at ~16K
    // The prompt controls how detailed/concise notes are, not the token limit
    // We never want the model to cut off mid-note due to token limits
    const maxTokens = 16000;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate comprehensive study notes from the following content${title ? ` (Topic: "${title}")` : ""}:\n\n${content.slice(0, 500000)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: maxTokens,
    });

    const notesContent = response.choices[0]?.message?.content ?? "";

    // Generate a title and tags with a cheaper model
    const metaLanguageInstruction = languageName !== "english"
      ? ` The title and tags MUST be written in ${languageName.charAt(0).toUpperCase() + languageName.slice(1)}.`
      : "";
    const metaResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            `Given the following notes, provide a JSON object with "title" (short descriptive title, max 60 chars) and "tags" (array of 2-5 short topic tags). Respond ONLY with valid JSON.${metaLanguageInstruction}`,
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
