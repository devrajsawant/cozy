"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import products from "../../../JsonData/products.json";

export default function CategoryProducts() {
  const { category } = useParams(); // Get category from URL
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting state

  // Filter products by category (case-insensitive)
  const filteredProducts = products
    .filter((product) => product.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  return (
    <div className=" mx-auto p-5 bg-[#F2F1ED]">
      {/* Sorting Dropdown */}
      
      <div className="flex justify-between items-center mb-5 flex-col gap-4 md:gap-0 md:flex-row md:px-30 px-0 w-[75%] mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 capitalize">{category} Collection</h2>
        <select
          className="border px-1.5 py-1 bg-white text-gray-700"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc" className="text-sm font-mono">Price: Low to High</option>
          <option value="desc" className="text-sm font-mono">Price: High to Low</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-fit mx-auto">
        
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="h-[320px] w-[200px] bg-[#E5E2DB] p-3 hover:bg-[#d7d6d2] transition-all ease-in-out duration-300 ">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[70%] w-full object-cover pb-2 border-b border-[#4a4946]"
                />
             
              <p className="text-center text-xs font-mono mt-2">{product.name}</p>
              <p className="text-center ">₹ {product.price}.00/-</p>
              <div className="w-full flex item-center ">
              <button className="mt-2 border border-[#4a4946] mx-auto px-2  hover:bg-[#3a3936] hover:text-white transition">
                View Product
              </button>
              
              </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-4 text-gray-500">No products found for "{category}"</p>
        )}
      </div>
    </div>
  );
}
