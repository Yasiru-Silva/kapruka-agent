import ProductCard from './ProductCard';

// ProductCarousel component — displays a horizontally scrollable row of product cards
// Rendered inside the chat when Kapu returns product results
export default function ProductCarousel({ products, onAddToCart }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-2 mb-1">
      
      {/* Horizontally scrollable product row */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Product count label */}
      <p className="text-gray-500 text-xs mt-1">
        {products.length} product{products.length !== 1 ? 's' : ''} found
      </p>

    </div>
  );
}