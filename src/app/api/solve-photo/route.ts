import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Support multiple images: collect all "image" and "images" entries
    const images: File[] = [];
    const singleImage = formData.get("image") as File | null;
    if (singleImage) {
      images.push(singleImage);
    }
    const multiImages = formData.getAll("images") as File[];
    images.push(...multiImages);

    if (images.length === 0) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (images.length > 20) {
      return NextResponse.json(
        { error: "Maximum 20 images allowed per session" },
        { status: 400 }
      );
    }

    // Convert all images to base64 data URLs
    const imageContents = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const mimeType = image.type || "image/png";
        const dataUrl = `data:${mimeType};base64,${base64}`;
        return {
          type: "image_url" as const,
          image_url: { url: dataUrl, detail: "high" as const },
        };
      })
    );

    const imageCountNote =
      images.length > 1
        ? `There are ${images.length} images provided. They may be parts of the same problem, consecutive textbook problems, or lecture slides. Analyze all of them together and provide a comprehensive solution.`
        : "Please analyze and solve the problem in this image. Provide a step-by-step solution.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert tutor who solves problems from images. Analyze the image(s) and provide a detailed step-by-step solution.

Respond ONLY with valid JSON in this exact format:
{
  "subject": "Mathematics" or "Physics" or "Chemistry" or "Biology" or "Computer Science" or "Other",
  "subjectDetail": "Calculus" or "Algebra" or more specific topic,
  "problem": "Restate the problem clearly from the image(s)",
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
- The math field should contain any relevant formulas or calculations
- If multiple images are provided, address all problems shown across them`,
        },
        {
          role: "user",
          content: [
            ...imageContents,
            {
              type: "text",
              text: imageCountNote,
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
