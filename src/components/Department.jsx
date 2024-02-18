import React, { useState, useEffect } from "react";
import AddDept from "./AddDept";
import ThreeDots from "../assets/threedots.svg";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

let departments = [
  { name: "Account", metadata: { bg: "#FFF6F6", border: "#FEB7B7" } },
  { name: "Finance", metadata: { bg: "#FFF6FF", border: "#FFA9FF" } },
  { name: "Development", metadata: { bg: "#F6FFF6", border: "#B3FFB3" } },
  { name: "Manufacturing", metadata: { bg: "#F6F7FF", border: "#B6BEFF" } },
  { name: "Sales", metadata: { bg: "#FFFFF6", border: "#FFFFA1" } },
  { name: "Human Resources", metadata: { bg: "#F6FFFE", border: "#C0FFF8" } },
];

const Department = () => {
  const [newDepartments, setNewDepartments] = useState(departments);

  useEffect(() => {
    const listDepartments = async () => {
      try {
        let token = JSON.parse(secureLocalStorage.getItem("token"));
        const departments = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/listDepts/`,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        console.log(departments.data);
        setNewDepartments(departments.data);
      } catch (error) {
        console.log(error);
      }
    };

    listDepartments();
  }, []);

  return (
    <div className="py-4 px-8">
      <div className="flex justify-between ">
        <h3 className="text-xl font-semibold">Geo - Location Settings</h3>
        <AddDept />
      </div>
      <hr className="border border-white border-b-[#D8DEE4] my-3" />
      <div className="grid grid-cols-3 gap-4">
        {newDepartments.map((dept, index) => (
          <div
            key={index}
            className={`py-4 px-4 rounded-lg flex justify-between `}
            style={{
              backgroundColor: dept.metadata.bg,
              border: `1px solid ${dept.metadata.border}`,
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
