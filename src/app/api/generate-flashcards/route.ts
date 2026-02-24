import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { noteContent } = await request.json();

    if (!noteContent) {
      return NextResponse.json(
        { error: "No note content provided" },
        { status: 400 }
      );
    }

    // Determine flashcard count based on content length
    const wordCount = noteContent.split(/\s+/).length;
    let cardRange: string;
    if (wordCount < 500) {
      cardRange = "5-8";
    } else if (wordCount < 1500) {
      cardRange = "10-15";
    } else if (wordCount < 3000) {
      cardRange = "15-25";
    } else if (wordCount < 6000) {
      cardRange = "25-35";
    } else {
      cardRange = "35-50";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert educator who creates effective flashcards for studying. Given content, generate flashcards that cover ALL the key concepts, definitions, and important facts.

Respond ONLY with valid JSON in this format:
{
  "cards": [
    {
      "front": "Question or term on the front of the card",
      "back": "Answer or definition on the back of the card",
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}

Guidelines:
- Create ${cardRange} flashcards — enough to cover all the content thoroughly
- Mix question types: definitions, concept explanations, fill-in-the-blank, application questions
- Balance difficulty levels
- Front should be concise and clear
- Back should be thorough but not overly long
- Cover ALL important material, not just the first few topics
- If content is lengthy, make sure later topics are also covered`,
        },
        {
          role: "user",
          content: `Generate flashcards from this content:\n\n${noteContent.slice(0, 50000)}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    const data = JSON.parse(raw);

    const cards = (data.cards ?? []).map(
      (
        card: { front: string; back: string; difficulty?: string },
        index: number
      ) => ({
        id: `fc-${Date.now()}-${index}`,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty || "medium",
        timesReviewed: 0,
        lastReviewed: null,
      })
    );

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return NextResponse.json(
      { error: "Flashcard generation failed. Please try again." },
      { status: 500 }
    );
  }
}
