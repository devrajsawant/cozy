"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPencilAlt } from "react-icons/fa";

export default function Account() {
  const router = useRouter();
  const [orderHistory, setOrderHistory] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState("account"); 

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
  const [invoiceData, setInvoiceData] = useState(null);


  const handleLogout = () => {
    localStorage.removeItem("cartData");
    localStorage.removeItem("userToken");
    localStorage.removeItem("wishlistData");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("Please Login to Access Account Page");
      router.push("/");
    } else {
      const storedUser = localStorage.getItem("registeredUser");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }

    const storedAppointment = JSON.parse(localStorage.getItem("appointment"));
    if (storedAppointment) {
      const currentTime = new Date();
      const appointmentTime = new Date(storedAppointment.date);
      appointmentTime.setHours(
        storedAppointment.time.hour,
        storedAppointment.time.minute
      );

      if (currentTime > appointmentTime) {
        localStorage.removeItem("appointment");
      } else {
        setAppointment(storedAppointment);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

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

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    setOrderHistory(storedOrders);
  }, []); 

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
              <FaPencilAlt />
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


          {appointment && (
            <Link href="/appointment">
              <div className="border pe-10 ps-2 p-1 mt-40 hover:bg-[#D7D4D2]/90 bg-[#D7D4D2]">
                <h3 className="text-md font-normal text-gray-800">
                  Your Appointment
                </h3>
                <div className="flex gap-5">
                  <p className="text-gray-600 font-mono">
                    <strong>Date:</strong>{" "}
                    {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 font-mono">
                    <strong>Time:</strong>{" "}
                    {`${appointment.time.hour}:${appointment.time.minute}`}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Form Section */}
        <div className="flex flex-col px-6 lg:px-10 border-t lg:border-t-0 lg:border-l border-gray-400 w-full lg:w-2/3">

          <div className="flex justify-around border-b mb-5">
            <button
              className={`text-3xl sm:text-4xl my-6 font-thin text-center lg:text-left" ${
                activeTab === "account" ? "" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("account")}
            >
              My Account
            </button>
            <button
              className={`text-3xl sm:text-4xl my-6 font-thin text-center lg:text-left ${
                activeTab === "orders" ? "" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Order History
            </button>
          </div>

          {activeTab === "orders" && (
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Order History
              </h3>
              <div className="space-y-4">
                {orderHistory.map((order, index) => (
                  <div key={index} className="border p-3 bg-[#e9e5e2]">
                    <p className="text-sm text-gray-600">
                      <strong>Order Date:</strong> {order.orderDate}
                    </p>
                    <div className="mt-2">
                      {order.orderDetails.cartItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 pb-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover"
                          />
                          <div className="flex flex-col md:flex-row md:justify-between w-full">
                          <div className="flex-1">
                            <h4 className="truncate">{item.name}</h4>
                            <p className="text-gray-600">
                              ₹{item.price} x{" "}
                              {item.selectedQuantity}
                            </p>
                          </div>
                          <div>
                            ₹{(item.price * item.selectedQuantity) }
                          </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 border-t pt-2 flex justify-between">
                      <div className="text-sm">
                        <p>Subtotal:</p> ₹
                        {order.orderDetails.subtotal }
                      </div>
                      <div className="text-sm">
                        <p>Shipping:</p> ₹
                        {order.orderDetails.totalShipping }
                      </div>
                      <div className="text-sm font-semibold">
                        <p>Total:</p> ₹
                        {order.orderDetails.discountedTotal}.00
                      </div>
                    </div>
                    <button
                      className="bg-[#55534D] text-white px-4 py-1 mt-3"
                      onClick={() => setInvoiceData(order)}
                    >
                      Generate Invoice
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoice Modal */}
          {invoiceData && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-90">
              <div className="bg-white p-6 shadow-lg w-[90%] max-w-md">
                <h3 className="text-lg font-semibold text-center mb-3">
                  Invoice
                </h3>
                <p>
                  <strong>Order Date:</strong> {invoiceData.orderDate}
                </p>
                <div className="border-b border-t my-1 py-1">
                  <div className="flex gap-2">
                  <div>{invoiceData.shippingDetails.firstName}</div>
                  <div>{invoiceData.shippingDetails.lastName}</div>
                  </div>
                  <div>{invoiceData.shippingDetails.addressLine1}</div>
                  <div className="flex gap-2">
                  <div>{invoiceData.shippingDetails.city},</div>
                  <div>{invoiceData.shippingDetails.state},</div>
                  <div>{invoiceData.shippingDetails.country}</div>
                  </div>
                  <div>{invoiceData.shippingDetails.phone}</div>
                </div>
                <div className="mt-2">
                  {invoiceData.orderDetails.cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {item.name} (x{item.selectedQuantity})
                      </span>
                      <span>
                        ₹{(item.price * item.selectedQuantity) }
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t pt-2 flex justify-between">
                  <div>
                    <div>Subtotal:</div> ₹
                    {invoiceData.orderDetails.subtotal }
                  </div>
                  <div>
                    <div>Shipping:</div> ₹
                    {invoiceData.orderDetails.totalShipping }
                  </div>
                  <div className="font-semibold">
                    <div>Total:</div> ₹
                    {invoiceData.orderDetails.discountedTotal}.00
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-gray-300 px-4 py-1"
                    onClick={() => setInvoiceData(null)}
                  >
                    Close
                  </button>
                  <button
                    className="border-1  text-black px-4 "
                    onClick={() => window.print()}
                  >
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div>
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
          )}
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
