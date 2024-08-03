import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/HeroAni/logo.png";

const LandingNav = () => {
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
      className="bg-[transparent] h-[72px] flex justify-between items-center px-4 md:px-12 font-tahoma"
    >
      <div className="flex items-center">
        <img
          src={logo}
          alt="logo"
          className="h-10 ml-2 mr-2 bg-[#AF50DC] rounded-lg"
        />
        <a
          href="/"
          alt="Twokey"
          className="text-lg font-[400] font-allertaStencil text-white"
        >
          TwoKey
        </a>
      </div>

      {isOnContactUs ? (
        <span className="flex gap-8 py-2">
          <Link to="/" className="hidden md:block hover:underline text-white">
            Pricing
          </Link>
          <Link to="/" className="hidden md:block hover:underline text-white">
            Product
          </Link>
          <Link to="/" className="hidden md:block hover:underline text-white">
            About Us
          </Link>
        </span>
      ) : (
        <span className="flex gap-8 py-2 text-white">
          <button
            onClick={() => scrollToSection("pricing")}
            className="hidden md:block hover:underline"
          >
            PRICING
          </button>
          <Link
            onClick={() => scrollToSection("pricing")}
            className="hidden md:block hover:underline"
            to="/contact-us"
          >
            CONTACT
          </Link>
          <button
            onClick={() => scrollToSection("product")}
            className="hidden md:block hover:underline"
          >
            PRODUCT
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="hidden md:block hover:underline"
          >
            ABOUT
          </button>
        </span>
      )}

      <span className="flex gap-4">
        <Link
          to="/login"
          className="bg-[#12191B] hover:border-violet-500 border rounded-md border-[#12191B] py-2.5 px-6 text-sm font-semibold text-white"
        >
          Sign In
        </Link>
      </span>
    </nav>
  );
};

export default LandingNav;
