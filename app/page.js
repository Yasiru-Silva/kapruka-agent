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
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex flex-col h-screen" style={{ background: '#f5f3ff' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b" style={{ borderColor: '#e4dff5' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-lg" style={{ background: '#da532c' }}>
          K
        </div>
        <div>
          <h1 className="font-semibold text-gray-900">Kapu</h1>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Online
          </p>
        </div>
        <span className="ml-auto text-xs text-gray-300 mr-3">Powered by Kapruka</span>

        {/* Cart button */}
        <button
          onClick={() => setCartOpen(prev => !prev)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
          style={{ background: '#f0ecff', border: '0.5px solid #e4dff5', color: '#555' }}
        >
          🛒 Cart
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium" style={{ background: '#da532c' }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? { background: '#da532c', color: '#fff', borderRadius: '16px 16px 4px 16px' }
                      : { background: '#fff', color: '#1a1a1a', borderRadius: '16px 16px 16px 4px', border: '0.5px solid #e4dff5' }
                  }
                >
                  {msg.content}
                </div>
              </div>

              {/* Suggestion chips — only after the first message */}
              {i === 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {suggestions.map(s => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage(s.message)}
                      className="px-3 py-1.5 rounded-full text-xs transition-colors"
                      style={{ background: '#fff', border: '0.5px solid #e4dff5', color: '#666' }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Product carousel */}
              {msg.role === 'assistant' && msg.products?.length > 0 && (
                <div className="mt-2 px-1">
                  <ProductCarousel products={msg.products} onAddToCart={addToCart} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl text-sm" style={{ background: '#fff', color: '#999', border: '0.5px solid #e4dff5', borderRadius: '16px 16px 16px 4px' }}>
                Kapu is typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Cart sidebar */}
        {cartOpen && (
          <div className="w-80 bg-white flex flex-col" style={{ borderLeft: '0.5px solid #e4dff5' }}>
            <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '0.5px solid #e4dff5' }}>
              <h2 className="font-semibold text-gray-900">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-8">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: '#f5f3ff', border: '0.5px solid #e4dff5' }}>
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs" style={{ color: '#da532c' }}>LKR {item.price?.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="px-4 py-4 space-y-3" style={{ borderTop: '0.5px solid #e4dff5' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total</span>
                  <span className="font-semibold text-gray-900">LKR {cartTotal.toLocaleString()}</span>
                </div>
                <button
                  className="w-full text-white py-3 rounded-xl font-medium transition-colors text-sm"
                  style={{ background: '#da532c' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-4 bg-white" style={{ borderTop: '0.5px solid #e4dff5' }}>
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            className="flex-1 rounded-2xl px-4 py-3 text-sm resize-none outline-none transition-colors"
            style={{ background: '#f5f3ff', border: '0.5px solid #e4dff5', color: '#1a1a1a' }}
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