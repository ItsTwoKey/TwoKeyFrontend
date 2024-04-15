import React, { useState } from "react";
import { supabase } from "../helper/supabaseClient"; // Assuming you have configured Supabase client and exported it as 'supabase'

function FileUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const screenshotImg = event.target.files[0];
      const { data, error } = await supabase.storage
        .from("TwoKey")
        .upload("screenshot", screenshotImg, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      console.log("File uploaded successfully:", data);
      // Optionally, you can do something with the uploaded file data here

      setUploading(false);
      setUploadError(null);
    } catch (error) {
      console.error("Error uploading file:", error.message);
      setUploadError(error.message);
      setUploading(false);
    }
  };

  const handleFileUpdate = async (event) => {
    try {
      const newscreenshot = event.target.files[0];

      const { data, error } = await supabase.storage
        .from("TwoKey")
        .update("screenshot", newscreenshot, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      console.log("File updated successfully:", data);
      // Optionally, you can do something with the updated file data here
      if (data) {
        alert("success");
      }
    } catch (error) {
      console.error("Error updating file:", error.message);
    }
  };

  return (
    <>
      <div>
        <input type="file" onChange={handleFileUpload} />
        <button type="submit">Upload</button>{" "}
        {/* Submit button for file upload */}
        {uploading && <p>Uploading...</p>}
        {uploadError && <p>Error: {uploadError}</p>}
      </div>
      <div>
        <input type="file" onChange={handleFileUpdate} />
        <button type="submit">Update</button>{" "}
        {/* Submit button for file update */}
      </div>
    </>
  );
}

export default FileUploadComponent;
