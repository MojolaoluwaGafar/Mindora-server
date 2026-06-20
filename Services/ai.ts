import axios from "axios";
import { pickModel } from "./fetchModels";

export async function sendToAI(message: string): Promise<string> {
  try {
    // console.log("Groq model:", process.env.GROQ_MODEL);
    // console.log("Groq key present:", !!process.env.GROQ_API_KEY);

    const model = pickModel(process.env.GROQ_MODEL || "llama-3.3-70b-versatile");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (groqError: any) {
    console.error("Groq error, falling back to Claude:", groqError.response?.data || groqError.message);

    try {
      const response = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          model: "claude-3-opus-20240229",
          max_tokens: 300,
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            "x-api-key": process.env.CLAUDE_API_KEY!,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.content[0].text;
    } catch (claudeError: any) {
      console.error("Claude error:", claudeError.response?.data || claudeError.message);
      throw new Error("AI integration failed (Groq and Claude both unavailable)");
    }
  }
}
