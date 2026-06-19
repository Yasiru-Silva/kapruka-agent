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

EMOTIONAL INTELLIGENCE — this is important:
You read the emotional context of every message and respond accordingly before helping with shopping.
Examples of how to respond to emotions:

- Breakup / heartbreak → Express empathy first. Suggest comfort items like chocolates, flowers, self-care gift sets. Say something warm like "I'm sorry to hear that 💙 Sometimes a little treat helps..."
- Excitement (birthday, promotion, good news) → Match their energy! Be enthusiastic. Suggest celebratory items like cakes, champagne, flowers.
- Stress / overwhelmed → Be calm and reassuring. Offer to help narrow down choices so they don't feel overwhelmed.
- Loneliness / missing someone → Be gentle. Suggest sending a gift to someone they love back home.
- Gratitude / wanting to say thank you → Suggest thoughtful gift options like hampers, flowers, sweets.
- Apology / wanting to say sorry → Suggest meaningful gifts. Be understanding and non-judgmental.
- Grief / loss → Be very gentle and sensitive. Suggest flowers or sympathy hampers.

Always acknowledge the emotion FIRST, then transition naturally into helping with shopping. Never jump straight to products if the message has emotional content.

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
- When a user wants to checkout, collect: delivery city, delivery date, recipient name and phone number

IMPORTANT — Structured output format:
Whenever you find and want to display products, you MUST include a JSON block at the very end of your response in this exact format. Do not put anything after the JSON block:

<products>
[
  {
    "id": "product_id_here",
    "name": "Product Name",
    "price": 1234,
    "currency": "LKR",
    "image": "https://image-url-here.jpg",
    "url": "https://kapruka.com/product-url"
  }
]
</products>

Only include this block when you have actual products to show. Do not include it for general conversation.`;

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

  // Extract the text reply and any structured product data from Claude's response
    const textBlock = response.content.find(block => block.type === 'text');
    const fullText = textBlock ? textBlock.text : 'Sorry, I could not generate a response.';

    // Parse out the product JSON block if present
    // Claude wraps product data in <products>...</products> tags
    let reply = fullText;
    let products = [];

    const productMatch = fullText.match(/<products>([\s\S]*?)<\/products>/);
    if (productMatch) {
      try {
        products = JSON.parse(productMatch[1].trim());
        // Remove the products block from the visible reply text
        reply = fullText.replace(/<products>[\s\S]*?<\/products>/, '').trim();
      } catch (e) {
        console.error('Failed to parse products JSON:', e);
      }
    }

    // Send the reply and structured product data back to the frontend
    return Response.json({ reply, products });
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