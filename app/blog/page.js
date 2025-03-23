import React from "react";

const blogs = [
  {
    title: "Top 10 Skincare Products for Glowing Skin",
    image: "https://i.pinimg.com/736x/af/6d/56/af6d563a1dfcdce0bbb612463f8b2ad0.jpg",
    description: "Discover the best skincare products to achieve glowing skin.",
    size: "col-span-2", // Big card
  },
  {
    title: "Haircare Tips for Healthy and Shiny Hair",
    image: "https://i.pinimg.com/736x/a9/3f/91/a93f915b17bdd977a3fb7f480bdbc0af.jpg",
    description: "Learn the secrets to maintaining healthy and shiny hair.",
    size: "col-span-1", // Small card
  },
  {
    title: "Best Perfumes for Every Occasion",
    image: "https://i.pinimg.com/736x/8f/bc/14/8fbc143f4f17cb8e504c257e16cfacda.jpg",
    description: "Find the perfect perfume for any occasion.",
    size: "col-span-1",
  },
  {
    title: "Top Candles to Create a Cozy Atmosphere",
    image: "https://i.pinimg.com/736x/42/62/39/4262394cb46d113feb0f65f3a2207693.jpg",
    description: "Explore the best candles to create a cozy and inviting atmosphere.",
    size: "col-span-2",
  },
  {
    title: "Essential Oils: Benefits and Uses",
    image: "https://i.pinimg.com/736x/ce/19/91/ce19919e4902c055b868b90301129018.jpg",
    description: "Learn how essential oils can improve your well-being.",
    size: "col-span-1",
  },
  {
    title: "DIY Skincare Routines at Home",
    image: "https://i.pinimg.com/736x/f5/4d/43/f54d43ea6791f51c8a5e2998a13c2b5c.jpg",
    description: "Try these simple DIY skincare routines with natural ingredients.",
    size: "col-span-1",
  },
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-[#F2F1ED] px-6 py-12">
      <h1 className="text-4xl font-semibold text-gray-800 text-center mb-12">
        Our Blog
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className={`${blog.size} flex flex-col transition-transform duration-300 hover:scale-[1.01] cursor-pointer`}
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
              <p className="text-gray-600 mt-2 flex-grow">{blog.description}</p>
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
