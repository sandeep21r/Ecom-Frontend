import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FooterBottom from "./components/FooterBottom";
import HomePage from "./components/HomePage";
import { Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import ScrollToTop from "./components/ScrollToTop";
import Admin from "./components/Admin";
import AdminUsers from "./components/AdminUsers";


function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ScrollToTop />
      <div
        id="recaptcha-container"
        style={{
          opacity: 0,
          height: 0,
          overflow: "hidden",
          position: "absolute"
        }}
      ></div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} /> {/* ⭐ NEW ROUTE */}
        <Route path="/admin/users" element={<AdminUsers />} />

      </Routes>
      <Footer />
      <FooterBottom />

    </div>
  );
}

export default App;
