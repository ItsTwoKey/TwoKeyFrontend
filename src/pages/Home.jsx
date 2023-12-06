import React from "react";
import HomeNav from "../components/HomeNav";
import HomeHero from "../components/HomeHero";
import HomeProduct from "../components/HomeProduct";
import HomePricing from "../components/HomePricing";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  /**
   * if user is already logged in then redirect to dashboard,
   * instead of returning the login page
   */
  if (sessionStorage.getItem("token")) {
    navigate("/dashboard");
  }
  return (
    <div>
      <HomeNav />
      <HomeHero />
      <HomeProduct />
      <HomePricing />
    </div>
  );
};

export default Home;
