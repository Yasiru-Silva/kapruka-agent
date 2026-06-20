// ProductCard component — displays a single Kapruka product
// Shows a category icon (no real image available from search results),
// name, price and a link to view on Kapruka
export default function ProductCard({ product, onAddToCart }) {

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

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden w-48 flex-shrink-0 border border-gray-700 hover:border-orange-500 transition-colors">

      {/* Product visual — category icon on a soft tinted background */}
      <div
        className="w-full h-40 flex items-center justify-center text-5xl"
        style={{ background: visual.bg }}
      >
        {visual.icon}
      </div>

      {/* Product Details */}
      <div className="p-3 space-y-2">

        {/* Product Name */}
        <p className="text-white text-xs font-medium leading-tight line-clamp-2">
          {product.name}
        </p>

        {/* Price */}
        <p className="text-orange-400 text-sm font-bold">
          LKR {product.price?.toLocaleString()}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1">

          {/* Add to Cart button */}
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs py-1.5 rounded-lg transition-colors font-medium"
          >
            Add to Cart
          </button>

          {/* View on Kapruka link */}
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-gray-400 hover:text-white text-xs py-1.5 rounded-lg border border-gray-600 hover:border-gray-400 transition-colors block"
          >
            View Details
          </a>

        </div>
      </div>
    </div>
  );
}