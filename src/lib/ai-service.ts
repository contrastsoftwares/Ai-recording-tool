import type { TranscriptSegment, NoteFormat } from "@/types/note";
import type { Message } from "@/types/chat";
import type { Flashcard } from "@/types/flashcard";
import type { Question } from "@/types/test";
import {
  mockTranscriptSegments,
  mockFlashcardDecks,
  mockPracticeTests,
  mockConversations,
  type SolutionStep,
} from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// AI Service Interface
// ---------------------------------------------------------------------------

export interface AIService {
  transcribe(audioBlob: Blob): Promise<TranscriptSegment[]>;
  generateNotes(transcript: string, formats: NoteFormat[]): Promise<string>;
  generateFlashcards(noteContent: string): Promise<Flashcard[]>;
  generateTest(noteContent: string): Promise<Question[]>;
  chat(noteContent: string, messages: Message[]): Promise<string>;
  solvePhoto(imageBlob: Blob): Promise<SolutionStep[]>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(minMs = 1000, maxMs = 3000): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return delay(ms);
}

// ---------------------------------------------------------------------------
// Mock Implementation
// ---------------------------------------------------------------------------

class MockAIService implements AIService {
  async transcribe(_audioBlob: Blob): Promise<TranscriptSegment[]> {
    await randomDelay(2000, 3000);
    return mockTranscriptSegments;
  }

  async generateNotes(
    _transcript: string,
    formats: NoteFormat[]
  ): Promise<string> {
    await randomDelay(1500, 2500);

    const formatLabel = formats
      .map((f) =>
        f
          .replace("-", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      )
      .join(", ");

    return (
      `# AI-Generated Notes (${formatLabel})\n\n` +
      `## Key Points\n\n` +
      `- The material covers several foundational concepts that are essential for understanding this topic.\n` +
      `- Important terminology and definitions have been identified and organized below.\n` +
      `- Relationships between concepts are highlighted to support deeper comprehension.\n\n` +
      `## Detailed Notes\n\n` +
      `The primary subject introduces core principles that form the foundation for more advanced study. ` +
      `Understanding these basics is critical before moving on to applied topics.\n\n` +
      `Key definitions include the fundamental terms used throughout this field. ` +
      `Each concept builds upon the previous one, creating a logical progression of knowledge.\n\n` +
      `## Summary\n\n` +
      `This material provides a comprehensive overview of the topic, covering essential concepts, ` +
      `terminology, and their practical applications. Review the key points above for exam preparation.`
    );
  }

  async generateFlashcards(_noteContent: string): Promise<Flashcard[]> {
    await randomDelay(1500, 2500);
    // Return cards from the first mock deck
    return mockFlashcardDecks[0]?.cards ?? [];
  }

  async generateTest(_noteContent: string): Promise<Question[]> {
    await randomDelay(2000, 3000);
    // Return questions from the first mock test
    return mockPracticeTests[0]?.questions ?? [];
  }

  async chat(_noteContent: string, messages: Message[]): Promise<string> {
    await randomDelay(1000, 2000);

    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === "user");

    if (!lastUserMessage) {
      return "I'm here to help you study! Ask me anything about your notes.";
    }

    const content = lastUserMessage.content.toLowerCase();

    if (content.includes("summarize") || content.includes("summary")) {
      return (
        "Here is a summary of the key points from your notes:\n\n" +
        "**1. Core Concepts** - The material introduces foundational ideas that are essential for understanding the broader topic. " +
        "These concepts serve as building blocks for more advanced study.\n\n" +
        "**2. Key Terminology** - Several important terms are defined and explained in context. " +
        "Understanding these definitions is critical for exam preparation.\n\n" +
        "**3. Practical Applications** - The notes highlight how theoretical concepts connect to real-world scenarios, " +
        "making the material more relatable and easier to remember.\n\n" +
        "Would you like me to dive deeper into any of these areas?"
      );
    }

    if (content.includes("explain") || content.includes("what is")) {
      return (
        "Great question! Let me break this down:\n\n" +
        "The concept you are asking about is fundamental to this subject area. " +
        "At its core, it describes a relationship between key variables that govern how the system behaves.\n\n" +
        "**Key insight:** Think of it as a framework for understanding cause and effect within this domain. " +
        "When one factor changes, it creates a predictable ripple effect on the others.\n\n" +
        "Here is a simple analogy: imagine adjusting the temperature on a thermostat. " +
        "The change does not just affect the temperature -- it influences energy consumption, comfort level, and cost. " +
        "Similarly, this concept connects multiple factors in a meaningful way.\n\n" +
        "Would you like me to provide specific examples from your notes?"
      );
    }

    if (content.includes("exam") || content.includes("test") || content.includes("quiz")) {
      return (
        "Based on your notes, here are the most likely exam topics:\n\n" +
        "1. **Definitions** - Be prepared to define key terms in your own words. " +
        "Focus on the core terminology introduced in the material.\n\n" +
        "2. **Compare and Contrast** - You may be asked to distinguish between related concepts. " +
        "Pay attention to similarities and differences.\n\n" +
        "3. **Application Questions** - Expect scenarios where you need to apply concepts to new situations. " +
        "Practice with examples beyond what was covered in the notes.\n\n" +
        "4. **Short Answer** - Prepare concise explanations for the main ideas. " +
        "Use specific details from the material to support your answers.\n\n" +
        "Would you like me to generate practice questions on any of these topics?"
      );
    }

    if (content.includes("flashcard") || content.includes("study")) {
      return (
        "Here is a study plan based on your notes:\n\n" +
        "**Day 1:** Review all key definitions and terminology. Create flashcards for terms you find challenging.\n\n" +
        "**Day 2:** Focus on understanding the relationships between concepts. Draw diagrams or mind maps to visualize connections.\n\n" +
        "**Day 3:** Practice application questions. Try explaining each concept to someone else (or out loud) without looking at your notes.\n\n" +
        "**Day 4:** Take a practice test to identify weak areas. Spend extra time reviewing topics where you scored lowest.\n\n" +
        "**Day 5:** Final review of everything, focusing on areas of weakness. Get a good night's sleep!\n\n" +
        "Shall I generate flashcards or a practice test to help with this plan?"
      );
    }

    // Default contextual response
    const sampleConv = mockConversations[0];
    if (sampleConv && sampleConv.messages.length >= 2) {
      const assistantMsg = sampleConv.messages.find(
        (m) => m.role === "assistant"
      );
      if (assistantMsg) {
        return assistantMsg.content;
      }
    }

    return (
      "That is a great question! Based on your notes, here are the key insights I found:\n\n" +
      "The material covers several important concepts that are worth reviewing. " +
      "I recommend focusing on the core definitions and their relationships to build a strong understanding.\n\n" +
      "Would you like me to go deeper into any specific area, or shall I generate flashcards to help you study?"
    );
  }

  async solvePhoto(_imageBlob: Blob): Promise<SolutionStep[]> {
    await randomDelay(2000, 3000);
    return (
      [
        {
          stepNumber: 1,
          title: "Identify the problem type",
          explanation:
            "Based on the image, this appears to be a standard problem that can be solved using well-known techniques. Let us break it down step by step.",
          math: "Given information extracted from the image",
        },
        {
          stepNumber: 2,
          title: "Set up the equation",
          explanation:
            "Using the identified variables and relationships, we can formulate the equation that describes this problem. This step translates the visual information into a mathematical form.",
          math: "Equation setup based on extracted data",
        },
        {
          stepNumber: 3,
          title: "Solve step by step",
          explanation:
            "Applying the appropriate method, we work through the calculation carefully, checking each step for accuracy.",
          math: "Step-by-step calculation",
        },
        {
          stepNumber: 4,
          title: "Verify the answer",
          explanation:
            "We can verify our solution by substituting it back into the original equation or by using an alternative method to confirm the result.",
          math: "Verification: result confirmed",
        },
      ]
    );
  }
}

// ---------------------------------------------------------------------------
// Export singleton instance
// ---------------------------------------------------------------------------

export const aiService: AIService = new MockAIService();
