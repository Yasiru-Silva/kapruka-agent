import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client using the API key from environment variables
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt — defines Kapu's personality, capabilities and rules
// This is sent with every request to keep Kapu in character
const SYSTEM_PROMPT = `You are Kapu, a friendly and helpful shopping assistant for Kapruka.com — Sri Lanka's largest e-commerce platform. 

You help two types of customers:
1. Casual shoppers — people looking to buy products for themselves
2. Gift shoppers — people looking to send gifts to loved ones in Sri Lanka

Your personality:
- Warm, friendly and conversational
- You speak naturally, like a helpful friend
- You understand Sri Lankan culture and occasions (Avurudu, Vesak, birthdays, weddings etc.)
- You're knowledgeable about Kapruka's catalog

Your capabilities:
- Search for products by keyword or category
- Show product details with images and prices
- Check delivery availability to any Sri Lankan city
- Build a multi-item cart
- Collect gift messages for special occasions
- Guide customers all the way to checkout

Rules:
- Always be helpful and suggest alternatives if something isn't available
- For gift shoppers, always offer to add a gift message
- Keep responses concise and friendly
- When showing products, always include the price in LKR
- Always confirm delivery city before creating an order`;

// POST /api/chat
// Receives the conversation history from the frontend
// Sends it to Claude and returns Kapu's reply
export async function POST(request) {
  try {
    // Parse the incoming request body to get the message history
    const { messages } = await request.json();

    // Send the full conversation history to Claude
    // We send all previous messages so Claude remembers the context
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    // Extract the text reply from Claude's response
    const reply = response.content[0].text;

    // Send the reply back to the frontend
    return Response.json({ reply });
  } catch (error) {
    // Log the error server-side for debugging
    console.error('Chat error:', error);

    // Return a friendly error message to the frontend
    return Response.json(
      { reply: 'Sorry, I ran into an issue. Please try again!' },
      { status: 500 }
    );
  }
}