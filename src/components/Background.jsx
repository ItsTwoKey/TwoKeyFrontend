import { useLocation } from "react-router-dom";

function Background() {
  const location = useLocation();
  const hideBackground =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/onboarding" ||
    location.pathname === "/settings" ||
    location.pathname.startsWith("/ai");

  if (hideBackground) {
    return null;
  }
  return (
    <div
      className="absolute w-full inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden"
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
