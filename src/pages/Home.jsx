import React from "react";
import HomeNav from "../components/HomeNav";
import HomeHero from "../components/HomeHero";
import HomeProduct from "../components/HomeProduct";
import HomePricing from "../components/HomePricing";
import HomeAbout from "../components/HomeAbout";

const Home = () => {
  return (
    <div>
      <HomeNav />
      <HomeHero />
      <HomeProduct />
      <HomePricing />
      <HomeAbout />
    </div>
  );
};

export default Home;
