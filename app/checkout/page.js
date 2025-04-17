"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const CheckoutPage = () => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("checkoutdata"));
    if (data) {
      setCheckoutData(data);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const orderDetails = {
      shippingDetails: formData, // User's shipping info
      orderDetails: checkoutData, // Ordered products & pricing
      orderDate: new Date().toLocaleString(), // Store order date
    };
  
    // Retrieve existing order history
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
  
    // Add new order to the order history
    orderHistory.push(orderDetails);
  
    // Save updated order history back to localStorage
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
  
    console.log("Shipping Details:", formData);
    console.log("Order Details:", checkoutData);
    toast.success("Order Placed Successfully!");
  
    // Redirect to homepage
    window.location.href = "/";
  };
  
  return (
    <div className="flex flex-col items-center justify-start pt-20 min-h-screen bg-[#F8F8F8] p-4">
      <h2 className="text-4xl font-light font-serif mb-6">Checkout</h2>
      <div className="flex gap-10 w-[60vw] flex-col md:flex-row">
        {/* Left Side - Shipping Form */}
        <div className="md:w-1/2 w-full text-sm">
          <h3 className="text-2xl font-light pb-5">Shipping Address</h3>
          <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            <div className="flex gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="border-b w-full p-1 bg-transparent outline-none"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="border-b w-full p-1 bg-transparent outline-none"
              />
            </div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border-b w-full p-1 bg-transparent outline-none"
            />
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              className="border-b w-full p-1 bg-transparent outline-none"
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2 (Optional)"
              value={formData.addressLine2}
              onChange={handleChange}
              className="border-b w-full p-1 bg-transparent outline-none"
            />
            <div className="flex gap-3">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="border-b w-full p-1 bg-transparent outline-none"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="border-b w-full p-1 bg-transparent outline-none"
              />
            </div>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
              className="border-b w-full p-1 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="w-full bg-[#333] text-white py-2 mt-3 text-sm"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div className="md:w-1/2 w-full text-sm">
          <h3 className="text-2xl font-thin pb-5">Order Summary</h3>
          {checkoutData ? (
            <>
              {/* Products List */}
              <Link href={"/cart"}>
                <div className="mt-3 space-y-2">
                  {checkoutData.cartItems?.map((product, index) => (
                    <div key={index} className="flex items-center gap-3 pb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover"
                      />
                     <div className="flex flex-col md:flex-row md:justify-between w-full">
                     <div className="flex-1">
                        <h4 className="truncate">{product.name}</h4>
                        <p className="text-gray-600">
                          ₹{product.price} x{" "}
                          {product.selectedQuantity || 1}
                        </p>
                      </div>
                      <div className="">
                        ₹
                        {(
                          product.price * (product.selectedQuantity || 1)
                        )}
                      </div>
                     </div>
                    </div>
                  ))}
                </div>
              </Link>

              {/* Pricing Summary */}
              <div className="mt-3 border-t pt-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{checkoutData.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{checkoutData.totalShipping}</span>
                </div>
                <div className="flex justify-between text-lg border-t border-dashed font-semibold mt-2">
                  <span>Total:</span>
                  <span>₹{checkoutData.discountedTotal}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 mt-2">
              No order details found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
