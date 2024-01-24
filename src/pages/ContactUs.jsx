import React from "react";
import { useNavigate } from "react-router-dom";
import HomeNav from "../components/HomeNav";
import HomeFooter from "../components/HomeFooter";
import ContactForm from "../components/ContactForm";

const ContactUs = () => {
  const navigate = useNavigate();
  /**
   * if user is already logged in then redirect to dashboard,
   * instead of returning the login page
   */
  if (localStorage.getItem("token")) {
    navigate("/dashboard");
  }

  return (
    <div>
      <HomeNav />

      <div className="flex justify-between items-center bg-[#FAF8F7] py-4 px-12">
        <div>
          <h5 className="text-lg font-semibold">Welcome to TwoKey Support</h5>
          <h1 className="text-6xl w-3/5 my-4">How can we help you today?</h1>
        </div>
        <div>2</div>
      </div>

      <ContactForm />
      <HomeFooter />
    </div>
  );
};

export default ContactUs;
