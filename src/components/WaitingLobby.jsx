import { useMemo } from "react";
import secureLocalStorage from "react-secure-storage";

export default function WaitingLobby() {
  const data = secureLocalStorage.getItem("profileData");
  const user = useMemo(() => {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error("Could not parse profile data", { err });
      return null;
    }
  }, [data]);
  return (
    <div className=" min-h-screen relative">
      <div>
        <img
          src="/waiting-lobby-pattern.svg"
          alt="Logo"
          className="w-screen h-screen absolute -z-10 -left-12 md:-left-32 lg:-left-56 -top-44 md:-top-32 lg:-top-24 "
        />
      </div>

      <div className="flex items-center justify-between w-full  px-2 md:px-4 lg:px-8 py-4 border-b-2  ">
        <a href="/">
          <div className="flex items-center space-x-2">
            <img
              src="/twokey-logo.svg"
              alt="Logo"
              className="h-6 w-6 text-[#1E1B66]"
            />
            <span className="text-xl font-allertaStencil text-[#1E1B66]">
              TWOKEY
            </span>
          </div>
        </a>
        <div className="flex items-center justify-start gap-2">
          <img
            src={user?.profilePictureUrl}
            alt="ProfilePic"
            className="rounded-full w-6 h-6 "
          />
          <span className="text-sm  font-semibold">{user?.name}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl px-4 py-8 text-center mx-auto pt-24 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold font-inter">
          Almost there! We&apos;re working hard to get you connected
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl px-4 py-8 text-center mx-auto  ">
        <p className="mt-4 text-lg md:text-xl text-muted-foreground font-light font-plusJakartaSans">
          Excitement brewing! We're just finalizing the details for your TwoKey
          membership. Sit tight for a moment while we make sure everything is
          ready. In the meantime, feel free to take a peek at our website to see
          what amazing features await you!
        </p>
      </div>
    </div>
  );
}
