import React from "react";
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

export default function PendingInviteTable() {
  const columns = [
    { id: "name", label: "Team Member", minWidth: 170 },
    { id: "status", label: "Status", minWidth: 60 },
    { id: "inviteSend", label: "Invite Send", minWidth: 100 },
    { id: "resendInvite", label: " ", minWidth: 100 },
    { id: "revokeInvite", label: " ", minWidth: 100 },
  ];

  // Sample data for demonstration
  const rows = [createData()];

  function createData() {
    return {
      name: "John Doe",
      status: (
        <p className="bg-[#ECFDF3] text-center text-green-700 rounded-full py-1 px-3">
          Active
        </p>
      ),
      inviteSend: "11/11/2023",
      resendInvite: <ResendInvite />,
      revokeInvite: <RevokeInvite />,
    };
  }

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
            {rows.map((row, index) => (
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
                        {row.name}
                      </div>
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
