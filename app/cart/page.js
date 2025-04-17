"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [totalShipping, setTotalShipping] = useState(0);
  // Load cart data from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartData");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart).map((item) => ({
        ...item,
        selectedQuantity: item.selectedQuantity || 1, // Ensure selectedQuantity is set
      }));
      setCartItems(parsedCart);
      calculateSubtotal(parsedCart);
    }
  }, []);

  // Update localStorage & subtotal when cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartData", JSON.stringify(cartItems));
      calculateSubtotal(cartItems);
    }
  }, [cartItems]);

  // Increase selected quantity (up to max available)
  const increaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.selectedQuantity < item.quantity
          ? { ...item, selectedQuantity: item.selectedQuantity + 1 }
          : item
      )
    );
  };

  // Decrease selected quantity (minimum 1)
  const decreaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.selectedQuantity > 1
          ? { ...item, selectedQuantity: item.selectedQuantity - 1 }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: updatedCart.length })
    );
  };

  // Calculate subtotal
  const calculateSubtotal = (cart) => {
    let total = 0;
    let shippingCost = 0;

    cart.forEach((item) => {
      total += item.price * item.selectedQuantity;
      if (item.price <= 1000) {
        shippingCost += item.price * 0.12;
      }
    });

    setSubtotal(total);
    setDiscountedTotal(total);
    setTotalShipping(shippingCost);
  };

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode === "Shrads3010") {
      const discount = (subtotal + totalShipping) * 0.1;
      setDiscountedTotal(subtotal - discount);
      setCouponMessage("Coupon applied! 10% discount added.");
    } else {
      setDiscountedTotal(subtotal);
      setCouponMessage("Invalid coupon code. Try again.");
    }
  };

  return (
    <div className="px-4 md:px-24 mx-auto p-4 min-h-[80vh] bg-[#F2F1ED]">
    <h2 className="text-2xl md:text-4xl my-6 md:my-10 ms-2 md:ms-10 font-thin">Your Cart</h2>
  
    {cartItems.length > 0 ? (
      <div className="space-y-6 flex flex-col md:flex-row justify-around">
        {/* Cart Items Section */}
        <div className="w-full md:w-[55%]">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-4 gap-4"
            >
              <div className="flex gap-4 w-full sm:w-[60%] items-center">
                <button
                  className="text-gray-800 text-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  <IoClose />
                </button>
                <Link
                  href={`/product/${item.id}`}
                  className="flex gap-3 w-full items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="w-full">
                    <h3 className="text-md font-serif font-thin truncate">{item.name}</h3>
                    <p className="text-gray-600 font-mono">₹{item.price.toFixed(2)}</p>
                  </div>
                </Link>
              </div>
  
              {/* Shipping & Quantity */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-[40%] justify-between">
                <div className="text-center text-xs text-gray-700">
                  {item.price > 1000
                    ? ""
                    : `Shipping: ₹ ${(item.price * 0.12).toFixed(2)}`}
                </div>
                <div className="flex items-center border px-3 py-1 text-sm">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span className="px-3">{item.selectedQuantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    disabled={item.selectedQuantity >= item.quantity}
                    className={`${
                      item.selectedQuantity >= item.quantity ? "text-gray-400" : ""
                    }`}
                  >
                    +
                  </button>
                </div>
                <div className="text-right font-medium">
                  ₹ {item.price * item.selectedQuantity}.00/-
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Summary Section */}
        <div className="w-full md:w-[35%] border-t md:border-t-0 md:border-s md:ps-5 pt-5 md:pt-0">
          <div className="text-2xl md:text-3xl font-thin border-b border-[#4A4946] pb-4 mb-2">
            Cart Total
          </div>
  
          <div className="flex justify-between text-sm md:text-md text-[#4A4946] py-1">
            <span>Shipping Charges:</span>
            <span>₹ {totalShipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm md:text-md text-[#4A4946] py-1">
            <span>Subtotal:</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>
  
          {/* Coupon Code */}
          <div className="pt-4 pb-2 mt-4 border-t">
            <div className="text-sm pb-2">Have a coupon code?</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="border p-2 text-sm flex-1"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
              />
              <button
                className="bg-[#55534d] text-white px-4 py-2 text-sm"
                onClick={applyCoupon}
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <div
                className={`text-sm mt-1 ${
                  couponMessage.includes("Invalid")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {couponMessage}
              </div>
            )}
          </div>
  
          <div className="py-4 mt-1 flex justify-between font-thin border-t text-lg md:text-xl">
            <span>Total:</span>
            <span>₹ {Math.ceil(discountedTotal + totalShipping)}.00</span>
          </div>
  
          <button
            className="w-full bg-[#55534d] text-white py-2 text-lg mt-2"
            onClick={() => {
              const checkoutData = {
                cartItems,
                subtotal,
                totalShipping,
                discountedTotal: Math.ceil(discountedTotal + totalShipping),
              };
              sessionStorage.setItem(
                "checkoutdata",
                JSON.stringify(checkoutData)
              );
              window.location.href = "/checkout";
            }}
          >
            Checkout
          </button>
          <button className="w-full text-sm mt-5 font-mono">
            Continue Shopping
          </button>
        </div>
      </div>
    ) : (
      <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
    )}
  </div>
  
  );
}
