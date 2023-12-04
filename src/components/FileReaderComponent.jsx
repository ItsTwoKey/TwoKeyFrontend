import React, { useState } from "react";

const FileReadComponent = () => {
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
      };

      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div>
        <h3>File Content:</h3>
        <pre>{fileContent}</pre>
      </div>
    </div>
  );
};

export default FileReadComponent;
