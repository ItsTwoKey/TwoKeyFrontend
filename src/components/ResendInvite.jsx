import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const ResendInvite = ({ id, email }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const resendInvite = async () => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/deleteUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      console.log(response.status);

      if (response) {
        try {
          let token = JSON.parse(secureLocalStorage.getItem("token"));

          let body = {
            emails: [email],
          };

          console.log("resend email", body);

          let response = await axios.post(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/users/invite`,
            body,
            {
              headers: {
                Authorization: `Bearer ${token.session.access_token}`,
              },
            }
          );
          console.log("invite member:", response);

          if (response) {
            closeDialog();
          }
        } catch (error) {
          console.log("error occurew while inviting user", error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="text-sm rounded-md py-[5px] px-3 border border-gray-300 bg-white"
      >
        Resend Invites
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        <DialogTitle>Resend Invite</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] p-3">
            <p className="text-sm">
              Resend an invite will allow this person to become a member of your
              organization.
            </p>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Close
          </button>
          <button
            className="px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white"
            onClick={resendInvite}
          >
            Resend Invite
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResendInvite;
