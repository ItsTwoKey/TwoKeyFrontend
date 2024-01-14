import React from "react";
import { Link, useLocation } from "react-router-dom";

const HomeNav = () => {
  const location = useLocation();

  const isOnContactUs = location.pathname === "/contact-us";

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      id="nav"
      className="bg-[#FAF8F7] h-24 flex justify-between items-center px-4 md:px-12 font-tahoma"
    >
      <a
        href="/"
        alt="Twokey"
        className="text-lg font-[400] font-allertaStencil"
      >
        Twokey
      </a>

      {isOnContactUs ? (
        <span className="flex gap-8 py-2">
          <Link to="/" className="hidden md:block hover:underline">
            About Us
          </Link>

          <Link to="/" className="hidden md:block hover:underline">
            Product
          </Link>

          <Link to="/" className="hidden md:block hover:underline">
            Pricing
          </Link>
        </span>
      ) : (
        <span className="flex gap-8 py-2">
          <button
            onClick={() => scrollToSection("about")}
            className="hidden md:block hover:underline"
          >
            About Us
          </button>

          <button
            onClick={() => scrollToSection("product")}
            className="hidden md:block hover:underline"
          >
            Product
          </button>

          <button
            onClick={() => scrollToSection("pricing")}
            className="hidden md:block hover:underline"
          >
            Pricing
          </button>
        </span>
      )}

      <span className="flex gap-4">
        <Link to="/login" className="p-2 border border-transparent hover:border-inherit rounded-lg">
          Sign in
        </Link>
        <Link
          to="/contact-us"
          className="bg-[#C8C6FF] hover:bg-violet-200 border rounded-md border-[#131149] py-2.5 px-4 text-sm font-semibold">
          Contact Us
        </Link>
      </span>
    </nav>
  );
};

export default HomeNav;
