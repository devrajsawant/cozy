"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import { IoSearch, IoBagOutline, IoClose } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

import { CiInstagram, CiFacebook } from "react-icons/ci";
import { AiOutlinePinterest } from "react-icons/ai";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import SearchPanel from "./search";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineHeart,
  AiOutlineUser,
} from "react-icons/ai";

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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const updateCartCount = () => {
    const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
    setCartCount(cartData.length);
  };

  useEffect(() => {
    updateCartCount();
    const handleCartUpdate = (e) => setCartCount(e.detail);
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlistData");
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, [showWishlistPanel]);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlistData", JSON.stringify(updatedWishlist));
  };

  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cartData")) || [];

    // Check if item already exists in the cart
    const exists = cart.some((cartItem) => cartItem.id === item.id);

    if (exists) {
      toast.error("Product already in the cart");
      return;
    }

    cart.push(item);
    toast.success("Added to cart");
    localStorage.setItem("cartData", JSON.stringify(cart));
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: cart.length })
    );

    // Remove from wishlist after adding to cart
    removeFromWishlist(item.id);
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      showLoginPanel || showWishlistPanel || showSearchPanel
        ? "hidden"
        : "auto";
  }, [showLoginPanel, showWishlistPanel, showSearchPanel]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

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
    } catch (error) {
      toast.error("Registration failed: " + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      toast.success("Login successful!");

      // Store Firebase UID as the user token
      localStorage.setItem("userToken", "LoggedIn");

      setIsLoggedIn(true);
      setShowLoginPanel(false);

      setFormData({ ...formData, email: "", password: "" });
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) return setResetMessage("Please enter your email.");

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Reset link sent! Check your email.");
    } catch (error) {
      setResetMessage("Error: " + error.message);
    }
  };

  return (
    <html lang="en" className="">
      <body cz-shortcut-listen="false">
        <Toaster />
        <header>
          <nav>
            <div className="bg-[#5A6354] text-white text-xs font-bold py-1 text-center">
              Get 10% off on your next order. Use code 'Shrads3010'
            </div>
            <div className="flex justify-around bg-[#D7D4D2] py-3 relative">
              <div className="flex md:w-[35%] items-center justify-between">
                <div className="text-2xl text-[#4A4946] font-bold flex gap-2 px-2 items-center">
                  <HiOutlineSparkles />
                  Cozy.
                </div>

                <Link href={"/"}>
                  {" "}
                  <div className="text-[#4A4946] font-semibold hidden md:block">
                    Home
                  </div>
                </Link>
                <Link href={"/shop"}>
                  {" "}
                  <div className="text-[#4A4946] font-semibold hidden md:block">
                    Shop
                  </div>
                </Link>
                <Link href={"/blog"}>
                  {" "}
                  <div className="text-[#4A4946] font-semibold hidden md:block">
                    Our Blog
                  </div>
                </Link>
                <Link href={"/appointment"}>
                  {" "}
                  <div className="text-[#4A4946] font-semibold hidden md:block">
                    Book an Appointment
                  </div>
                </Link>
              </div>
              <div className="flex md:w-[45%] w-[30%] justify-end items-center ">
                <div
                  className="text-[#4A4946] text-sm font-semibold border-e-2 border-[#43423f] px-2 cursor-pointer hidden md:block"
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLoginPanel(true);
                      setIsRegister(false);
                    } else {
                      router.push("/account");
                    }
                  }}
                >
                  {isLoggedIn ? "My Account" : "Login"}
                </div>

                <div
                  className="text-[#4A4946] text-lg font-bold px-2 hidden md:block"
                  onClick={() => setShowSearchPanel(true)}
                >
                  <IoSearch />
                </div>
                <div
                  className="text-[#4A4946] text-lg font-bold px-2 hidden md:block"
                  onClick={() => setShowWishlistPanel(true)}
                >
                  <FaRegHeart />
                </div>
                <div className="relative text-[#4A4946] text-lg font-bold px-2 hidden md:block">
                  <Link href={"/cart"}>
                    <IoBagOutline />
                    {cartCount > 0 && (
                      <span className="absolute top-2 right-1 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-thin">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                <div
                  className="md:hidden px-2"
                  onClick={() => setShowMobileMenu(true)}
                >
                  <HiOutlineMenuAlt3 className="text-2xl text-[#4A4946]" />
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

        {showMobileMenu && (
          <div
            id="search-overlay"
            className="fixed inset-0 bg-black/30 bg-opacity-50 transition-opacity duration-300"
            onClick={() => setShowMobileMenu(false)}
          ></div>
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
            {isForgotPassword
              ? "Reset Password"
              : isRegister
              ? "Create Account"
              : "Welcome Back"}
          </h2>

          {isForgotPassword ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Enter your email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full p-1 border focus:bg-[#f3f8ef] outline-none text-gray-800"
                />
              </div>
              <button
                className="w-full bg-[#5A6354] text-white p-1 text-lg font-medium hover:bg-[#4A4946] transition"
                onClick={handleResetPassword}
              >
                Send Reset Link
              </button>
              {resetMessage && (
                <p className="text-sm text-gray-600 mt-2">{resetMessage}</p>
              )}
              <div className="text-center text-gray-700 mt-4">
                <a
                  onClick={() => setIsForgotPassword(false)}
                  className="text-[#5A6354] font-medium hover:underline cursor-pointer"
                >
                  Back to Login
                </a>
              </div>
            </>
          ) : (
            <>
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
                      onClick={() => setIsForgotPassword(true)}
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
          className={`fixed right-0 top-0 md:w-120 w-80 bg-white h-screen shadow-lg p-8 z-50 border-l border-gray-300 transition-transform duration-500 ${
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
                    <div className="flex gap-2 mt-1 w-full flex-col md:flex-row">
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

        <div
          className={`fixed right-0 top-0 w-60 bg-white h-screen shadow-lg p-8 z-50 border-l border-gray-300 transition-transform duration-500 ${
            showMobileMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-6 text-2xl text-gray-500 hover:text-gray-700 transition"
            onClick={() => setShowMobileMenu(false)}
          >
            <IoClose />
          </button>
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={() => setShowMobileMenu(false)}>
              Home
            </Link>
            <Link href="/shop" onClick={() => setShowMobileMenu(false)}>
              Shop
            </Link>
            <Link href="/blog" onClick={() => setShowMobileMenu(false)}>
              Our Blog
            </Link>
            <Link href="/appointment" onClick={() => setShowMobileMenu(false)}>
              Book an Appointment
            </Link>
            <div
              onClick={() => {
                setShowMobileMenu(false);
                if (!isLoggedIn) {
                  setShowLoginPanel(true);
                  setIsRegister(false);
                } else {
                  router.push("/account");
                }
              }}
            >
              {isLoggedIn ? "My Account" : "Login"}
            </div>
          </nav>
        </div>

        {/* FOOTER */}
        <footer>
          <div className="flex w-full md:p-10 p-4 bg-[#d7d4d2]  flex-col md:flex-row justify-around items-center ">
            <div className="md:w-full flex flex-col justify-center items-start md:ps-24 ps-0  w-fit mb-2  md:mb-0">
              <div className="">
                <div className="flex gap-2 mb-1">
                  <HiOutlineSparkles className="text-3xl" />
                  <div className="text-3xl font-serif text-[#4A4946]">Cozy</div>
                </div>
                <div className="mb-3 text-sm font-mono">
                  All rights Reserved
                </div>
                <div className="text-xl flex gap-5 justify-center">
                  <CiInstagram />
                  <AiOutlinePinterest />
                  <CiFacebook />
                </div>
              </div>
            </div>
            <div className="md:w-full w-fit flex justify-center items-center  flex-col md:gap-10  md:flex-row">
              <div className="">
                <p className="text-sm text-center md:text-start font-mono md:mb-1.5 mb-[1px]">
                  About us
                </p>
                <p className="text-sm text-center md:text-start font-mono md:mb-1.5 mb-[1px]">
                  Our Blogs
                </p>
                <p className="text-sm text-center md:text-start underline font-mono">
                  Book an Appointment
                </p>
              </div>
              <div>
                <p className="text-sm font-mono md:mb-1.5 mb-[1px] text-center md:text-start">
                  Connect with us
                </p>
                <p className="text-sm font-mono md:mb-1.5 mb-[1px] flex md:gap-1.5 gap-0 items-center ">
                  Subscribe to Our Cozy Newsletter <HiOutlineSparkles />
                </p>
                <p className="text-sm font-mono text-center md:text-start">
                  Return & Exchange
                </p>
              </div>
            </div>
          </div>
          <div className="h-fit flex items-center md:justify-end justify-center gap-2 text-xs py-1 font-mono md:pe-44 pe-0 text-black bg-[#ada7a3] mb-12.5 md:mb-0">
            Made With <FaRegHeart /> By Devraj Sawant
          </div>
        </footer>

{/* bottom nav bar  */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center py-2 z-50 md:hidden">
          <Link
            href="/"
            className="flex flex-col items-center text-[#4A4946] text-xs"
          >
            <AiOutlineHome className="text-xl" />
            <span>Home</span>
          </Link>
          <Link
            href="/shop"
            className="flex flex-col items-center text-[#4A4946] text-xs"
          >
            <AiOutlineShopping className="text-xl" />
            <span>Shop</span>
          </Link>
          <Link
            href="/cart"
            className="flex flex-col items-center text-[#4A4946] text-xs relative"
          >
            <IoBagOutline className="text-xl" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 left-4 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-thin">
                {cartCount}
              </span>
            )}
          </Link>
          <div
            onClick={() => setShowWishlistPanel(true)}
            className="flex flex-col items-center text-[#4A4946] text-xs cursor-pointer"
          >
            <AiOutlineHeart className="text-xl" />
            <span>Wishlist</span>
          </div>
          <div
            className="flex flex-col items-center text-[#4A4946] text-xs cursor-pointer"
            onClick={() => {
              if (!isLoggedIn) {
                setShowLoginPanel(true);
                setIsRegister(false);
              } else {
                router.push("/account");
              }
            }}
          >
            <AiOutlineUser className="text-xl" />
            <span>{isLoggedIn ? "Account" : "Login"}</span>
          </div>
        </div>
      </body>
    </html>
  );
}
