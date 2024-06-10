import React, { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Desktopicon from "../assets/Desktopicon.svg";
import MobileIcon from "../assets/MobileIcon.svg";

const Device = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const listUsers = async () => {
      let token = secureLocalStorage.getItem("token");
      try {
        const userList = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/list_users`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("users :", userList.data);
        setUsers(userList.data);
      } catch (error) {
        console.log(error);
      }
    };

    listUsers();
  }, []);

  return (
    <>
      <div className="py-4 px-8 rounded-md h-screen overflow-y-scroll scrollbar-hide">
        <h2 className="text-xl font-semibold p-2">Device Management</h2>
        <hr className="border border-white border-b-[#D8DEE4]" />
        <div>
          {users.length ? (
            users.map((user) => (
              <div
                key={user.id}
                className="my-4 p-4 rounded-lg bg-[#f1f1ff] flex flex-row justify-between items-center"
              >
                <p>
                  {user.name} {user.last_name}
                </p>

                <span className="flex flex-row gap-4 items-center">
                  <p className="px-2 py-1 text-sm bg-gray-200 rounded-lg ">
                    {user.metadata ? user.metadata?.devices : "Unknown"}
                  </p>

                  <span className="flex flex-row gap-2 items-center">
                    <img src={Desktopicon} alt="Desktop" />
                    <p>Desktop</p>
                  </span>

                  {/* <img src={MobileIcon} alt="Mobile" /> */}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center my-2">Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Device;
