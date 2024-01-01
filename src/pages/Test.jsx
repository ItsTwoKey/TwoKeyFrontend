// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AI = () => {
//   const [message, setMessage] = useState("");
//   const [csvData, setCsvData] = useState(
//     `bike_name,price,city,kms_driven,owner,age,power,brand
//     TVS Star City Plus Dual Tone 110cc,35000.0,Ahmedabad,17654.0,First Owner,3.0,110.0,TVS
//     Royal Enfield Classic 350cc,119900.0,Delhi,11000.0,First Owner,4.0,350.0,Royal Enfield
//     Triumph Daytona 675R,600000.0,Delhi,110.0,First Owner,8.0,675.0,Triumph
//     TVS Apache RTR 180cc,65000.0,Bangalore,16329.0,First Owner,4.0,180.0,TVS
//     Yamaha FZ S V 2.0 150cc-Ltd. Edition,80000.0,Bangalore,10000.0,First Owner,3.0,150.0,Yamaha
//     Yamaha FZs 150cc,53499.0,Delhi,25000.0,First Owner,6.0,150.0,Yamaha
//     Honda CB Hornet 160R  ABS DLX,85000.0,Delhi,8200.0,First Owner,3.0,160.0,Honda
//     Hero Splendor Plus Self Alloy 100cc,45000.0,Delhi,12645.0,First Owner,3.0,100.0,Hero
//     Royal Enfield Thunderbird X 350cc,145000.0,Bangalore,9190.0,First Owner,3.0,350.0,Royal Enfield
//     Royal Enfield Classic Desert Storm 500cc,88000.0,Delhi,19000.0,Second Owner,7.0,500.0,Royal Enfield
//     Yamaha YZF-R15 2.0 150cc,72000.0,Bangalore,20000.0,First Owner,7.0,150.0,Yamaha
//     Yamaha FZ25 250cc,95000.0,Bangalore,9665.0,First Owner,4.0,250.0,Yamaha
//     Bajaj Pulsar NS200,78000.0,Bangalore,9900.0,First Owner,4.0,200.0,Bajaj
//     Bajaj Discover 100M,29499.0,Delhi,20000.0,First Owner,8.0,100.0,Bajaj
//     `
//   ); // Hardcoded CSV data
//   const [summarizedText, setSummarizedText] = useState({});

//   const fetchData = async () => {
//     const options = {
//       method: "POST",
//       url: "https://article-extractor-and-summarizer.p.rapidapi.com/summarize-text",
//       headers: {
//         "content-type": "application/json",
//         "X-RapidAPI-Key": "4170d6fec5msh4817aca35c9333ap1cae79jsnc7d7a464dda6",
//         "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
//       },
//       data: {
//         lang: "en",
//         text: csvData,
//       },
//     };

//     try {
//       const response = await axios.request(options);
//       console.log(response.data);
//       setSummarizedText(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [csvData]);

//   const handleAskAiClick = () => {
//     alert(message);
//   };

//   const handleCopyClick = () => {
//     const textArea = document.createElement("textarea");
//     textArea.value = summarizedText.summary;
//     document.body.appendChild(textArea);
//     textArea.select();
//     document.execCommand("copy");
//     document.body.removeChild(textArea);
//   };

//   return (
//     <div className=" ">
//       <p className="text-sm">{summarizedText.summary}</p>
//     </div>
//   );
// };

// export default AI;

// import React, { useState } from "react";
// import Papa from "papaparse";
// import axios from "axios";

// const FileDataExtractor = () => {
//   const [csvData, setCsvData] = useState([]);
//   const [txtData, setTxtData] = useState("");

//   const handleCsvFileChange = (event) => {
//     const file = event.target.files[0];
//     Papa.parse(file, {
//       complete: (result) => {
//         setCsvData(result.data);
//       },
//       header: true, // Set to true if your CSV file has headers
//     });
//   };

//   const handleTxtFileChange = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setTxtData(e.target.result);
//     };
//     reader.readAsText(file);
//   };

//   const handleCsvDataDisplay = () => {
//     if (csvData.length === 0) {
//       return <p>No CSV data available</p>;
//     }

//     return (
//       <div>
//         <h3>CSV Data</h3>
//         <ul>
//           {csvData.map((row, index) => (
//             <li key={index}>{JSON.stringify(row)}</li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   const handleTxtDataDisplay = () => {
//     if (txtData === "") {
//       return <p>No TXT data available</p>;
//     }

//     return (
//       <div>
//         <h3>TXT Data</h3>
//         <p>{txtData}</p>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <h1>Data Extractor</h1>
//       <div>
//         <label htmlFor="csvFile">Upload CSV File:</label>
//         <input type="file" id="csvFile" onChange={handleCsvFileChange} />
//       </div>
//       <div>
//         <label htmlFor="txtFile">Upload TXT File:</label>
//         <input type="file" id="txtFile" onChange={handleTxtFileChange} />
//       </div>
//       {handleCsvDataDisplay()}
//       {handleTxtDataDisplay()}
//     </div>
//   );
// };

// export default FileDataExtractor;

import React, { useState, useEffect } from "react";

const FileReaderComponent = () => {
  const [fileText, setFileText] = useState("");
  const [presignedUrl, setPresignedUrl] = useState("");
  const [error, setError] = useState(null);

  const fetchFileText = async () => {
    try {
      const response = await fetch(presignedUrl);
      const text = await response.text();
      setFileText(text);
      setError(null);
    } catch (error) {
      setFileText("");
      setError("Error fetching file. Please check the URL and try again.");
    }
  };

  useEffect(() => {
    if (presignedUrl) {
      fetchFileText();
    }
  }, [presignedUrl]);

  const handleInputChange = (event) => {
    setPresignedUrl(event.target.value);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fileText);
  };

  return (
    <div>
      <label>
        Enter Supabase Presigned URL:
        <input type="text" value={presignedUrl} onChange={handleInputChange} />
      </label>
      <button onClick={fetchFileText}>Fetch File</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>File Content:</h2>
      <pre>{fileText}</pre>

      {fileText && (
        <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
      )}
    </div>
  );
};

export default FileReaderComponent;
