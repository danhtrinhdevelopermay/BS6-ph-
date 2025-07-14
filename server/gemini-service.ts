import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

// Gemini AI service for analyzing posts and generating responses
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PostAnalysis {
  type: 'exercise' | 'discussion' | 'question' | 'general';
  response: string;
  confidence: number;
}

export class GeminiService {
  /**
   * Analyze a post and generate appropriate AI response
   */
  async analyzePost(content: string): Promise<PostAnalysis> {
    try {
      const systemPrompt = `Bạn là ABS Pro, một AI giáo dục thông minh của Bright Starts Academy. 
Hãy phân tích bài viết và đưa ra phản hồi phù hợp:

1. Nếu là bài tập/câu hỏi học thuật: Hướng dẫn giải chi tiết, giải thích từng bước
2. Nếu là thảo luận học tập: Đưa ra góc nhìn sâu sắc, thông tin bổ sung hữu ích
3. Nếu là câu hỏi thường: Trả lời một cách thông minh và hữu ích
4. Nếu là chia sẻ cá nhân: Động viên tích cực và đưa ra lời khuyên phù hợp

Phản hồi bằng tiếng Việt, thân thiện và chuyên nghiệp. Phản hồi phải có giá trị giáo dục cao.

Trả về JSON với format:
{
  "type": "exercise|discussion|question|general",
  "response": "phản hồi chi tiết của bạn",
  "confidence": số từ 0-1
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["exercise", "discussion", "question", "general"] },
              response: { type: "string" },
              confidence: { type: "number" }
            },
            required: ["type", "response", "confidence"]
          }
        },
        contents: content
      });

      const rawJson = response.text;
      console.log(`Gemini response: ${rawJson}`);

      if (rawJson) {
        const analysis: PostAnalysis = JSON.parse(rawJson);
        return analysis;
      } else {
        throw new Error("Empty response from Gemini");
      }
    } catch (error) {
      console.error(`Failed to analyze post with Gemini: ${error}`);
      // Fallback response
      return {
        type: 'general',
        response: 'Cảm ơn bạn đã chia sẻ! Đây là một chủ đề thú vị. Hãy tiếp tục học tập và khám phá nhé! 📚',
        confidence: 0.5
      };
    }
  }

  /**
   * Generate educational content suggestions based on post
   */
  async generateStudySuggestions(content: string): Promise<string[]> {
    try {
      const systemPrompt = `Dựa vào nội dung bài viết, hãy đề xuất 3-5 chủ đề học tập liên quan mà học sinh có thể quan tâm.
Trả về dạng mảng JSON các string ngắn gọn.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: { type: "string" }
          }
        },
        contents: content
      });

      const rawJson = response.text;
      if (rawJson) {
        return JSON.parse(rawJson);
      }
      return [];
    } catch (error) {
      console.error(`Failed to generate study suggestions: ${error}`);
      return [];
    }
  }
}

export const geminiService = new GeminiService();