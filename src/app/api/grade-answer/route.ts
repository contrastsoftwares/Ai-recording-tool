import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { question, correctAnswer, userAnswer } = await request.json();

    if (!question || !correctAnswer || !userAnswer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a fair and helpful teacher grading a student's short-answer response. Compare the student's answer to the correct answer and grade it.

Respond ONLY with valid JSON in this format:
{
  "score": "correct" | "partial" | "incorrect",
  "feedback": "Brief explanation of the grade (1-2 sentences)"
}

Grading criteria:
- "correct": The student's answer captures the key points and is substantially correct
- "partial": The student's answer is on the right track but missing important points
- "incorrect": The student's answer is wrong or misses the main point entirely

Be fair — don't require exact wording, just the right concepts.`,
        },
        {
          role: "user",
          content: `Question: ${question}\n\nCorrect Answer: ${correctAnswer}\n\nStudent's Answer: ${userAnswer}`,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    const data = JSON.parse(raw);

    return NextResponse.json({
      score: data.score || "incorrect",
      feedback: data.feedback || "Unable to grade this answer.",
    });
  } catch (error) {
    console.error("Grading error:", error);
    return NextResponse.json(
      { error: "Grading failed. Please try again." },
      { status: 500 }
    );
  }
}
