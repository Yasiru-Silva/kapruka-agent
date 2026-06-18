'use client';

import { useState, useRef, useEffect } from 'react';
import ProductCarousel from './components/ProductCarousel';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm Kapu 👋 Your personal Kapruka shopping assistant. I can help you find products, suggest gifts, and guide you all the way to checkout. What are you looking for today?",
      products: [],
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const bottomRef = useRef(null);

  // Theme colors — single source of truth for light/dark
  const t = {
    bg: darkMode ? '#1a1625' : '#f5f3ff',
    surface: darkMode ? '#211d2e' : '#fff',
    border: darkMode ? '#2d2640' : '#e4dff5',
    borderStrong: darkMode ? '#3d3555' : '#e4dff5',
    text: darkMode ? '#e0e0e0' : '#1a1a1a',
    textMuted: darkMode ? '#aaa' : '#666',
    textFaint: darkMode ? '#666' : '#bbb',
    chipBg: darkMode ? '#2d2640' : '#fff',
    inputBg: darkMode ? '#2d2640' : '#f5f3ff',
    cartItemBg: darkMode ? '#2d2640' : '#f5f3ff',
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add product to cart — increment quantity if already exists
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

  // Remove product from cart entirely
  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => item.id !== productId));
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Quick suggestion chips shown below the welcome message
  const suggestions = [
    { label: '🎁 Find a gift', message: 'I need to find a gift' },
    { label: '🎂 Browse cakes', message: 'Show me some cakes' },
    { label: '💐 Send flowers', message: 'I want to send flowers' },
    { label: '📦 Track my order', message: 'I want to track my order' },
  ];

  async function sendMessage(text) {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    const userMessage = { role: 'user', content: messageText, products: [] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Only send role and content to API — not UI-only fields
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
    <div className="flex flex-col h-screen transition-colors duration-200" style={{ background: t.bg }}>

      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4 transition-colors"
        style={{ background: t.surface, borderBottom: `0.5px solid ${t.border}` }}
      >
        {/* Kapu avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-lg flex-shrink-0" style={{ background: '#da532c' }}>
          K
        </div>

        {/* Name and status */}
        <div>
          <h1 className="font-semibold" style={{ color: t.text }}>Kapu</h1>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Online
          </p>
        </div>

        <span className="ml-auto text-xs mr-3" style={{ color: t.textFaint }}>Powered by Kapruka</span>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="w-9 h-9 rounded-full flex items-center justify-center mr-2 transition-colors text-sm"
          style={{ background: t.chipBg, border: `0.5px solid ${t.border}` }}
          title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Cart button */}
        <button
          onClick={() => setCartOpen(prev => !prev)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
          style={{ background: t.chipBg, border: `0.5px solid ${t.border}`, color: t.textMuted }}
        >
          🛒 Cart
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium" style={{ background: '#da532c' }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Main area — chat + optional cart sidebar */}
      <div className="flex flex-1 overflow-hidden">

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[75%] px-4 py-3 text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? { background: '#da532c', color: '#fff', borderRadius: '16px 16px 4px 16px' }
                      : { background: t.surface, color: t.text, borderRadius: '16px 16px 16px 4px', border: `0.5px solid ${t.borderStrong}` }
                  }
                >
                  {msg.content}
                </div>
              </div>

              {/* Suggestion chips — only shown below the first welcome message */}
              {i === 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {suggestions.map(s => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage(s.message)}
                      className="px-3 py-1.5 rounded-full text-xs transition-colors"
                      style={{ background: t.chipBg, border: `0.5px solid ${t.border}`, color: t.textMuted }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Product carousel — shown below assistant messages with products */}
              {msg.role === 'assistant' && msg.products?.length > 0 && (
                <div className="mt-2 px-1">
                  <ProductCarousel products={msg.products} onAddToCart={addToCart} />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 text-sm"
                style={{ background: t.surface, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: '16px 16px 16px 4px' }}
              >
                Kapu is typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Cart sidebar */}
        {cartOpen && (
          <div
            className="w-80 flex flex-col transition-colors"
            style={{ background: t.surface, borderLeft: `0.5px solid ${t.border}` }}
          >
            <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: `0.5px solid ${t.border}` }}>
              <h2 className="font-semibold" style={{ color: t.text }}>Your Cart</h2>
              <button onClick={() => setCartOpen(false)} style={{ color: t.textMuted }}>✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-sm text-center mt-8" style={{ color: t.textMuted }}>Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl p-3"
                    style={{ background: t.cartItemBg, border: `0.5px solid ${t.border}` }}
                  >
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: t.text }}>{item.name}</p>
                      <p className="text-xs" style={{ color: '#da532c' }}>LKR {item.price?.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-xs hover:text-red-400" style={{ color: t.textMuted }}>✕</button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="px-4 py-4 space-y-3" style={{ borderTop: `0.5px solid ${t.border}` }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: t.textMuted }}>Total</span>
                  <span className="font-semibold" style={{ color: t.text }}>LKR {cartTotal.toLocaleString()}</span>
                </div>
                <button
                  className="w-full text-white py-3 rounded-xl font-medium text-sm"
                  style={{ background: '#da532c' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        className="px-4 py-4 transition-colors"
        style={{ background: t.surface, borderTop: `0.5px solid ${t.border}` }}
      >
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            className="flex-1 rounded-2xl px-4 py-3 text-sm resize-none outline-none transition-colors"
            style={{ background: t.inputBg, border: `0.5px solid ${t.border}`, color: t.text }}
            rows={1}
            placeholder="Ask Kapu anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="text-white px-5 py-3 rounded-2xl text-sm font-medium transition-colors disabled:opacity-50"
            style={{ background: '#da532c' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}