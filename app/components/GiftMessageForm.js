// GiftMessageForm — collected when user proceeds to checkout with gift intent
// Gathers recipient details, delivery info, and optional gift message
export default function GiftMessageForm({ cart, onSubmit, onCancel, darkMode, t }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className="w-full max-w-md mx-4 rounded-2xl p-6 space-y-4"
        style={{ background: t.surface, border: `0.5px solid ${t.border}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base" style={{ color: t.text }}>
            Checkout Details
          </h2>
          <button onClick={onCancel} style={{ color: t.textMuted }}>✕</button>
        </div>

        {/* Order summary */}
        <div className="rounded-xl p-3 space-y-1" style={{ background: t.cartItemBg, border: `0.5px solid ${t.border}` }}>
          <p className="text-xs font-medium" style={{ color: t.textMuted }}>Order summary</p>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-xs" style={{ color: t.text }}>
              <span className="truncate mr-2">{item.name} × {item.quantity}</span>
              <span className="flex-shrink-0" style={{ color: '#da532c' }}>LKR {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="space-y-3"
        >
          {/* Recipient name */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: t.textMuted }}>
              Recipient name
            </label>
            <input
              name="recipientName"
              required
              placeholder="e.g. Nimal Perera"
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{ background: t.inputBg, border: `0.5px solid ${t.border}`, color: t.text }}
            />
          </div>

          {/* Recipient phone */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: t.textMuted }}>
              Recipient phone
            </label>
            <input
              name="recipientPhone"
              required
              placeholder="e.g. 0771234567"
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{ background: t.inputBg, border: `0.5px solid ${t.border}`, color: t.text }}
            />
          </div>

          {/* Delivery city */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: t.textMuted }}>
              Delivery city
            </label>
            <input
              name="deliveryCity"
              required
              placeholder="e.g. Colombo"
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{ background: t.inputBg, border: `0.5px solid ${t.border}`, color: t.text }}
            />
          </div>

          {/* Delivery date */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: t.textMuted }}>
              Delivery date
            </label>
            <input
              name="deliveryDate"
              type="date"
              required
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{ background: t.inputBg, border: `0.5px solid ${t.border}`, color: t.text }}
            />
          </div>

          {/* Gift message — optional */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: t.textMuted }}>
              Gift message <span style={{ color: t.textFaint }}>(optional)</span>
            </label>
            <textarea
              name="giftMessage"
              rows={3}
              placeholder="e.g. Happy birthday! Wishing you all the best 🎉"
              className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
              style={{ background: t.inputBg, border: `0.5px solid ${t.border}`, color: t.text }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm transition-colors"
              style={{ background: t.cartItemBg, border: `0.5px solid ${t.border}`, color: t.textMuted }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ background: '#da532c' }}
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}