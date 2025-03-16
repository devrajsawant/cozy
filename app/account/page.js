"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Account() {
  const router = useRouter();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const [showModal, setShowModal] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("cartData");
    localStorage.removeItem("userToken");
    localStorage.removeItem("wishlistData");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push("/");
    }, 1500); 
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("Please Login to Access Account Page");
      router.push("/");
    } else {
      // Load user data
      const storedUser = localStorage.getItem("registeredUser");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes to localStorage
  const handleSave = () => {
    localStorage.setItem("registeredUser", JSON.stringify(userData));
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F1ED] p-4">
    <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-10">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-4 w-full lg:w-1/3">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
          <img
            src={
              userData.image ||
              "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-2 border-gray-400"
          />
          <label className="absolute bottom-1 right-1 bg-gray-500 text-white text-xs p-1 rounded-full cursor-pointer">
            ✏️
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <button className="bg-gray-300 text-black px-4 py-1 w-full max-w-[200px]">
          Remove Avatar
        </button>
        <button
          className="bg-red-500 text-white px-4 py-1 w-full max-w-[200px]"
          onClick={() => setShowModal(true)}
        >
          Log Out
        </button>
      </div>
  
      {/* Form Section */}
      <div className="flex flex-col px-6 lg:px-10 border-t lg:border-t-0 lg:border-l border-gray-400 w-full lg:w-2/3">
        <h2 className="text-3xl sm:text-4xl my-6 font-thin text-center lg:text-left">
          My Account
        </h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-thin">First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              className="border px-3 py-1 w-full text-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 font-thin">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              className="border px-3 py-1 w-full text-gray-700"
            />
          </div>
        </div>
  
        <div className="mt-4">
          <label className="block mb-1 font-thin">Phone</label>
          <input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            className="border px-3 py-1 w-full text-gray-700"
          />
        </div>
  
        <div className="mt-4">
          <label className="block mb-1 font-thin">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="border px-3 py-1 w-full text-gray-700"
          />
        </div>
  
        <div className="mt-4">
          <label className="block mb-1 font-thin">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="border px-3 py-1 w-full text-gray-700"
          />
        </div>
  
        <button
          className="bg-[#55534d] text-white px-4 py-2 mt-6 w-full text-lg"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  
    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-sm">
          <h3 className="text-sm font-semibold">
            Are you sure you want to log out?
            <br /> Logging out will clear all your Cart and Wishlist Data.
          </h3>
          <div className="flex justify-center gap-5 mt-4">
            <button
              className="bg-gray-300 px-4 py-1"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1"
              onClick={handleLogout}
            >
              Yes, Log Out
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  
  );
}
