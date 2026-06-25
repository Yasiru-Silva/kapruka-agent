

# Kapu — AI Shopping Assistant for Kapruka.com

**Live Demo:** https://kapruka-agent-nu-weld.vercel.app

Kapu is a full-stack AI shopping assistant built on top of Kapruka.com's MCP (Model Context Protocol) server. It lets users discover products, build a cart, and complete real orders through a natural conversation — no forms, no menus, just chat.

Built for the [Kapruka Agent Challenge 2026](https://kapruka.com).

---

## Features

- **Natural language shopping** — search by vibe, occasion, budget, or product name
- **Emotional intelligence** — reads context and responds like a person, not a script
- **Real product search** — live catalog via Kapruka MCP
- **Multi-item cart** — add products via cards or conversation
- **Conversational checkout** — Kapu collects delivery details naturally, no forms
- **Gift messaging** — gift note included in the order
- **Order placement** — creates real Kapruka orders with working payment links
- **Order tracking** — track existing orders by order number
- **Session persistence** — conversation and cart survive page reloads
- **Dark / light mode** — full theme toggle
- **Category-based product icons** — visual product cards with smart icons by category (real product images available via `kapruka_get_product` but disabled by default to optimize API usage)
---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| AI Model | Claude Sonnet (Anthropic API) |
| Shopping Tools | Kapruka MCP Server |
| Deployment | Vercel |

---

## Architecture


Browser (Next.js frontend)

↓ user message + cart state

/api/chat (Next.js API route)

↓ full conversation history + cart context

Claude Sonnet (claude-sonnet-4-6)

↓ tool calls as needed

Kapruka MCP Server (mcp.kapruka.com/mcp)

↓ real products, delivery, orders

Claude assembles final response

↓ text reply + structured product JSON

Frontend renders chat + product cards


---

## Running Locally

**Prerequisites:** Node.js 18+, Anthropic API key

bash
# Clone the repo
git clone https://github.com/Yasiru-Silva/kapruka-agent.git
cd kapruka-agent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Start the dev server
npm run dev


Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from console.anthropic.com |

The Kapruka MCP server is public and requires no API key.

---

## Project Structure


kapruka-agent/

├── app/

│   ├── api/chat/route.js      # Backend — Claude + Kapruka MCP integration

│   ├── components/

│   │   ├── ProductCard.js     # Individual product card

│   │   └── ProductCarousel.js # Horizontally scrollable product row

│   ├── page.js                # Main chat UI

│   └── layout.js              # App wrapper + metadata

├── public/

│   └── kapruka-favicon.ico    # Kapruka brand icon

└── .env.local                 # API keys (not committed)


---

## How It Works

1. User sends a message via the chat interface
2. The frontend sends the full conversation history + current cart contents to `/api/chat`
3. The backend passes everything to Claude with access to Kapruka's MCP tools
4. Claude decides which tools to call (search, delivery check, create order, etc.)
5. Claude assembles a response with embedded product JSON
6. The frontend parses the product JSON and renders cards alongside the chat bubble
7. Users can add products to cart directly from cards or through conversation

---
## Notes

**Product Images:** The app uses category-based placeholder icons instead of real product images by default. Real images are available through Kapruka's `kapruka_get_product` tool but are disabled to minimize API calls and keep response times fast. Enabling them requires one line change in the system prompt.

---

## Acknowledgements

- [Kapruka.com](https://kapruka.com) for the MCP server and the challenge
- [Anthropic](https://anthropic.com) for Claude and the MCP client SDK

---

*Built by Yasiru Silva for the Kapruka Agent Challenge 2026*
