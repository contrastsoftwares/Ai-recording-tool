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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert educator who creates effective flashcards for studying. Given note content, generate flashcards that cover the key concepts, definitions, and important facts.

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
- Create 8-15 flashcards depending on the amount of content
- Mix question types: definitions, concept explanations, fill-in-the-blank, application questions
- Balance difficulty levels
- Front should be concise and clear
- Back should be thorough but not overly long
- Cover the most important material first`,
        },
        {
          role: "user",
          content: `Generate flashcards from these notes:\n\n${noteContent.slice(0, 30000)}`,
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
