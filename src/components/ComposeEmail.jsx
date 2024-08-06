import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  TextField,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

import React, { useState } from "react";
import { api } from "../utils/axios-instance";
import { auth } from "../helper/firebaseClient";

const ComposeEmail = ({ isSignedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mailContent, setMailContent] = useState({
    to: "",
    subject: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoading(false);
    setMailContent({
      ...mailContent,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const idToken = await auth.currentUser.getIdToken();
    setLoading(true);
    // Send email
    const response = await api.post("/users/send_gmail/", {
      to: mailContent.to,
      subject: mailContent.subject,
      content: mailContent.content,
      idToken,
    });

    if (response.data.status === "success") {
      console.log("Email sent successfully!");
      setLoading(false);
    } else {
      console.log("Failed to send email.");
      setLoading(false);
    }

    setIsOpen(false);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  if(!isSignedIn) {
    return null;
  }

  return (
    <div>
      <IconButton onClick={openDialog}>
        <EmailIcon className="cursor-pointer text-indigo-400 disabled:cursor-not-allowed" />
      </IconButton>
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
            width: "500px",
          },
        }}
      >
        <DialogTitle>New Email</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-full py-2">
            <span className="w-[462px]">
              <InputLabel className="text-md text-left mb-2 mt-4">
                To:
              </InputLabel>
              <TextField
                id="to"
                variant="outlined"
                className="w-full bg-gray-100"
                placeholder="example@gmail.com (we support only gmail)"
                name="to"
                size="small"
                type="email"
                onChange={handleChange}
                value={mailContent.to}
              />
            </span>
            <span className="w-[462px]">
              <InputLabel className="text-md text-left mb-2 mt-4">
                Subject:
              </InputLabel>
              <TextField
                id="subject"
                variant="outlined"
                className="w-full bg-gray-100"
                placeholder="Subject"
                name="subject"
                size="small"
                type="text"
                onChange={handleChange}
                value={mailContent.subject}
              />
            </span>
            <span className="w-[462px]">
              <InputLabel className="text-md text-left mb-2 mt-4">
                Content:
              </InputLabel>
              <TextField
                id="content"
                variant="outlined"
                className="w-full bg-gray-100"
                name="content"
                size="small"
                type="text"
                multiline
                rows={4}
                onChange={handleChange}
                value={mailContent.content}
              />
            </span>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="disabled:opacity-70 flex gap-2 items-center px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white"
          >
            Send
            {loading && <CircularProgress size={15} color="inherit" />}
          </button>
        </DialogActions>
      </Dialog>{" "}
    </div>
  );
};

export default ComposeEmail;
