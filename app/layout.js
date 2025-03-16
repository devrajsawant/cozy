"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import { IoSearch, IoBagOutline, IoClose } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { CiInstagram, CiFacebook } from "react-icons/ci";
import { AiOutlinePinterest } from "react-icons/ai";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import SearchPanel from "./search";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showWishlistPanel, setShowWishlistPanel] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [cartCount, setCartCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);

  const updateCartCount = () => {
    const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
    setCartCount(cartData.length);
  };

  useEffect(() => {
    // Initialize cart count on mount
    updateCartCount();

    // Listen to the custom event
    const handleCartUpdate = (e) => setCartCount(e.detail);
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Cleanup listener
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlistData");
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, [showWishlistPanel]); // Refetch when wishlist panel opens

  // Function to remove item from wishlist
  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlistData", JSON.stringify(updatedWishlist));
  };

  // Function to move item to cart (example logic)
  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cartData")) || [];
    cart.push(item);
    toast.success("added to cart");
    localStorage.setItem("cartData", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cartData.length }));

    // Remove from wishlist after adding to cart
    removeFromWishlist(item.id);
  };

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, []);

  // Disable scrolling when panel is open
  useEffect(() => {
    document.body.style.overflow =
      showLoginPanel || showWishlistPanel || showSearchPanel
        ? "hidden"
        : "auto";
  }, [showLoginPanel, showWishlistPanel, showSearchPanel]);

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Registration: Save user data to localStorage
  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // For demo purposes, store registration data in localStorage
    localStorage.setItem("registeredUser", JSON.stringify(formData));
    toast.success("Registration successful! Please login.");
    setIsRegister(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  };

  // Login: Check credentials and set user token
  const handleLogin = () => {
    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (!registeredUser) {
      toast.error("No user registered. Please register first.");
      return;
    }
    if (
      formData.email === registeredUser.email &&
      formData.password === registeredUser.password
    ) {
      toast.success("login success");
      localStorage.setItem("userToken", "loggedIn");
      setIsLoggedIn(true);
      setShowLoginPanel(false);
      // Clear sensitive login fields
      setFormData({ ...formData, email: "", password: "" });
    } else {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <html lang="en">
      <body cz-shortcut-listen="false">
        <Toaster />
        <header>
          <nav>
            <div className="bg-[#5A6354] text-white text-xs font-bold py-1 text-center">
              Get 10% off on your next order. Use code 'Shrads3010'
            </div>
            <div className="flex justify-around bg-[#D7D4D2] py-3 relative">
              <div className="flex w-[45%] gap-5 items-center">
                <div className="text-2xl text-[#4A4946] font-bold flex gap-2 px-2 items-center">
                  <HiOutlineSparkles />
                  Cozy.
                </div>
                <Link href={"/"}>
                  {" "}
                  <div className="text-[#4A4946] font-semibold">Home</div>
                </Link>
                <Link href={"/shop"}>
                  {" "}
                  <div className="text-[#4A4946] font-semibold">Shop</div>
                </Link>
                <Link href={"/blog"}>
                  {" "}
                  <div className="text-[#4A4946] font-semibold">Our Blog</div>
                </Link>
                <Link href={"/appointment"}>
                  {" "}
                  <div className="text-[#4A4946] font-semibold">
                    Book an Appointment
                  </div>
                </Link>
              </div>
              <div className="flex w-[45%] justify-end items-center">
                <div
                  className="text-[#4A4946] text-sm font-semibold border-e-2 border-[#43423f] px-2 cursor-pointer"
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLoginPanel(true);
                      setIsRegister(false);
                    } else {
                      // Redirect to /account if logged in
                      router.push("/account");
                    }
                  }}
                >
                  {isLoggedIn ? "My Account" : "Login"}
                </div>
                <div className="text-[#4A4946] text-sm font-semibold border-e-2 border-[#43423f] px-2">
                  English
                </div>
                <div
                  className="text-[#4A4946] text-lg font-bold px-2"
                  onClick={() => setShowSearchPanel(true)}
                >
                  <IoSearch />
                </div>
                <div
                  className="text-[#4A4946] text-lg font-bold px-2"
                  onClick={() => setShowWishlistPanel(true)}
                >
                  <FaRegHeart />
                </div>
                <div className="relative text-[#4A4946] text-lg font-bold px-2">
                  <Link href={"/cart"}>
                    <IoBagOutline />
                    {cartCount > 0 && (
                      <span className="absolute top-2 right-1 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-thin">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {children}

        {/* LOGIN / REGISTER PANEL BACKDROP */}
        {showLoginPanel && (
          <div
            className="fixed inset-0 bg-black/30 z-40 opacity-100 transition-opacity duration-500"
            onClick={() => setShowLoginPanel(false)}
          />
        )}

        {/* LOGIN / REGISTER PANEL */}
        <div
          className={`fixed right-0 top-0 w-96 bg-white h-screen shadow-lg p-8 z-50 border-l border-gray-300 transition-transform duration-300 ${
            showLoginPanel ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 left-4 text-2xl text-gray-500 hover:text-gray-700 transition"
            onClick={() => setShowLoginPanel(false)}
          >
            <IoClose />
          </button>

          {/* Panel Heading */}
          <h2 className="text-3xl font-semibold text-[#4A4946] mb-6 text-center">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          {/* Form: Login or Register */}
          {!isRegister ? (
            <>
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-1 border focus:bg-[#f3f8ef] outline-none text-gray-800"
                />
              </div>

              {/* Password Input */}
              <div className="mb-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-1 border focus:bg-[#f3f8ef] outline-none text-gray-800"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="mb-5 text-right">
                <a
                  href="#"
                  className="text-sm text-[#5A6354] font-medium hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                className="w-full bg-[#5A6354] text-white p-1 text-lg font-medium hover:bg-[#4A4946] transition"
                onClick={handleLogin}
              >
                Login
              </button>
            </>
          ) : (
            <>
              {/* First Name & Last Name */}
              <div className="flex gap-3 mb-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-1 border focus:bg-[#f3f8ef] outline-none text-gray-800"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-1 border focus:bg-[#f3f8ef] outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-1 border focus:bg-[#f3f8ef] outline-none text-gray-800"
                />
              </div>

              {/* Phone Number Input */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-1 border focus:bg-[#f3f8ef] outline-none text-gray-800"
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-1 border focus:bg-[#f3f8ef] outline-none text-gray-800"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-1 border focus:bg-[#f3f8ef] outline-none text-gray-800"
                />
              </div>

              {/* Register Button */}
              <button
                className="w-full bg-[#5A6354] text-white p-1 text-lg font-medium hover:bg-[#4A4946] transition"
                onClick={handleRegister}
              >
                Register
              </button>
            </>
          )}

          {/* Toggle Login/Register Link */}
          <div className="text-center text-gray-700 mt-4">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <a
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#5A6354] font-medium hover:underline ml-1 cursor-pointer"
            >
              {isRegister ? "Login" : "Register"}
            </a>
          </div>
        </div>

        {showWishlistPanel && (
          <div
            id="wishlist-overlay"
            className="fixed inset-0 bg-black/30 bg-opacity-50 transition-opacity duration-300"
            onClick={() => setShowWishlistPanel(false)}
          ></div>
        )}

        {showSearchPanel && (
          <div
            id="search-overlay"
            className="fixed inset-0 bg-black/30 bg-opacity-50 transition-opacity duration-300"
            onClick={() => setShowSearchPanel(false)}
          ></div>
        )}

        {/* Wishlist Panel */}
        <div
          className={`fixed right-0 top-0 w-120 bg-white h-screen shadow-lg p-8 z-50 border-l border-gray-300 transition-transform duration-500 ${
            showWishlistPanel ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 left-4 text-2xl text-gray-500 hover:text-gray-700 transition"
            onClick={() => setShowWishlistPanel(false)}
          >
            <IoClose />
          </button>
          <h2 className="text-3xl font-semibold text-[#4A4946] mb-6 text-center font-serif border-b border-dashed my-3">
            Wishlist
          </h2>
          <div className="space-y-4">
            {wishlistItems.length > 0 ? (
              wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="border-b pb-5 p-2 px-4 flex gap-4 "
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover"
                  />
                  <div className="w-full">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">Rs. {item.price}</p>
                    <div className="flex gap-2 mt-1 w-full">
                      <button
                        className="border border-[#4a4946] w-full px-2"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="border border-[#4a4946] bg-[#7a7872] text-white px-2"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">
                Your wishlist is empty.
              </p>
            )}
          </div>
        </div>

        {/* Search Panel */}
        <div
          className={`fixed right-0 top-0 w-120 bg-white h-screen shadow-lg p-8 z-50 border-l border-gray-300 transition-transform duration-500 ${
            showSearchPanel ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* <SearchPanel
            products={products}
            onClose={() => setShowSearchPanel(false)}
          /> */}
        </div>

        {/* FOOTER */}
        <footer>
          <div className="flex w-full p-10 bg-[#d7d4d2]">
            <div className="w-full flex flex-col justify-center items-start ps-24">
              <div className="">
                <div className="flex gap-2 mb-1">
                  <HiOutlineSparkles className="text-3xl" />
                  <div className="text-3xl font-serif text-[#4A4946]">Cozy</div>
                </div>
                <div className="mb-3 text-sm font-mono">
                  All rights Reserved
                </div>
                <div className="text-xl flex gap-5">
                  <CiInstagram />
                  <AiOutlinePinterest />
                  <CiFacebook />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-around items-center">
              <div className="">
                <p className="text-sm font-mono mb-1.5">About us</p>
                <p className="text-sm font-mono mb-1.5">Our Blogs</p>
                <p className="text-sm underline font-mono">
                  Book an Appointment
                </p>
              </div>
              <div>
                <p className="text-sm font-mono mb-1.5">Connect with us</p>
                <p className="text-sm font-mono mb-1.5 flex gap-1.5 items-center">
                  Subscribe to Our Cozy Newsletter <HiOutlineSparkles />
                </p>
                <p className="text-sm font-mono">Return & Exchange</p>
              </div>
            </div>
          </div>
          <div className="h-fit flex items-center justify-end gap-2 text-xs py-1 font-mono pe-44 text-black bg-[#ada7a3]">
            Made With <FaRegHeart /> By Devraj Sawant
          </div>
        </footer>
      </body>
    </html>
  );
}
