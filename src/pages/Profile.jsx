import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../helper/supabaseClient";
import ProfilePersonalInfo from "../components/ProfilePersonalInfo";
import ProfileAddressInformation from "../components/ProfileAddressInformation";
import ProfilePicDummy from "../assets/profilePicDummy.jpg";
import ProfileTabs from "../components/ProfileTabs";
import Pen from "../assets/pen.svg";
import ErrorPage from "../components/ErrorPage";
import secureLocalStorage from "react-secure-storage";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { auth } from "../helper/firebaseClient";
import { api } from "../utils/axios-instance";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const { profileData, setProfileData } = useAuth();
  const fileInputRef = useRef(null);

  useEffect(() => {
    let data = secureLocalStorage.getItem("profileData");
    setProfileData(JSON.parse(data));
  }, []);

  const toggleEditing = () => {
    if (isEditing) {
      // If in editing mode and an image is selected, upload the selected picture
      if (selectedPicture) {
        handleProfilePicUpdate();
      } else {
        console.log("Image not provided");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleImageInputChange = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedPicture(file);
    }
  };

  const handleProfilePicUpdate = async () => {
    try {
      let token = auth.currentUser.getIdToken();
      const profileData = JSON.parse(secureLocalStorage.getItem("profileData"));

      let profilePictureBase64 = null;
      const profilePictureFile = selectedPicture;
      if (profilePictureFile) {
        // Convert the image file to base64
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        await new Promise((resolve) => {
          reader.onloadend = () => {
            profilePictureBase64 = reader.result.split(",")[1];
            resolve();
          };
        });
      }

      const res = await api.put(`/users/update-profile/`, {
        idToken: token,
        profileData,
        profilePicture: profilePictureBase64,
      });

      setProfileData(res.data);
      secureLocalStorage.setItem("profileData", JSON.stringify(res.data));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("An error occurred while uploading the profile picture");
      console.error(
        "An error occurred while uploading the profile picture:",
        error
      );
    }
  };

  if (!secureLocalStorage.getItem("token")) {
    return <ErrorPage error="You are not authorised" />;
  }

  return (
    <div className="p-4 w-full">
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="flex flex-row justify-between items-center p-2">
        <h3 className="text-xl font-bold">My Profile</h3>
        <span className="flex flex-row gap-4">
          {isEditing && (
            <button className="bg-white rounded-md px-4 border-2">
              Cancel
            </button>
          )}
          <button
            onClick={toggleEditing}
            className={`w-16 px-2 py-1 text-sm border shadow-lg rounded-md flex flex-row gap-2 justify-center items-center ${
              isEditing ? "bg-blue-700 text-white" : "bg-white"
            }`}
          >
            {!isEditing && <img src={Pen} alt="." />}
            {isEditing ? "Save" : "Edit"}
          </button>
        </span>
      </div>
      <div className="p-4 border shadow-lg bg-[#F7F8FA] border-gray-200 w-full rounded-xl ">
        <div className="flex flex-row items-center space-x-4">
          <div
            className="relative"
            onClick={isEditing ? handleImageInputChange : null}
          >
            <img
              src={
                profileData ? profileData.profilePictureUrl : ProfilePicDummy
              }
              alt="ProfilePic"
              className="rounded-full w-24 h-24 object-cover"
            />
            {isEditing && (
              <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-full px-2 flex justify-center items-center text-lg">
                +
              </button>
            )}
          </div>

          <div className="flex flex-col leading-9">
            <h3 className="text-lg font-semibold">
              {profileData?.username ? `#${profileData.username}` : "UserName"}
            </h3>
            <h5 className="text-md font-semibold text-gray-700">
              {profileData?.role_priv ? profileData.role_priv : "Position"}
            </h5>
            <p className="text-sm text-gray-500">
              {profileData ? (
                <>
                  {profileData.city && <>{profileData.city}, </>}
                  {profileData.state && <>{profileData.state}, </>}
                  {profileData.country && <>{profileData.country}</>}
                </>
              ) : (
                "Address"
              )}
            </p>

            {/* <button onClick={getProfileData}>getProfileData</button> */}
          </div>
        </div>
      </div>
      <ProfilePersonalInfo isEditing={isEditing} profileData={profileData} />
      {/* <ProfileWorkInformation profileData={profileData} /> */}
      <ProfileAddressInformation
        isEditing={isEditing}
        profileData={profileData}
      />

      {/* Hidden input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageUpload}
      />
      <div>
        <ProfileTabs />
      </div>
    </div>
  );
};

export default Profile;
