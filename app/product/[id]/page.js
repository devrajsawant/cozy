"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import products from "../../../JsonData/products.json";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

// Accordion Component
function Accordion({ title, id, openAccordions, setOpenAccordions, product }) {
  const toggleAccordion = (accordionId) => {
    setOpenAccordions((prev) => {
      if (prev.includes(accordionId)) {
        return prev.filter((id) => id !== accordionId);
      }
      return [...prev, accordionId].slice(-2); // Keep max 2 open
    });
  };

  const isOpen = openAccordions.includes(id);

  return (
    <div className="border-b border-[#4A4946] py-2">
      <button
        className="w-full text-left py-3 text-xl font-mono text-[#4A4946] flex justify-between items-center"
        onClick={() => toggleAccordion(id)}
      >
        {title}
        <span
          className={`text-lg transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          {isOpen ? "-" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-3 text-[#4A4946] text-lg">
          {title === "Description" &&
            "This is a high-quality product made with premium materials. It is designed for comfort and durability."}
          {title === "Shipping" &&
            (product.price > 1000
              ? "Free Shipping"
              : `Shipping Cost: ₹ ${(product.price * 0.12).toFixed(2)}`)}
          {title === "Return Policy" &&
            (product.price < 1000
              ? "No Return available for this product"
              : `Return Policy: 7 days return policy with deduction of ₹ ${(
                  product.price * 0.03
                ).toFixed(2)}`)}
        </div>
      </div>
    </div>
  );
}

// Main Product Component
export default function Products() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [openAccordions, setOpenAccordions] = useState(["desc"]); // Default open accordion
  // Swiper navigation refs
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();

    // Calculate the cursor's relative position inside the image
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;

    // Ensure the zoomed image does not go outside its boundaries
    x = Math.max(0, Math.min(x, 0));
    y = Math.max(0, Math.min(y, 1000));

    setZoomPosition({ x, y });
  };

  useEffect(() => {
    if (!id) return;
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
    if (foundProduct) {
      const related = products.filter(
        (p) => p.category === foundProduct.category && p.id !== parseInt(id)
      );
      setRelatedProducts(related);
    }
  }, [id]);

  const addToCart = (product) => {
    let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

    const exists = cartData.find((item) => item.id === product.id);
    if (exists) {
      toast.error("Product already in cart!");
    }
    if (!exists) {
      cartData.push(product);

      localStorage.setItem("cartData", JSON.stringify(cartData));
      toast.success("Product added to cart!");

      // Dispatch custom event with updated cart length
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: cartData.length })
      );
    }
  };

  const addToWishlist = (product) => {
    let wishlistData = JSON.parse(localStorage.getItem("wishlistData")) || [];

    // Check if the product already exists in the wishlist
    const exists = wishlistData.find((item) => item.id === product.id);
    if (!exists) {
      wishlistData.push(product);
    }

    localStorage.setItem("wishlistData", JSON.stringify(wishlistData));
    toast.success("Product added to wishlist!");
  };

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="bg-[#F2F1ED] min-h-screen py-10">
      <div>
        <Toaster />
      </div>
      {/* Product Details */}
      <div className="flex w-[80vw] mx-auto gap-16 justify-center py-5 pb-10 border-b border-[#4A4946]">
        <div className="h-[500px] object-contain">
          <div
            className="relative h-[400px] w-[300px] shadow-lg"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.image}
              className="h-[400px] w-[300px] object-cover shadow-lg"
              alt={product.name}
            />
            {showZoom && (
              <div className="absolute top-0 left-full ml-5 w-[250px] h-[250px] border overflow-hidden shadow-lg bg-white">
                <img
                  src={product.image}
                  className="absolute w-[600px] h-[600px] object-cover"
                  style={{
                    top: `-${zoomPosition.y}%`,
                    left: `-${zoomPosition.x}%`,
                  }}
                  alt="Zoomed Product"
                />
              </div>
            )}
          </div>

          {/* <div className="flex mt-5 gap-3">
            {[...Array(3)].map((_, i) => (
              <img
                key={i}
                src={product.image}
                className="h-[80px] w-[60px] object-cover shadow-lg"
                alt="Product Image"
              />
            ))}
          </div> */}
        </div>
        <div className="w-[35vw]">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between px-6 py-4 border-b border-[#4A4946]">
              <div className="text-4xl font-serif text-[#4A4946] w-[70%]">
                {product.name}
              </div>
              <div className="text-2xl font-mono text-[#4A4946]">
                ₹ {product.price}
              </div>
            </div>
            <div className="flex justify-between gap-4 px-6">
              <button
                className="w-fit px-3 py-1 border border-[#4A4946] text-[#4A4946] cursor-pointer"
                onClick={() => addToWishlist(product)}
              >
                <FaHeart />
              </button>
              <button
                className="w-full py-1 border border-[#4A4946] text-[#4A4946] cursor-pointer"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <button
                className="w-full bg-[#4A4946] border border-[#4A4946] text-white py-1 cursor-pointer"
                onClick={() => {
                  const checkoutData = {
                    cartItems: [
                      {
                        ...product,
                        selectedQuantity: 1, // Default quantity for direct purchase
                      },
                    ],
                    subtotal: product.price.toFixed(2),
                    totalShipping:
                      product.price > 1000
                        ? 0
                        : (product.price * 0.12).toFixed(2),
                    discountedTotal: Math.ceil(
                      product.price + (product.price > 1000 ? 0 : product.price * 0.12)
                    ).toFixed(2),
                  };

                  sessionStorage.setItem(
                    "checkoutdata",
                    JSON.stringify(checkoutData)
                  );
                  window.location.href = "/checkout"; // Redirect to checkout page
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
          <div className="mt-6 px-6">
            <Accordion
              title="Description"
              id="desc"
              openAccordions={openAccordions}
              setOpenAccordions={setOpenAccordions}
            />
            <Accordion
              title="Shipping"
              id="ship"
              openAccordions={openAccordions}
              setOpenAccordions={setOpenAccordions}
              product={product}
            ></Accordion>

            <Accordion
              title="Return Policy"
              id="rev"
              openAccordions={openAccordions}
              setOpenAccordions={setOpenAccordions}
              product={product}
            />
          </div>
        </div>
      </div>

      {/* Related Products Swiper */}
      <div className="w-[80vw] mx-auto p-10 relative">
        <div className="text-center font-serif text-3xl text-[#4A4946]">
          You May Also Like
        </div>

        {/* Navigation Buttons */}
        <button
          ref={prevRef}
          className="absolute top-1/2 left-[-30px] text-3xl cursor-pointer text-[#4A4946]"
        >
          &lt;
        </button>
        <button
          ref={nextRef}
          className="absolute top-1/2 right-[-30px] text-3xl cursor-pointer text-[#4A4946]"
        >
          &gt;
        </button>

        {/* Swiper Component (Pagination Removed) */}
        <Swiper
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={20}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          className="mt-10"
        >
          {relatedProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <Link href={`/product/${item.id}`}>
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={item.image}
                    className="h-[400px] w-[300px] object-cover"
                    alt={item.name}
                  />
                  <div className="font-serif text-lg text-[#4A4946] mt-3">
                    {item.name}
                  </div>
                  <div className="text-md font-mono text-[#5d5b58]">
                    ₹{item.price}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
