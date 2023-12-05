import React from "react";
import HomeNav from "../components/HomeNav";
import HomeHero from "../components/HomeHero";
import HomeProduct from "../components/HomeProduct";
import HomePricing from "../components/HomePricing";
import HomeAbout from "../components/HomeAbout";
import HomeTestimonials from "../components/HomeTestimonials";
import HomeContactUs from "../components/HomeContactUs";
import HomeFooter from "../components/HomeFooter";

const Home = () => {
  return (
    <div>
      <HomeNav />
      <HomeHero />
      <HomeProduct />
      <HomePricing />
      <HomeAbout />
      {/* <HomeTestimonials /> */}
      <HomeContactUs />
      <HomeFooter />
    </div>
  );
};

export default Home;
