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
- Explain WHY things matter, not just WHAT they are — every section needs a "significance" element`,

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
Create a detailed hierarchical outline with real depth:

I. **Main Topic — Brief Description of This Section's Focus**
   A. Subtopic with clear description and context
      1. Specific detail, fact, or example with concrete information
         a. Further elaboration, evidence, or supporting data
         b. Additional context, connection to other topics, or significance
      2. Another specific detail with names/dates/figures
      3. Implication or consequence of this subtopic
   B. Another subtopic — what it covers and why it matters
      1. Detail with supporting evidence from the source
      2. Another detail with specific examples
      3. How this subtopic connects to the broader theme
   C. Significance or implications of this entire topic
      1. Why this matters in the bigger picture
      2. Key takeaway for this section

---

II. **Next Main Topic — Description**
   (Same depth as above...)

Requirements:
- At least 6-10 main sections (Roman numerals), more for longer content
- Each main section must have at least 3-4 subtopics (A, B, C, D...)
- Each subtopic must have at least 2-3 specific details (1, 2, 3...)
- Go at least 3-4 levels deep throughout — shallow outlines are unacceptable
- Use **bold** for main topic names (Roman numeral level) with a brief description after the em dash
- Cover ALL topics from the entire source material — beginning through end
- Use --- dividers between main sections (between each Roman numeral group)
- The last subtopic under each main section should address significance/implications`,

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
  short: `**Length: Short (Concise — but cover EVERYTHING)**
CRITICAL: You MUST cover ALL topics, facts, and information from the source material. Do NOT skip or omit any content. "Short" means each point is brief and concise — NOT that you cover fewer topics.
- Each bullet/entry: 1-2 sentences max, get straight to the point
- Sub-bullets: minimal, only when essential for clarity
- Q&A answers: 2-3 sentences, direct and factual
- Key concepts: 2-3 sentences per entry
- Summary paragraphs: short and dense
- Create as many topic groups, entries, rows, or questions as needed to cover ALL content from the source material
The goal: a quick-reference guide that touches on EVERYTHING but doesn't elaborate. Cut wordiness and elaboration, never cut topics or facts.`,
  medium: `**Length: Medium (Substantial and Thorough — cover EVERYTHING)**
CRITICAL: You MUST cover ALL topics, facts, and information from the source material. Do NOT skip or omit any content. "Medium" means moderate detail per point.
- Each bullet/entry: 2-4 sentences with supporting details
- Sub-bullets: include where they add value
- Q&A answers: 4-5 sentences with specific details and examples
- Key concepts: 5-7 sentences each (definition, explanation, example)
- Summary: thorough paragraphs under clear subheadings
- Create as many topic groups, entries, rows, or questions as needed to cover ALL content from the source material
Each section should feel complete — a reader who only reads one section should still learn something substantial.`,
  long: `**Length: Long (Exhaustive and Comprehensive — cover EVERYTHING)**
CRITICAL: You MUST cover ALL topics, facts, and information from the source material. Do NOT skip or omit any content. "Long" means maximum detail per point.
- Each bullet/entry: 4-6+ sentences with examples, context, and analysis
- Sub-bullets: extensive, covering nuances and edge cases
- Q&A answers: 5-6 sentences covering all angles
- Key concepts: 6-8 sentences each (Definition, Explanation, Example, Connections)
- Summary: detailed paragraphs with comprehensive subheadings
- Create as many topic groups, entries, rows, or questions as needed to cover ALL content from the source material
Include supporting evidence, edge cases, nuances, counterarguments, and implications. Leave nothing out — every major AND minor topic deserves full coverage.`,
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
    const isAiDecide = (formats as string[]).includes("ai-decide");

    const formatSections = isAiDecide
      ? `## AI-Decide Mode — COMPREHENSIVE NOTE GENERATION

You are an expert study-note architect. Your job is to analyze the source material and choose the format(s) that will produce the MOST useful, comprehensive study notes for this specific content.

### Step 1: Analyze the Content
Read the entire source material and identify:
- The type of content (factual, narrative, procedural, argumentative, mixed)
- The key topics, themes, and structure
- What format(s) would best serve a student studying THIS specific material

### Step 2: Choose the Right Format(s) for the Content
Pick the format(s) that genuinely FIT the content — not more, not fewer. The number of formats is driven entirely by the content, NOT by the length setting. Length only controls how detailed each point is.

- A straightforward lecture might only need bullet-points — that's fine, use just 1 format
- A history documentary might benefit from timeline + key-concepts — use 2
- A complex scientific paper might call for bullet-points + key-concepts + qa-format — use 3
- Only add a format if it genuinely adds value for the student, not just to pad the notes

Use these as guidelines for matching content to formats:
- Factual/encyclopedic content → bullet-points, key-concepts
- Narrative/historical content → timeline, summary
- Procedural/how-to content → outline, bullet-points
- Argumentative/analytical content → sentences, qa-format
- Content with many terms/definitions → key-concepts
- Content a student needs to self-test on → qa-format
- Mix and match as the content demands — trust your judgment

### Step 3: Generate FULL Notes in Each Format
For EACH format you choose, generate a COMPLETE section that covers ALL the source material. Each format section must independently cover the entire content — do NOT split topics across formats. Every format section should be able to stand alone as a complete set of notes.

## ABSOLUTE RULE: ZERO CONTENT LOSS
Every single topic, fact, argument, example, name, date, figure, and detail from the source material MUST appear in your notes. The formats you choose control HOW the notes look and feel — they NEVER reduce how much content is included. If the source mentions it, your notes MUST include it. Missing even one topic is unacceptable — a student relying on these notes for an exam must find EVERYTHING from the source material.

Start with a brief line stating which format(s) you chose and why, then proceed with the full notes.

### Available Formats — FULL Descriptions (follow these exactly for each format you use):

${Object.entries(formatDescriptions).map(([key, val]) => `---\n\n#### Format: ${key}\n${val}`).join("\n\n")}`
      : (formats as string[])
        .map((f) => formatDescriptions[f] || f)
        .join("\n\n---\n\n");

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

## Format Instructions
${formatSections}

## Length
${noteLengthGuide}${longContentNote}

## OUTPUT FORMAT — CRITICAL

You MUST output well-structured Markdown. The rendering engine supports: headings (#, ##, ###), **bold**, *italic*, bullet lists (- item), numbered lists (1. item), > blockquotes, --- horizontal rules, and tables (| col | col |).

## DOCUMENT STRUCTURE

1. **Title**: Start with a single # heading. Add a relevant emoji before the title text. Make it compelling and specific.
   Example: \`# 🌍 The Amazon Rainforest: Earth's Green Heart\`

2. **Brief Overview**: Immediately after the title, write a 2-3 sentence overview paragraph (NOT a heading). Summarize the topic, scope, and key themes. **Bold** the most important terms.

3. **Major Sections with Emoji**: Use ## headings with a relevant emoji at the start for each major topic.
   Examples: \`## 🌳 Biodiversity & Ecosystems\`, \`## 💧 Water Cycle & Climate\`, \`## ⚠️ Threats & Conservation\`

4. **Granular Subsections**: Use ### headings for individual subtopics — one specific concept per ###.
   Examples: \`### Jaguar Population\`, \`### Carbon Sequestration Process\`, \`### Deforestation Statistics\`

5. **Section Dividers**: Use --- between every ## section for clean visual separation.

## FORMATTING RULES — TurboAI STYLE

- **Emoji Section Headings**: EVERY ## heading MUST start with a relevant emoji. Choose emojis that match the topic (🔬 for science, 📊 for data, 🏛️ for history, 💡 for insights, ⚡ for energy, 🌊 for water, etc.)
- **Bold Key Terms Pattern**: In bullets, always use the pattern: \`- **Key Term:** concise 1-2 line explanation\`. The bolded term acts as a scannable anchor.
- **Concise Bullets**: Each bullet should be 1-2 lines MAXIMUM. Pack information density — no fluff, no filler words. Be direct and factual.
- **Comparison Tables**: Whenever 2+ items, concepts, or entities are being compared, USE A TABLE. Tables are visually powerful.
  Example:
  | Feature | Amazon | Congo |
  |---------|--------|-------|
  | **Size** | 5.5M km² | 2M km² |
  | **Species** | 10% of all species | 11,000 plant species |
- **Blockquotes for Key Insights**: Use > sparingly (1-2 per ## section) for the most important takeaways, definitions, or "big picture" insights. Make them punchy and memorable.
  Example: \`> 💡 The Amazon produces 20% of the world's oxygen — it literally keeps the planet breathing.\`
- **No filler**: Remove ALL transcript artifacts (um, uh, like, you know, basically). Write in polished, professional prose.
- **No meta-commentary**: Never write "The speaker discusses...", "This section covers...". State information directly.
- **No LaTeX**: Write equations in plain text if needed.

## CONTENT QUALITY

- Every bullet must contain SPECIFIC information — names, dates, numbers, places, examples. Never write vague generalities.
- Sub-bullets must add NEW information — never rephrase the parent.
- Each ### subsection should focus on ONE specific concept, entity, or idea — keep them granular.
- Cover ALL major topics from the ENTIRE source — beginning, middle, and end — with roughly equal depth.
- Stay faithful to the source. Do not invent information.
- Write in a clear, educational tone — like a well-crafted modern textbook.

## WHAT NOT TO DO
- Do NOT produce sparse notes with only 1-2 bullets per section
- Do NOT use repetitive sentence patterns
- Do NOT write surface-level notes that list topics without substance
- Do NOT start every bullet with the same word
- Do NOT use generic headings like "Key Points" — be specific
- Do NOT write long paragraph-style bullets. Keep them to 1-2 lines.
- Do NOT forget emoji on ## headings — this is CRITICAL for visual quality
- Do NOT skip tables when items are being compared
- If multiple formats requested, include ONE summary total, not one per format

## MULTI-FORMAT
When multiple formats are requested, create a cohesive single document with clear ## headings separating each format section. Each format section must cover ALL the source material — do not split content across formats or skip topics in one format because they appear in another. Every format section should be independently complete. Use --- dividers between format sections.${languageInstruction}`;

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
