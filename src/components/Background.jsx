import { useLocation } from "react-router-dom";

function Background() {
  const location = useLocation();
  const hideBackground =
    location.pathname === "/" ||
    location.pathname === "/contact-us" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/onboard" ||
    location.pathname === "/onboarding" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/change-password" ||
    location.pathname === "/settings";

  if (hideBackground) {
    return null;
  }
  return (
    <div
      className="absolute w-full inset-x-0 -top-40 -z-10 transform-gpu overflow-clip"
      aria-hidden="true"
    >
      <div
        className="relative h-[22rem] bg-[#F1F1FF]"
        style={{
          width: "100vw",
        }}
      />
    </div>
  );
}

export default Background;
