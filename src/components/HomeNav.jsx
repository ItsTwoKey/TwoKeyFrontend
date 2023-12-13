import React from "react";

const HomeNav = () => {
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
      <h4 className="text-lg font-[400] font-allertaStencil">Twokey</h4>
      <span className="flex gap-8 py-2">
        <button onClick={() => scrollToSection("about")} className="hidden md:block">
          About Us
        </button>

        <button onClick={() => scrollToSection("product")} className="hidden md:block">
          Product
        </button>

        <button onClick={() => scrollToSection("pricing")} className="hidden md:block">
          Pricing
        </button>
      </span>
      <span className="flex gap-4">
        <a href="/login" className="py-2">
          Sign in
        </a>
        <a
          href="/contact-us"
          className="bg-[#C8C6FF] border rounded-md border-[#131149] py-2 px-4 text-sm font-semibold"
        >
          Contact Us
        </a>
      </span>
    </nav>
  );
};

export default HomeNav;
