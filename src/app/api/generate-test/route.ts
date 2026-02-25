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

    // Determine question count based on content length
    const wordCount = noteContent.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 10) {
      return NextResponse.json(
        { error: "Content is too short to generate a test. Please provide more content." },
        { status: 400 }
      );
    }
    let questionRange: string;
    if (wordCount < 100) {
      questionRange = "3-5";
    } else if (wordCount < 250) {
      questionRange = "4-6";
    } else if (wordCount < 500) {
      questionRange = "6-10";
    } else if (wordCount < 1500) {
      questionRange = "12-18";
    } else if (wordCount < 3000) {
      questionRange = "18-25";
    } else if (wordCount < 6000) {
      questionRange = "25-35";
    } else if (wordCount < 12000) {
      questionRange = "35-50";
    } else {
      questionRange = "50-70";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert educator who creates comprehensive practice tests. Given content, generate a thorough test that covers ALL the important topics and concepts.

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
- Generate ${questionRange} questions — match the amount to how much content there actually is
- Do NOT pad with filler or repetitive questions just to hit a number. If the content only supports 4 good questions, make 4.
- Mix: ~60% multiple choice, ~20% true/false, ~20% short answer
- Cover ALL important concepts from the content, not just the beginning
- Questions should test understanding, not just memorization
- Include clear explanations for each answer
- Make distractors (wrong options) plausible but clearly wrong
- Ensure later topics in the content are also tested`,
        },
        {
          role: "user",
          content: `Generate a comprehensive practice test from this content:\n\n${noteContent.slice(0, 50000)}`,
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
