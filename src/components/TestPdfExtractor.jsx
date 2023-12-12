import React, { useState } from "react";

const FileExtractor = () => {
  const [fileContent, setFileContent] = useState(null);

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
    <div className="border w-96">
      <input type="file" onChange={handleFileChange} />
      {fileContent && (
        <div className="">
          <h2>File Content:</h2>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  );
};

export default FileExtractor;
