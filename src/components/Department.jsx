import React from "react";
import AddDept from "./AddDept";
import ThreeDots from "../assets/threedots.svg";

let departments = [
  { name: "Account", bg: "#FFF6F6", border: "#FEB7B7" },
  { name: "Finance", bg: "#FFF6FF", border: "#FFA9FF" },
  { name: "Development", bg: "#F6FFF6", border: "#B3FFB3" },
  { name: "Manufacturing", bg: "#F6F7FF", border: "#B6BEFF" },
  { name: "Sales", bg: "#FFFFF6", border: "#FFFFA1" },
  { name: "Human Resources", bg: "#F6FFFE", border: "#C0FFF8" },
];

const Department = () => {
  return (
    <div className="py-4 px-8">
      <div className="flex justify-between ">
        <h3 className="text-xl font-semibold">Geo - Location Settings</h3>
        <AddDept />
      </div>
      <hr className="border border-white border-b-[#D8DEE4] my-3" />
      <div className="grid grid-cols-3 gap-4">
        {departments.map((dept, index) => (
          <div
            key={index}
            className={`py-4 px-4 rounded-lg flex justify-between `}
            style={{
              backgroundColor: dept.bg,
              border: `1px solid ${dept.border}`,
            }}
          >
            <p>{dept.name}</p>
            <img src={ThreeDots} alt="..." className="h-6 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Department;
