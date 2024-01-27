import React from "react";
import SearchIcon from "../../assets/searchicon.svg";


export default function SearchTube() {
  return (
    <>
      <div className="flex justify-between itens-center p-2 my-5 mt-7">
        <input
          type="search"
          className="border-[#CED1D6] border-2 rounded-md font-normal w-98 bg-no-repeat bg-left py-2 pr-2 text-sm search-device"
          placeholder="Search"
          style={{
            backgroundImage: `url(${SearchIcon})`,
            width: "500px",
            backgroundPositionX: "20px",
            backgroundSize: "17px",
            paddingLeft: "50px",
          }}
        />
        <button className="rounded-lg bg-[#5E5ADB] text-white py-2 px-4">
          Search
        </button>
      </div>
    </>
  );
}
