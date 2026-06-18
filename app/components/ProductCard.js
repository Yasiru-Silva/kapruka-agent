// ProductCard component — displays a single Kapruka product
// Shows product image, name, price and a link to view on Kapruka
export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden w-48 flex-shrink-0 border border-gray-700 hover:border-orange-500 transition-colors">

      {/* Product Image */}
      <div className="w-full h-40 bg-gray-700 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback if no image available
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            No image
          </div>
        )}
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