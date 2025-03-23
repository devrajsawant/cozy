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
    <div className="px-24 mx-auto p-4 min-h-[80vh] bg-[#F2F1ED]">
      <h2 className="text-4xl my-10 ms-10 font-thin">Your Cart</h2>

      {cartItems.length > 0 ? (
        <div className="space-y-6 flex justify-around">
          <div className="w-[50vw]">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                {/* Product Info */}
                <div className="flex gap-5 w-[25vw]">
                  <button
                    className="text-gray-800 text-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <IoClose />
                  </button>
                  <Link
                    href={`/product/${item.id}`}
                    passHref
                    className="flex gap-5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-18 h-18 object-cover"
                    />
                    <div className="w-[14vw]">
                      <h3 className="text-lg font-serif font-thin truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 font-mono">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Shipping Cost */}
                <div className="w-[6vw] text-center mx-5 text-xs">
                  {item.price > 1000
                    ? ""
                    : `Shipping Cost:  ₹ ${(item.price * 0.12).toFixed(2)}`}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center h-fit gap-2 border w-[10vw] justify-center mx-2 ">
                  <button
                    className="px-2"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </button>
                  <span className="px-4">{item.selectedQuantity}</span>
                  <button
                    className={`px-2 ${
                      item.selectedQuantity >= item.quantity
                        ? "text-gray-400"
                        : ""
                    }`}
                    onClick={() => increaseQuantity(item.id)}
                    disabled={item.selectedQuantity >= item.quantity}
                  >
                    +
                  </button>
                </div>

                {/* Item Total Price */}
                <div className="w-[10vw] text-right">
                  ₹ {item.price * item.selectedQuantity}
                  <span className="text-xs">.00/-</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="w-[30vw] border-s ps-5">
            <div className="text-3xl font-thin border-b border-[#4A4946] pb-4">
              Cart Total
            </div>
            <div className="pt-2 flex justify-between text-md text-[#4A4946]">
              <span>Shipping Charges:</span>
              <span>₹ {totalShipping.toFixed(2)}</span>
            </div>

            <div className="pt-2 flex justify-between text-md text-[#4A4946]">
              <span>Subtotal</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>

            {/* Coupon Section */}
            <div className="pt-5 pb-2 mt-5 border-t">
              <div className="text-sm text-[#32312f] pb-2">
                Have a coupon code? Enter your code:
              </div>
              <div className="flex w-full">
                <input
                  type="text"
                  className="border w-full p-2 text-sm text-thin"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  className="px-10 bg-[#55534d] text-white py-1 text-lg"
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

            <div className="py-4 mt-1 flex justify-between font-thin border-t text-xl">
              <span>Total:</span>
              <span>₹ {Math.ceil(discountedTotal + totalShipping)}.00</span>
            </div>

            <button
              className="w-full bg-[#55534d] text-white py-2 text-lg"
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
                window.location.href = "/checkout"; // Redirect
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
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
}
