import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert image to base64 data URL
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = image.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert tutor who solves problems from images. Analyze the image and provide a detailed step-by-step solution.

Respond ONLY with valid JSON in this exact format:
{
  "subject": "Mathematics" or "Physics" or "Chemistry" or "Biology" or "Computer Science" or "Other",
  "subjectDetail": "Calculus" or "Algebra" or more specific topic,
  "problem": "Restate the problem clearly from the image",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Short title for this step",
      "explanation": "Detailed explanation of what we do in this step and why",
      "math": "Any mathematical expressions or formulas used (optional)"
    }
  ],
  "finalAnswer": "The final answer clearly stated"
}

Make sure:
- Each step is clear and educational
- Explanations are thorough enough for a student to learn from
- Include 3-8 steps depending on complexity
- The math field should contain any relevant formulas or calculations`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: dataUrl, detail: "high" },
            },
            {
              type: "text",
              text: "Please analyze and solve the problem in this image. Provide a step-by-step solution.",
            },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });

    const raw = response.choices[0]?.message?.content ?? "";

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = raw;
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const solution = JSON.parse(jsonStr);

    return NextResponse.json(solution);
  } catch (error) {
    console.error("Photo solver error:", error);
    return NextResponse.json(
      { error: "Failed to analyze the image. Please try again." },
      { status: 500 }
    );
  }
}
