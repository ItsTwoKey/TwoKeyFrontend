import React from "react";
import LandingNav from "../components/LandingNav";
import LandingFeatures from "../components/LandingFeatures";
import LandingSecurity from "../components/LandingSecurity";

import bg from "../assets/HeroAni/bg.png";
import pages from "../assets/HeroAni/pages.png";
import bg2 from "../assets/sec2-bg.png";
import bleft from "../assets/Landing/BorderLeft.png";
import bright from "../assets/Landing/BorderRight.png";
import buttonBg from "../assets/Landing/buttonBg.png";
import endBg from "../assets/Landing/endBg.png";
import bottomBg from "../assets/Landing/bottomBg.png";
import eg from "../assets/Landing/eg.png";
import HomeFooter from "../components/HomeFooter";
import LandingFooter from "../components/LandingFooter";

const features = [
  {
    title: "Two-Person",
    subTitle: "Permission",
    mt: 0,
  },
  {
    title: "Access Time",
    subTitle: "Windows",
    mt: 64,
  },
  {
    title: "Location-based",
    subTitle: "access notification",
    mt: 96,
  },
  {
    title: "Customization",
    subTitle: "security",
    mt: 20,
  },
];

const Landing = () => {
  return (
    <div className="bg-[#06000E]">
      <LandingNav />
      <div
        className="h-full bg-cover bg-center md:bg-bottom"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex flex-col md:flex-row px-6 md:px-20 pt-20 items-center">
          <div className="md:w-1/2 md:mr-10">
            <h1 className="text-white text-4xl md:text-6xl">
              The Secure Platform for Sharing Your{" "}
              <span className="text-blue-300">Media Files</span>
            </h1>

            <p className="text-white mt-3">
              TwoKey goes beyond file sharing. It's secure collaboration. Our
              cutting-edge technology ensures your media stays protected, so you
              can focus on what matters most - your work.
            </p>
            <button
              className="flex mt-10 px-7 py-2 text-white relative mx-auto md:mx-0 rounded-lg font-bold"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #1F0027, #7E408D, #1F0027)",
              }}
            >
              Sign Up
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </button>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img src={pages} alt="TwoKey" className="md:max-w-[45vw] mx-auto" />
          </div>
        </div>
        <div
          className="h-full mt-24 bg-auto"
          style={{ backgroundImage: `url(${bg2})` }}
        >
          <div className="flex flex-col items-center">
            <h1
              style={{
                backgroundImage:
                  "linear-gradient(to right, grey, #D3D3D3, #FFFFFF)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
              className="text-3xl md:text-5xl font-bold pt-24"
            >
              Where innovation
            </h1>
            <h1
              style={{
                backgroundImage:
                  "linear-gradient(to right, grey, #D3D3D3, #FFFFFF)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
              className="text-3xl md:text-5xl font-bold pt-2 mx-2"
            >
              meets security
            </h1>
            <div className="bg-white mt-5 text-center py-2 px-2 rounded-full">
              Enhancing Security and Control over Shared Content
            </div>
          </div>
          <div className="flex h-full md:h-[70vh] md:overflow-hidden mt-16 justify-between">
            <img
              src={bleft}
              alt="Left Border"
              className="h-2/3 mt-auto hidden lg:block"
            />
            <div className="flex flex-wrap justify-center">
              {features.map((feature) => (
                <LandingFeatures
                  mt={feature.mt}
                  title={feature.title}
                  subTitle={feature.subTitle}
                  key={feature.title}
                />
              ))}
            </div>
            <img
              src={bright}
              alt="Right Border"
              className="h-2/3 mt-auto hidden lg:block"
            />
          </div>
        </div>
      </div>
      <LandingSecurity />
      <div
        className="text-center bg-right bg-cover h-[30vh] flex items-center justify-center"
        style={{ backgroundImage: `url(${buttonBg})` }}
      >
        <div className="inline-block rounded-xl bg-white">
          <button className="bg-white py-3 px-6 m-2 border-solid border-grey border-2 rounded-xl">
            Read about more features
          </button>
        </div>
      </div>
      <div
        className="h-screen bg-cover mt-5 relative overflow-hidden"
        style={{ backgroundImage: `url(${endBg})` }}
      >
        <img
          src={bottomBg}
          alt="background"
          className="absolute inset-0 object-cover z-0"
        />
        <div
          className="absolute inset-0 flex flex-col md:flex-row items-center justify-center z-10 mx-auto mt-5 text-bold rounded-xl"
          style={{ width: "80%", height: "90%" }}
        >
          <div className="bg-[#F2F7F7] p-4 md:p-16 text-left h-1/2 w-full md:w-2/5 md:h-full flex flex-col justify-evenly rounded-t-lg md:rounded-l-lg md:rounded-t-none">
            <h1 className="text-black text-xl md:text-3xl lg-5xl md:mt-16">
              Redefining Media Sharing with Unparalleled{" "}
              <span className="text-blue-300">Security and Control</span>
            </h1>
            <button
              className="flex mt-10 px-3 md:px-7 py-2 text-white relative w-[30vw] md:w-[15vw] lg:w-[10vw] rounded-lg font-bold mx-auto md:mx-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #1F0027, #7E408D, #1F0027)",
              }}
            >
              Sign Up
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </button>
          </div>
          <div className="p-8 text-center h-full bg-gradient-to-r from-[#BCDDE6] via-[#C8D7DD] via-[#D3D0D5] via-[#DDC9CC] via-[#E6C2C3] to-[#EFBBBB] relative rounded-b-lg md:rounded-r-lg md:rounded-b-none w-full md:w-3/5">
            <img
              src={eg}
              alt="example dashboard"
              className="absolute bottom-0 right-0 object-cover object-left-top rounded-tl-lg"
              style={{ width: "90%", height: "90%" }}
            />
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default Landing;
