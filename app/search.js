// components/SearchPanel.js
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const SearchPanel = ({ products, onClose }) => {
  const [query, setQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed right-0 top-0 w-96 bg-white h-screen shadow-lg p-8 z-50 border-l border-gray-300 transition-transform">
      <button className="absolute top-4 left-4 text-2xl text-gray-500 hover:text-gray-700" onClick={onClose}>
        <IoClose />
      </button>
      <h2 className="text-3xl font-semibold text-[#4A4946] mb-6 text-center">Search</h2>
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full p-2 border rounded-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="mt-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li key={product.id} className="p-3 border-b flex gap-3 items-center">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover" />
              <div>
                <p className="text-lg font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">Rs. {product.price}</p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-600 text-center mt-3">No products found</p>
        )}
      </ul>
    </div>
  );
};

export default SearchPanel;
