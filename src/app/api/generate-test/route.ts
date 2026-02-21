import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
          content: `You are an expert educator who creates practice tests. Given note content, generate a comprehensive practice test with a mix of question types.

Respond ONLY with valid JSON in this format:
{
  "title": "Practice Test: [Topic]",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this is the correct answer"
    },
    {
      "type": "true-false",
      "question": "Statement to evaluate as true or false",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "explanation": "Why this is true/false"
    },
    {
      "type": "short-answer",
      "question": "Open-ended question",
      "correctAnswer": "Expected answer or key points to include",
      "explanation": "Detailed explanation"
    }
  ]
}

Guidelines:
- Generate 8-12 questions
- Mix: ~60% multiple choice, ~20% true/false, ~20% short answer
- Cover the most important concepts from the notes
- Questions should test understanding, not just memorization
- Include clear explanations for each answer
- Make distractors (wrong options) plausible but clearly wrong`,
        },
        {
          role: "user",
          content: `Generate a practice test from these notes:\n\n${noteContent.slice(0, 30000)}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    const data = JSON.parse(raw);

    const questions = (data.questions ?? []).map(
      (
        q: {
          type: string;
          question: string;
          options?: string[];
          correctAnswer: string;
          explanation: string;
        },
        index: number
      ) => ({
        id: `q-${Date.now()}-${index}`,
        type: q.type || "multiple-choice",
        question: q.question,
        options: q.options ?? [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })
    );

    return NextResponse.json({
      title: data.title || "Practice Test",
      questions,
    });
  } catch (error) {
    console.error("Test generation error:", error);
    return NextResponse.json(
      { error: "Test generation failed. Please try again." },
      { status: 500 }
    );
  }
}
