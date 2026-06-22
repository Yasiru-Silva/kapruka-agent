// ProductCard component — displays a single Kapruka product
// Shows a category icon (no real image available from search results),
// name, price and a link to view on Kapruka
export default function ProductCard({ product, onAddToCart, darkMode, t }) {

  // Pick an icon and color based on keywords in the product name
  // Falls back to a generic gift box icon if nothing matches
  function getProductVisual(name) {
    const n = name.toLowerCase();
    if (n.includes('cake')) return { icon: '🎂', bg: '#fde8e0' };
    if (n.includes('flower') || n.includes('rose') || n.includes('bouquet')) return { icon: '💐', bg: '#fce4f2' };
    if (n.includes('chocolate')) return { icon: '🍫', bg: '#f0e4d8' };
    if (n.includes('phone') || n.includes('mobile') || n.includes('laptop')) return { icon: '📱', bg: '#e0e8fc' };
    if (n.includes('jewel') || n.includes('ring') || n.includes('necklace')) return { icon: '💍', bg: '#fcf0d8' };
    if (n.includes('perfume') || n.includes('fragrance')) return { icon: '🌸', bg: '#f4e0fc' };
    if (n.includes('toy') || n.includes('kids')) return { icon: '🧸', bg: '#e0fcf0' };
    if (n.includes('book')) return { icon: '📚', bg: '#e8e0fc' };
    if (n.includes('food') || n.includes('hamper') || n.includes('snack')) return { icon: '🧺', bg: '#fcf4e0' };
    return { icon: '🎁', bg: '#f0ecff' };
  }

  const visual = getProductVisual(product.name);
  const iconBg = darkMode
    ? `color-mix(in srgb, ${visual.bg} 35%, ${t.surface})`
    : visual.bg;

  return (
    <div
      className="rounded-2xl overflow-hidden w-48 flex-shrink-0 transition-colors hover:border-[#da532c]"
      style={{ background: t.surface, border: `0.5px solid ${t.border}` }}
    >

      {/* Product visual — category icon on a soft tinted background */}
      <div
        className="w-full h-40 flex items-center justify-center text-5xl"
        style={{ background: iconBg }}
      >
        {visual.icon}
      </div>

      {/* Product Details */}
      <div className="p-3 space-y-2">

        {/* Product Name */}
        <p className="text-xs font-medium leading-tight line-clamp-2" style={{ color: t.text }}>
          {product.name}
        </p>

        {/* Price */}
        <p className="text-sm font-bold" style={{ color: '#da532c' }}>
          LKR {product.price?.toLocaleString()}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1">

          {/* Add to Cart button */}
          <button
            onClick={() => onAddToCart(product)}
            className="w-full text-white text-xs py-1.5 rounded-lg transition-colors font-medium hover:opacity-90"
            style={{ background: '#da532c' }}
          >
            Add to Cart
          </button>

          {/* View on Kapruka link */}
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-xs py-1.5 rounded-lg transition-colors block hover:opacity-80"
            style={{ color: t.textMuted, border: `0.5px solid ${t.border}` }}
          >
            View Details
          </a>

        </div>
      </div>
    </div>
  );
}
