'use client';

import { useState, useRef, useEffect } from 'react';
import ProductCarousel from './components/ProductCarousel';

export default function Home() {
  // Chat message history
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm Kapu 👋 Your personal Kapruka shopping assistant. I can help you find products, suggest gifts, and guide you all the way to checkout. What are you looking for today?",
      products: [],
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Cart state — array of products the user has added
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add a product to the cart
  // If it already exists, increment quantity instead
  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  // Remove a product from the cart entirely
  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => item.id !== productId));
  }

  // Calculate total cart value in LKR
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input, products: [] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Only send role and content to the API — not UI-only fields like products
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply, products: data.products || [] }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again!', products: [] }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-lg">
          K
        </div>
        <div>
          <h1 className="font-semibold text-white">Kapu</h1>
          <p className="text-xs text-green-400">● Online</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-gray-400">Powered by Kapruka</span>

          {/* Cart button — shows item count badge */}
          <button
            onClick={() => setCartOpen(prev => !prev)}
            className="relative bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main area — chat + optional cart sidebar */}
      <div className="flex flex-1 overflow-hidden">

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>

              {/* Product carousel shown below assistant messages that have products */}
              {msg.role === 'assistant' && msg.products?.length > 0 && (
                <div className="mt-2 px-2">
                  <ProductCarousel products={msg.products} onAddToCart={addToCart} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-gray-400">
                Kapu is typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Cart sidebar — slides in when cart is open */}
        {cartOpen && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
            <div className="px-4 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-8">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                    {/* Item image */}
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">{item.name}</p>
                      <p className="text-xs text-orange-400">LKR {item.price?.toLocaleString()} × {item.quantity}</p>
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-400 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart total and checkout button */}
            {cart.length > 0 && (
              <div className="px-4 py-4 border-t border-gray-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total</span>
                  <span className="font-bold text-white">LKR {cartTotal.toLocaleString()}</span>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 py-4 bg-gray-900 border-t border-gray-800">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            className="flex-1 bg-gray-800 text-white rounded-2xl px-4 py-3 text-sm resize-none outline-none border border-gray-700 focus:border-orange-500 transition-colors"
            rows={1}
            placeholder="Ask Kapu anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-3 rounded-2xl text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}