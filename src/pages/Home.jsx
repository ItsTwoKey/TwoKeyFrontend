import React from "react";
import HomeNav from "../components/HomeNav";
import HomeHero from "../components/HomeHero";
import HomeProduct from "../components/HomeProduct";
import HomePricing from "../components/HomePricing";

const Home = () => {
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
