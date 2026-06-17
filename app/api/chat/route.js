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
- Search for products by keyword or category using kapruka_search_products
- Get full product details using kapruka_get_product
- Browse categories using kapruka_list_categories
- Check delivery availability using kapruka_check_delivery
- Build a multi-item cart and create orders using kapruka_create_order
- Track existing orders using kapruka_track_order

Rules:
- Always be helpful and suggest alternatives if something isn't available
- For gift shoppers, always offer to add a gift message
- Keep responses concise and friendly
- When showing products, always include the price in LKR
- Always confirm delivery city before creating an order
- When a user wants to checkout, collect: delivery city, delivery date, recipient name and phone number`;

// POST /api/chat
// Receives the conversation history from the frontend
// Sends it to Claude with Kapruka MCP tools and returns Kapu's reply
export async function POST(request) {
  try {
    // Parse the incoming request body to get the message history
    const { messages } = await request.json();

    // Send the conversation to Claude with access to Kapruka MCP tools
    // mcp_servers tells Claude where the tools live
    // betas enables the MCP connector feature (currently in beta)
    const response = await client.beta.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      mcp_servers: [
        {
          // Kapruka's public MCP server — no auth required
          type: 'url',
          url: 'https://mcp.kapruka.com/mcp',
          name: 'kapruka',
        }
      ],
      tools: [
        {
          // Tell Claude to use all tools from the Kapruka MCP server
          type: 'mcp_toolset',
          mcp_server_name: 'kapruka',
        }
      ],
      messages: messages,
      betas: ['mcp-client-2025-11-20'],
    });

    // Extract the text reply from Claude's response
    // Claude may have made tool calls internally before giving the final reply
    const textBlock = response.content.find(block => block.type === 'text');
    const reply = textBlock ? textBlock.text : 'Sorry, I could not generate a response.';

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