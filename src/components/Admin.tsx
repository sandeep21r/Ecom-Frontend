import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  // Check role in localStorage (just temporary)
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/"); // redirect non-admin users 🛑
    }
  }, [role, navigate]);
const adminCards = [
  {
    title: "Users",
    description: "View and manage all registered users on the platform.",
    image: "/images/users.png", // 🔁 Replace with your actual image path
  },
  {
    title: "Products",
    description: "Add, edit, or remove products from your catalog.",
    image: "/images/products.png", // 🔁 Replace with your actual image path
  },
  {
    title: "Categories",
    description: "Organize products into meaningful categories.",
    image: "/images/categories.png", // 🔁 Replace with your actual image path
  },
  {
    title: "Orders",
    description: "Track customer orders and manage their status.",
    image: "/images/orders.png", // 🔁 Replace with your actual image path
  },
];
 return (
    <div className="min-h-screen bg-white pt-28 pb-16 px-4 md:px-12 lg:px-20">
      {/* Heading */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-3">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Manage your store&apos;s users, products, categories, and orders from one place.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {adminCards.map((card) => (
          <div
            key={card.title}
            className="group overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative h-50 md:h-64 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Text */}
            <div className="p-4 md:p-5">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;