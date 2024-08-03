import React, { useState } from "react";
import DisplayEmails from "./DispalyEmails";

const LatestEmails = () => {
  const [emails, setEmails] = useState([]);

  return (
    <div>
      <DisplayEmails emails={emails} onEmailsFetched={setEmails} />
    </div>
  );
};

export default LatestEmails;
