import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Extract configuration from headers (Client sends these securely)
  const apiKey = req.headers.get('X-Leo-Api-Key') || '';
  const endpoint = req.headers.get('X-Leo-Endpoint') || '';
  const modelName = req.headers.get('X-Leo-Model') || 'gpt-4o';
  
  // Dynamic System Prompt
  const systemPrompt = `
  You are LEO, an advanced AI created by Isam Ahmed.
  
  Thinking Process: You must ALWAYS start your response with a <thinking> tag to plan your answer, followed by </thinking>.
  Tools: You have access to dynamic tools via MCP. Use them whenever you need external data.
  Tone: Professional, futuristic, slightly witty.
  
  Current Date: ${new Date().toISOString()}
  `;

  let model;

  // Factory Logic for Provider Agnosticism
  if (endpoint.includes('googleapis')) {
    const google = createGoogleGenerativeAI({ apiKey });
    model = google(modelName);
  } else {
    // Default to OpenAI-compatible (works for OpenRouter, OpenAI, etc.)
    const openai = createOpenAI({ 
      apiKey, 
      baseURL: endpoint || undefined // If empty, defaults to OpenAI standard
    });
    model = openai(modelName);
  }

  // TODO: Inject MCP Tools here by fetching from McpManager (would need server-side hydration)

  const result = await streamText({
    model,
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
