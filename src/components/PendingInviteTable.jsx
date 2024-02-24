import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import RevokeInvite from "./RevokeInvite";
import ResendInvite from "./ResendInvite";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

export default function PendingInviteTable() {
  const [pendingInvites, setPendingInvites] = useState([]);

  useEffect(() => {
    const listPendingInvites = async () => {
      try {
        let token = JSON.parse(secureLocalStorage.getItem("token"));
        const invites = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/invites/pending`,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        console.log(invites.data);
        setPendingInvites(invites.data);
      } catch (error) {
        console.log(error);
      }
    };

    listPendingInvites();
  }, []);

  const columns = [
    { id: "name", label: "Team Member", minWidth: 170 },
    { id: "status", label: "Status", minWidth: 60 },
    { id: "inviteSend", label: "Invite Send", minWidth: 100 },
    { id: "resendInvite", label: " ", minWidth: 100 },
    { id: "revokeInvite", label: " ", minWidth: 100 },
  ];

  return (
    <div>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                  sx={{ backgroundColor: "#FCFCFD" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingInvites.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="left"
                    sx={{ padding: "7px" }}
                  >
                    {column.id === "name" ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title={row.email} arrow>
                          <Avatar
                            alt={row.name}
                            src={row.profile_pic}
                            sx={{
                              marginRight: 1,
                              width: "30px",
                              height: "30px",
                              borderRadius: "25%",
                            }}
                            variant="rounded"
                          />
                        </Tooltip>
                        {row.email} {/* Display user's email */}
                      </div>
                    ) : column.id === "resendInvite" ? (
                      <ResendInvite
                        key={row.id}
                        id={row.id}
                        email={row.email}
                      />
                    ) : column.id === "revokeInvite" ? (
                      <RevokeInvite key={row.id} id={row.id} />
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
