import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { Category, Difficulty, Question } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "The content of the GRE question. For Quantitative, include clear mathematical text description.",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 4 or 5 possible answer choices.",
    },
    correctIndex: {
      type: Type.INTEGER,
      description: "The zero-based index of the correct answer in the options array.",
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed explanation of why the correct answer is right and why others are wrong.",
    },
    topic: {
      type: Type.STRING,
      description: "The specific sub-topic (e.g., Algebra, Geometry, Text Completion, Reading Comprehension).",
    }
  },
  required: ["text", "options", "correctIndex", "explanation", "topic"],
};

export const generateQuestion = async (
  category: Category,
  difficulty: Difficulty
): Promise<Question> => {
  const ai = getClient();
  
  let promptText = "";
  
  if (category === Category.VERBAL) {
    promptText = `Generate a ${difficulty} level GRE Verbal Reasoning question. 
    It can be Sentence Equivalence, Text Completion, or Reading Comprehension. 
    Ensure the vocabulary is appropriate for GRE level.`;
  } else {
    promptText = `Generate a ${difficulty} level GRE Quantitative Reasoning question.
    It can be Arithmetic, Algebra, Geometry, or Data Analysis.
    Ensure the math is strictly text-based or uses standard unicode symbols for clarity.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        systemInstruction: "You are an expert GRE tutor. Generate high-quality, accurate practice questions similar to official ETS material.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated from Gemini.");
    }

    const jsonResponse = JSON.parse(text);
    
    return {
      id: Date.now().toString(),
      text: jsonResponse.text,
      options: jsonResponse.options,
      correctIndex: jsonResponse.correctIndex,
      explanation: jsonResponse.explanation,
      category,
      difficulty,
      topic: jsonResponse.topic || "General"
    };

  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
};

export const createTutorChat = (question: Question): Chat => {
  const ai = getClient();
  
  const systemInstruction = `You are a wise and helpful GRE Tutor in a classic university library.
  The student is working on the following ${question.difficulty} ${question.category} question (Topic: ${question.topic}):
  
  Question: "${question.text}"
  
  Options:
  ${question.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n')}
  
  The correct answer is index ${question.correctIndex} (Option ${String.fromCharCode(65 + question.correctIndex)}).
  The explanation is: ${question.explanation}.

  YOUR GOAL:
  Help the student solve this problem using a Socratic, step-by-step method.

  STRICT RULES:
  1. When the student asks for help or explanation, you MUST break the solution down into AT LEAST THREE (3) distinct steps.
  2. Present ONLY ONE step at a time. 
  3. End your response by asking the student if they understand this step and are ready for the next one.
  4. DO NOT proceed to the next step until the student explicitly agrees or asks to move on.
  5. DO NOT give the final answer immediately.
  6. Keep your tone scholarly, patient, and encouraging (e.g., "Excellent question, scholar.", "Let us examine the first premise.").
  `;

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
    },
  });
};