"use client";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");


  // Load cart data from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartData");
    if (storedCart) {
       const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
      calculateSubtotal(parsedCart);
    }
  }, []);

  // Update localStorage whenever cartItems change
  //   useEffect(() => {
  //     localStorage.setItem("cartData", JSON.stringify(cartItems));
  //   }, [cartItems]);

  // Increase item quantity
  const increaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease item quantity
  const decreaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    let cartData = JSON.parse(localStorage.getItem("cartData")) || [];
    const updatedCart = cartData.filter((item) => item.id !== id);
  
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateSubtotal(updatedCart);
  
    // Dispatch event with updated cart length
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updatedCart.length }));
  };
  
  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const calculateSubtotal = (cart) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    setSubtotal(total);
    setDiscountedTotal(total); // Default total before applying discount
  };


  const applyCoupon = () => {
    if (couponCode === "Shrads3010") {
      const discount = subtotal * 0.1;
      setDiscountedTotal(subtotal - discount);
      setCouponMessage("Coupon applied! 10% discount added.");
    } else {
      setDiscountedTotal(subtotal);
      setCouponMessage("Invalid coupon code. Try again.");
    }
  };

  return (
    <div className="px-24 mx-auto p-4 min-h-[80vh] bg-[#F2F1ED]">
        
      <h2 className="text-4xl my-10 ms-10 font-thin ">Your Cart</h2>

      {cartItems.length > 0 ? (
        <div className="space-y-6 flex justify-around">
          <div className="w-[50vw]">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between  border-b py-4"
              >
                <div className="flex gap-5">
                  <button
                    className="text-gray-800 text-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <IoClose />
                  </button>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-18 object-cover"
                  />
                  <div className="w-[20vw]">
                    <h3 className="text-lg font-serif font-thin">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 font-mono">
                    ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-center h-fit gap-2 mt-2 border">
                  <button
                    className="px-2 "
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </button>
                  <span className="px-4">5</span>
                  <button
                    className="px-2 "
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div> */}
                <div>
                  ₹ {item.price * 5}
                  <span className="text-xs">.00/-</span>
                </div>
              </div>
            ))}
          </div>

          {/* summary part is here  */}
          <div className="w-[30vw] border-s ps-5">
            <div className="text-3xl font-thin border-b border-[#4A4946] pb-4">Cart Total</div>
            <div className="pt-2 flex justify-between text-md text-[#4A4946] ">
              <span>Shipping Charges:</span>
              <span>Free</span>
            </div>
            <div className="pt-2 flex justify-between text-md text-[#4A4946]">
              <span>Tax</span>
              <span>₹ 00</span>
            </div>
            <div className="pt-2 flex justify-between text-md text-[#4A4946]">
              <span>Subtotal</span>
              <span>₹ {subtotal.toFixed(2)}</span>

            </div>
            <div className=" pt-5 pb-2 mt-5 border-t">
                <div className="text-sm text-[#32312f] pb-2 ">Have coupon code ? Enter your code :</div>
                <div className="flex w-full">
                <input type="text" className="border w-full p-2 text-sm text-thin"  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}></input>
                 <button className="px-10 bg-[#55534d] text-white py-1 text-lg"  onClick={applyCoupon}>
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
              <span>₹ {discountedTotal.toFixed(2)}</span>
            </div>

            
            <button className="w-full bg-[#55534d] text-white py-2 text-lg">
              Checkout
            </button>

            <button className="w-full text-sm mt-5 font-mono"> Continue Shopping</button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
}
