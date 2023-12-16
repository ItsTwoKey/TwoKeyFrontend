import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Link from "../assets/link.svg";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import axios from "axios";
import ProfilePicDummy from "../assets/profilePicDummy.jpg";
import FileIcon from "../assets/fileIcon.svg";

const ShareFile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    const listUsers = async () => {
      try {
        const userList = await axios.get(
          "https://twokeybackend.onrender.com/users/list_users/",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("users :", userList.data);
        setUsers(userList.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isOpen) {
      listUsers();
    }
  }, [isOpen]);

  const shareFiles = async (fileId) => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));

      const sharedWithIds = selectedUsers.map((user) => user.id);

      const res = await axios.post(
        "https://twokeybackend.onrender.com/file/shareFile/",
        {
          file: [fileId],
          shared_with: sharedWithIds,
          expiration_time: "315,360,000",
        },
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      console.log("shareFiles:", res);
    } catch (error) {
      console.log("error occurred while setting the permissions", error);
    }
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedUsers([]);
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers.splice(index, 1);

    setSelectedUsers(updatedUsers);
  };

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="text-sm rounded-md py-[5px] px-3 border border-gray-300 bg-white"
      >
        Share File
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "16spx",
          },
        }}
      >
        <DialogTitle>
          <span>
            <h4 className="font-semibold text-md">Share File</h4>
            <p className="text-sm">
              Share your project collaborate with your team
            </p>
          </span>
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div className="my-2 w-[486px]">
            <div className="py-2">
              <div className="flex flex-row justify-between items-center my-2">
                <span className="flex flex-row items-center gap-2">
                  <img src={FileIcon} alt="." />
                  <p className="text-sm font-bold">Project1_Watefall.doc</p>
                </span>
                <p className="text-sm">25.45 MB</p>
              </div>
              <p className="text-[#5E5ADB] underline cursor-pointer" href="#">
                Add more files
              </p>
            </div>

            <div className="bg-[#E5E5FF] w-full rounded-lg my-3 py-2 px-4 flex justify-between items-center">
              <span className="flex flex-col gap-1">
                <p className="text-sm font-semibold">
                  Invite members via a sharable link
                </p>
                <p className="text-sm">Anyone with the link can view</p>
              </span>

              <button className="bg-[#5E5ADB] text-white text-md py-2 px-4 rounded-lg flex flex-row items-center gap-1">
                <img src={Link} alt="." />
                Copy Link
              </button>
            </div>

            <div>
              <Select
                multiple
                value={selectedUsers.map((user) => user.id)}
                onChange={(event) => {
                  const selectedUserIds = event.target.value;
                  const selectedUserObjects = users.filter((user) =>
                    selectedUserIds.includes(user.id)
                  );
                  setSelectedUsers(selectedUserObjects);
                  //   console.log("selected Users", selectedUserObjects);
                }}
                displayEmpty
                size="small"
                fullWidth
                renderValue={(selected) => (
                  <div>
                    {selected.map((userId) => {
                      const { name, last_name, profile_pic } = users.find(
                        (user) => user.id === userId
                      );
                      return (
                        <Chip
                          key={userId}
                          avatar={
                            <img
                              src={profile_pic}
                              alt={`${name}'s Profile Pic`}
                              style={{
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                              }}
                            />
                          }
                          label={
                            <div className="flex gap-1">
                              {`${name} ${last_name}`}
                            </div>
                          }
                          className="mx-1"
                        />
                      );
                    })}
                  </div>
                )}
              >
                {/* <MenuItem value="" disabled>
                  <p>Select a user</p>
                </MenuItem> */}
                {users.length > 0 &&
                  users.map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                      style={{
                        borderRadius: "10px",
                      }}
                    >
                      <span className="flex flex-row items-center gap-3 w-full">
                        <img
                          src={
                            user.profile_pic
                              ? user.profile_pic
                              : ProfilePicDummy
                          }
                          alt="Profile pic"
                          className="h-8 w-8 rounded-full"
                        />
                        <span>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs font-light text-gray-500">
                            {user.email}
                          </p>
                        </span>
                      </span>
                    </MenuItem>
                  ))}
              </Select>
              {selectedUsers &&
                selectedUsers.map((user, index) => (
                  <span
                    key={user.id}
                    className="flex flex-row gap-2 items-center my-2 w-fit rounded-full bg-white py-1 px-2 border"
                  >
                    <img
                      src={
                        user.profile_pic ? user.profile_pic : ProfilePicDummy
                      }
                      alt="Profile pic"
                      className="h-6 w-6 rounded-full"
                    />
                    <p className="text-sm font-semibold">
                      {user.name} {user.last_name}
                    </p>
                    <button
                      onClick={() => handleRemoveUser(index)}
                      className="h-4 w-4 text-xs"
                    >
                      ⨉
                    </button>
                  </span>
                ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <div className="flex justify-between w-full px-2">
            <button
              className="px-3 py-1.5 rounded-lg shadow-sm border border-gray-300 text-sm font-semibold"
              onClick={closeDialog}
              color="primary"
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 rounded-lg shadow-sm border border-[#5E5ADB] text-[#5E5ADB] text-sm font-semibold"
              onClick={() => alert("Done Clicked!")}
            >
              Done
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShareFile;
