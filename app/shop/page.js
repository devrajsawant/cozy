"use client";
import { useState } from "react";
import Link from "next/link";
import products from "../../JsonData/products.json";
import toast, { Toaster } from 'react-hot-toast';

export default function ProductListing() {
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(5000); // Default max price

  const addToCart = (product) => {
    let cartData = JSON.parse(localStorage.getItem("cartData")) || [];
  
    // Check if the item is already in the cart
    const exists = cartData.find((item) => item.id === product.id);
    if (!exists) {
      cartData.push(product);
    }
  
    localStorage.setItem("cartData", JSON.stringify(cartData));
    toast.success("Product added to cart!");
  
    // Dispatch custom event with updated cart length
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cartData.length }));
  };

  // Get unique categories
  const categories = ["All", ...new Set(products.map((product) => product.category))];

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => (selectedCategory === "All" ? true : product.category === selectedCategory))
    .filter((product) => product.price <= priceRange)
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  return (
    <div className="px-32 p-5 flex gap-5 bg-[#F2F1ED]">
                  <div><Toaster/></div>

      {/* Sidebar Filters */}
      <div className="w-[250px] bg-[#E5E2DB] p-4 rounded-lg shadow-md h-fit">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>

        {/* Category Filter */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Category</label>
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={cat}
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
                className="appearance-none w-4 h-4 border border-gray-500 checked:bg-black cursor-pointer"
              />
              <span>{cat}</span>
            </div>
          ))}
        </div>

        {/* Price Range Filter */}
        <div className="mb-4">
  <label className="block font-medium mb-2">Max Price: ₹{priceRange}</label>
  <input
    type="range"
    min="0"
    max="5000"
    step="100"
    value={priceRange}
    onChange={(e) => setPriceRange(Number(e.target.value))}
    className="w-full cursor-pointer appearance-none h-2 bg-gray-300 rounded-lg 
               [&::-webkit-slider-thumb]:appearance-none 
               [&::-webkit-slider-thumb]:h-4 
               [&::-webkit-slider-thumb]:w-4 
               [&::-webkit-slider-thumb]:bg-black 
               [&::-webkit-slider-thumb]:rounded-full 
               [&::-webkit-slider-thumb]:hover:scale-125 
               [&::-moz-range-thumb]:bg-red-300"
  />
</div>

      </div>

      {/* Products Section */}
      <div className="flex-1">
        {/* Header - Title & Sorting */}
        <div className="flex justify-between items-center mb-5 ms-2 w-[91%] mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 capitalize">All Products</h2>
        <select
          className="border px-1.5 py-1 bg-white text-gray-700"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc" className="text-sm font-mono">Price: Low to High</option>
          <option value="desc" className="text-sm font-mono">Price: High to Low</option>
        </select>
      </div>

        {/* Product Grid - 3 Per Row with Less Gap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-fit">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
                <div key={product.id} className="h-[320px] w-[200px] bg-[#E5E2DB] p-3 hover:bg-[#d7d6d2] transition-all ease-in-out duration-300 mx-2">
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[70%] w-full object-cover pb-2 border-b border-[#4a4946]"
                  />
                </Link>
                <p className="text-center text-xs font-mono mt-2">{product.name}</p>
                <p className="text-center ">₹ {product.price}.00/-</p>
                <div className="w-full flex item-center ">
                <button className="mt-2 border border-[#4a4946] mx-auto px-2  hover:bg-[#3a3936] hover:text-white transition" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
