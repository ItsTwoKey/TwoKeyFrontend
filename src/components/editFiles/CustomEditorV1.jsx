import React, { useState } from "react";
import "./CustomEditor.css"; // Import your CSS file for styling
import icon from "./ToolbarButtons";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box, Divider, Grid, Stack } from "@mui/joy";

export default function CustomEditor() {
  const [content, setContent] = useState(""); // State to store editor content
  const [lineHeight, setLineHeight] = useState("1"); // State to store line height
  const [fontSize, setFontSize] = useState(16); // State to store font size
  const [anchorEl, setAnchorEl] = useState({
    image: null,
    alignment: null,
    textcolor: null,
    bgcolor: null,
  });
  const [editorConfig, setEditorConfig] = useState({
    textcolor: "black",
    bgcolor: null,
    temp: null,
    colindex: null,
  });

  const updateEditorConfig = (key, value) => {
    setEditorConfig({ ...editorConfig, [key]: value });
  };

  const handleClick = (event, elem) => {
    setAnchorEl({ ...anchorEl, [elem]: event.currentTarget });
  };

  const handleClose = () => {
    setAnchorEl({
      image: null,
      alignment: null,
      textcolor: null,
      bgcolor: null,
    });
  };

  // Function to handle text formatting
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value); // Execute browser command
  };

  const formatTextWithColor = (color) => {
    document.execCommand("foreColor", false, color); // Set text color
  };

  // Function to handle line height change
  const handleLineHeightChange = (e) => {
    setLineHeight(e.target.value);
    formatText("lineHeight", e.target.value);
  };

  const handleFontSizeChange = (e) => {
    formatText("fontSize", `${e.target.value}px`);
    setFontSize(e.target.value);
  };

  // Function to handle text filter options
  const applyTextFilter = (filterType) => {
    const selection = window.getSelection(); // Get the current selection
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0); // Get the range of the selection
      const selectedText = range.toString(); // Get the selected text
      let newText = selectedText; // Initialize newText with the selected text

      // Apply the specified text filter to newText
      switch (filterType) {
        case "uppercase":
          newText = selectedText.toUpperCase();
          break;
        case "lowercase":
          newText = selectedText.toLowerCase();
          break;
        case "capitalize":
          newText = selectedText
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
          break;
        default:
          break;
      }

      // Replace the selected text with the filtered text
      document.execCommand("insertText", false, newText);
    }
  };

  // Function to insert a table
  const generateTable = (m = 3, n = 4) => {
    let tableHtml = '<table style="border-collapse: collapse; width: 100%;">';
    for (let i = 0; i < m; i++) {
      tableHtml += "<tr>";
      for (let j = 0; j < n; j++) {
        tableHtml += `<td style="border: 1px solid black;">${i + 1}-${
          j + 1
        }</td>`;
      }
      tableHtml += "</tr>";
    }

    tableHtml += "</table>";
    document.execCommand("insertHTML", false, tableHtml);
    // initializeCellListeners();
  };

  const initializeCellListeners = () => {
    const table = document.querySelector("table");
    if (!table) return;

    // Add event listeners to table cells
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      for (let j = 0; j < table.rows.length; j++) {
        const cell = table.rows[j].cells[i];
        cell.addEventListener("click", () => handleCellClick(i));
      }
    }
  };

  // Function to handle click on a table cell
  const handleCellClick = (columnIndex) => {
    // Store the selected column index for future reference
    updateEditorConfig("colindex", columnIndex);
    // Perform any additional actions based on the selected column index
    console.log("Selected column index:", editorConfig.colindex);
  };

  // Function to insert a new row at the specified index in an existing table
  const insertRow = (index) => {
    const table = document.querySelector("table");
    if (!table) return;

    const newRow = table.insertRow(index);
    const columns = table.rows[0].cells.length;

    for (let i = 0; i < columns; i++) {
      const cell = newRow.insertCell(i);
      cell.style.border = "1px solid black";
      cell.textContent = `${index + 1}-${i + 1}`;
    }
  };

  // Function to insert a new column at the specified index in an existing table
  const insertColumn = (index) => {
    const table = document.querySelector("table");
    if (!table) return;

    const rows = table.rows.length;
    for (let i = 0; i < rows; i++) {
      const newRowCell = table.rows[i].insertCell(index);
      newRowCell.style.border = "1px solid black";
      newRowCell.textContent = `${i + 1}-${index + 1}`;
    }
  };

// Function to merge selected cells
const mergeCell = () => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selectedNode = range.commonAncestorContainer;

  // Assuming selectedNode is the <td> element
  const selectedCell = selectedNode.tagName === "TD" ? selectedNode : selectedNode.parentNode;

  const table = selectedCell.closest("table");
  if (!table) return;

  // Check if there are more than one cell selected
  const selectedCells = table.querySelectorAll(".selected-cell");
  if (selectedCells.length < 2) return;

  // Get the boundaries of the selected cells
  const startRow = Math.min(...Array.from(selectedCells).map(cell => cell.parentNode.rowIndex));
  const endRow = Math.max(...Array.from(selectedCells).map(cell => cell.parentNode.rowIndex));
  const startCol = Math.min(...Array.from(selectedCells).map(cell => cell.cellIndex));
  const endCol = Math.max(...Array.from(selectedCells).map(cell => cell.cellIndex));

  // Merge cells by spanning rows and columns
  selectedCells.forEach((cell, index) => {
    if (index !== 0) {
      const rowSpan = cell.parentNode.rowIndex - startRow + 1;
      const colSpan = cell.cellIndex - startCol + 1;
      selectedCells[0].rowSpan = rowSpan;
      selectedCells[0].colSpan = colSpan;
      cell.remove();
    }
  });

  // Remove the 'selected-cell' class from all cells
  table.querySelectorAll(".selected-cell").forEach(cell => cell.classList.remove("selected-cell"));
};

// Function to split merged cells
const splitCell = () => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selectedNode = range.commonAncestorContainer;

  // Assuming selectedNode is the <td> element
  const selectedCell = selectedNode.tagName === "TD" ? selectedNode : selectedNode.parentNode;

  const table = selectedCell.closest("table");
  if (!table) return;

  const rowSpan = selectedCell.rowSpan || 1;
  const colSpan = selectedCell.colSpan || 1;
  selectedCell.rowSpan = 1;
  selectedCell.colSpan = 1;

  // Insert new cells to split the merged cell
  for (let i = 1; i < rowSpan; i++) {
    const newRow = table.rows[selectedCell.parentNode.rowIndex + i];
    const newCell = newRow.insertCell(selectedCell.cellIndex);
    newCell.textContent = `${newRow.rowIndex}-${selectedCell.cellIndex + 1}`;
    newCell.style.border = "1px solid black";
  }

  for (let j = 1; j < colSpan; j++) {
    const newCell = selectedCell.parentNode.insertCell(selectedCell.cellIndex + j);
    newCell.textContent = `${selectedCell.parentNode.rowIndex}-${selectedCell.cellIndex + j + 1}`;
    newCell.style.border = "1px solid black";
  }
};


  // Function to insert a URL link
  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      document.execCommand("createLink", false, url); // Insert link
    }
  };

  // Function to insert an image
  const insertImage = (imageUrl) => {
    document.execCommand("insertImage", false, imageUrl); // Insert image
  };

  // Function to handle image insertion based on user choice
  const handleImageInsertion = (option) => {
    if (option === "url") {
      const imageUrl = prompt("Enter Image URL:");
      if (imageUrl) {
        insertImage(imageUrl);
      }
    } else if (option === "local") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            insertImage(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    }
  };

  // Function to handle font selection
  const handleFontChange = (font) => {
    formatText("fontName", font);
  };

  const colorPalette = [
    [
      "#ffffff",
      "#E6E6FA",
      "#87CEEB",
      "#B0E0E6",
      "#AFEEEE",
      "#F5F5DC",
      "#FAFAD2",
      "#FFE4E1",
    ],
    [
      "#999999",
      "#AB82FF",
      "#4169E1",
      "#00BFFF",
      "#7FFFD4",
      "#9ACD32",
      "#FFA500",
      "#CD5C5C",
    ],
    [
      "#434343",
      "#9370DB",
      "#483D8B",
      "#6495ED",
      "#20B2AA",
      "#6B8E23",
      "#FF8C00",
      "#DC143C",
    ],
    [
      "#000000",
      "#8A2BE2",
      "#4B0082",
      "#0000CD",
      "#008B8B",
      "#556B2F",
      "#FFD700",
      "#FF0000",
    ],
  ];

  return (
    <>
      <div className="custom-editor w-full flex justify-content-center align-items-center flex-col relative bg-[#F3F3F3]">
        {/* Toolbar for formatting options */}
        <div
          className="absolute w-full top-0 left-0 toolbar flex border-none gap-1 bg-blue-50 p-2 align-items-center"
          style={{ justifyContent: "center" }}
        >
          {/* Font dropdown */}
          <div className="custom-dropdown">
            <select
              onChange={(e) => handleFontChange(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Font
              </option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              {/* Add more font options as needed */}
            </select>
          </div>

          {/* Line Height */}
          <div className="custom-dropdown">
            <select value={lineHeight} onChange={handleLineHeightChange}>
              <option value="1">Single</option>
              <option value="1.5">1.5</option>
              <option value="2">Double</option>
            </select>
          </div>
          {/* Font Size */}
          <input
            type="number"
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700 focus:outline-none w-16 border"
            onChange={handleFontSizeChange}
            value={fontSize}
            min={5}
          />

          {/* Text Filter Options */}
          <div className="custom-dropdown">
            <select
              onChange={(e) => applyTextFilter(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Aa
              </option>
              <option value="uppercase">AA</option>
              <option value="lowercase">aa</option>
              <option value="capitalize">Aa</option>
            </select>
          </div>

          {/* Bold, italic and underline button */}
          <button
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={() => formatText("bold")}
          >
            {icon.Boldicon}
          </button>
          <button
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={() => formatText("italic")}
          >
            {icon.Italicicon}
          </button>
          <button
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={() => formatText("underline")}
          >
            {icon.Underlineicon}
          </button>

          {/* Text color */}

          <button
            id="textcolorbtn"
            aria-controls="textcolor-menu"
            aria-haspopup="true"
            className="p-[1px] px-[10px] rounded-[4px] font-bold text-lg  bg-white hover:text-blue-700"
            onClick={(e) => handleClick(e, "textcolor")}
            style={{ borderBottom: `4px solid ${editorConfig.textcolor}` }}
          >
            {/* className="rounded-md " */}
            &nbsp;A&nbsp;
          </button>
          <Menu
            anchorEl={anchorEl.textcolor}
            open={Boolean(anchorEl.textcolor)}
            onClose={handleClose}
          >
            <Stack style={{ padding: "10px" }}>
              {colorPalette.map((row, rowIndex) => (
                <Stack direction="row" key={rowIndex}>
                  {row.map((color, colIndex) => (
                    <MenuItem
                      key={colIndex}
                      onClick={() => {
                        console.log(color);
                        formatText("foreColor", color);
                        updateEditorConfig("textcolor", color);
                        setTimeout(() => handleClose(), 100);
                      }}
                      classes="p-0 w-fit m-0"
                      style={{ padding: "4px" }}
                    >
                      <Box
                        component="div"
                        bgcolor={color}
                        style={{
                          height: "20px",
                          aspectRatio: "1/1",
                          cursor: "pointer",
                          border: "1px solid gray",
                        }}
                      />
                    </MenuItem>
                  ))}
                </Stack>
              ))}
            </Stack>
            <Divider />
            <MenuItem
              onClick={() => {
                console.log("click clicked");
              }}
            >
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    id="textcolor"
                    name="textcolor"
                    onChange={(e) => {
                      updateEditorConfig(e.target.name, e.target.value);
                      formatText("foreColor", e.target.value);
                    }}
                    onFocus={() => updateEditorConfig("temp", true)}
                    style={{
                      height: "30px",
                      width: "30px",
                      cursor: "pointer",
                      border: "none",
                      outline: "none",
                      padding: "0",
                    }}
                    value={editorConfig.textcolor || "black"}
                  />
                  <label htmlFor="textcolor" className="hover:text-blue-600">
                    Custom Color
                  </label>
                </div>
                {editorConfig.temp && (
                  <button
                    className="p-1 px-2 rounded-[4px] bg-blue-100 text-sm"
                    onClick={() => {
                      updateEditorConfig("temp", false);
                      setTimeout(() => handleClose(), 100);
                    }}
                  >
                    Done
                  </button>
                )}
              </div>
            </MenuItem>
          </Menu>
          {/* background color */}
          <button
            id="bgcolorbtn"
            aria-controls="bgcolor-menu"
            aria-haspopup="true"
            className="p-[1px] px-[10px] rounded-[4px] font-bold text-lg  bg-white hover:text-blue-700"
            onClick={(e) => handleClick(e, "bgcolor")}
            style={{ borderBottom: `4px solid ${editorConfig.bgcolor}` }}
          >
            {icon.PaintBoxicon}
          </button>
          <Menu
            anchorEl={anchorEl.bgcolor}
            open={Boolean(anchorEl.bgcolor)}
            onClose={handleClose}
          >
            <Stack style={{ padding: "10px" }}>
              {colorPalette.map((row, rowIndex) => (
                <Stack direction="row" key={rowIndex}>
                  {row.map((color, colIndex) => (
                    <MenuItem
                      key={colIndex}
                      onClick={() => {
                        console.log(color);
                        formatText("backColor", color);
                        updateEditorConfig("bgcolor", color);
                        setTimeout(() => handleClose(), 100);
                      }}
                      classes="p-0 w-fit m-0"
                      style={{ padding: "4px" }}
                    >
                      <Box
                        component="div"
                        bgcolor={color}
                        style={{
                          height: "20px",
                          aspectRatio: "1/1",
                          cursor: "pointer",
                          border: "1px solid gray",
                        }}
                      />
                    </MenuItem>
                  ))}
                </Stack>
              ))}
            </Stack>
            <Divider />
            <MenuItem
              onClick={() => {
                console.log("click clicked");
              }}
            >
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    id="bgcolor"
                    name="bgcolor"
                    onChange={(e) => {
                      updateEditorConfig(e.target.name, e.target.value);
                      formatText("backColor", e.target.value);
                    }}
                    onFocus={() => updateEditorConfig("temp", true)}
                    style={{
                      height: "30px",
                      width: "30px",
                      cursor: "pointer",
                      border: "none",
                      outline: "none",
                      padding: "0",
                    }}
                    value={editorConfig.bgcolor || "black"}
                  />
                  <label htmlFor="bgcolor" className="hover:text-blue-600">
                    Custom Color
                  </label>
                </div>
                {editorConfig.temp && (
                  <button
                    className="p-1 px-2 rounded-[4px] bg-blue-100 text-sm"
                    onClick={() => {
                      updateEditorConfig("temp", false);
                      setTimeout(() => handleClose(), 100);
                    }}
                  >
                    Done
                  </button>
                )}
              </div>
            </MenuItem>
          </Menu>

          {/* Alignment buttons */}
          <button
            aria-controls="alignment-menu"
            aria-haspopup="true"
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={(e) => handleClick(e, "alignment")}
          >
            {icon.LeftAlignicon}
          </button>
          <Menu
            id="alignment"
            anchorEl={anchorEl.alignment}
            keepMounted
            open={Boolean(anchorEl.alignment)}
            onClose={handleClose}
          >
            <MenuItem
              className="p-1"
              onClick={() => {
                formatText("justifyLeft");
                handleClose();
              }}
            >
              {icon.LeftAlignicon}
            </MenuItem>
            <MenuItem
              className="p-1"
              onClick={() => {
                formatText("justifyRight");
                handleClose();
              }}
            >
              {icon.RightAlignicon}
            </MenuItem>
            <MenuItem
              className="p-1"
              onClick={() => {
                formatText("justifyCenter");
                handleClose();
              }}
            >
              {icon.CenterAlignicon}
            </MenuItem>
            <MenuItem
              className="p-1"
              onClick={() => {
                formatText("justifyFull");
                handleClose();
              }}
            >
              {icon.JustifyAlignicon}
            </MenuItem>
          </Menu>

          {/* Subscript and Superscript buttons */}
          <button
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={() => formatText("subscript")}
          >
            {icon.SubScripticon}
          </button>
          <button onClick={() => formatText("superscript")}>Sup</button>
          {/* List buttons */}
          <button
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={() => formatText("insertUnorderedList")}
          >
            {icon.ULicon}
          </button>
          <button
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={() => formatText("insertOrderedList")}
          >
            {icon.OLicon}
          </button>
          {/* Insert Link and Image buttons */}
          <button
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={insertLink}
          >
            {icon.Linkicon}
          </button>

          {/* Insert Image dropdown */}
          <button
            aria-controls="image-menu"
            aria-haspopup="true"
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={(e) => handleClick(e, "image")}
          >
            {icon.Imageicon}
          </button>
          <Menu
            id="image"
            anchorEl={anchorEl.image}
            keepMounted
            open={Boolean(anchorEl.image)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              className="p-1"
              onClick={() => {
                handleImageInsertion("url");
                handleClose();
              }}
            >
              {icon.Urlicon}&nbsp;Use Online
            </MenuItem>
            <MenuItem
              className="p-1"
              onClick={() => {
                handleImageInsertion("local");
                handleClose();
              }}
            >
              {icon.Attachmenticon}&nbsp;Browse Offline
            </MenuItem>
          </Menu>
          {/* Table button */}
          <button
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={() => generateTable(4, 3)}
          >
            {icon.Tableicon}
          </button>
          {/* Table formatting */}
          <button
            aria-controls="tableformat-menu"
            aria-haspopup="true"
            className="p-[5px] px-[10px] rounded-[4px] bg-white hover:text-blue-700"
            onClick={(e) => handleClick(e, "tableformat")}
          >
            {icon.TableFormaticon}
          </button>
          <Menu
            id="tableformat"
            anchorEl={anchorEl.tableformat}
            keepMounted
            open={Boolean(anchorEl.tableformat)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              className="p-1"
              onClick={() => {
                insertRow();
                handleClose();
              }}
            >
              {icon.Urlicon}&nbsp;Insert Row
            </MenuItem>
            <MenuItem
              className="p-1"
              onClick={() => {
                insertColumn();
                handleClose();
              }}
            >
              {icon.Urlicon}&nbsp;Insert Column
            </MenuItem>
            <MenuItem
              className="p-1"
              onClick={() => {
                mergeCell();
                handleClose();
              }}
            >
              {icon.Urlicon}&nbsp;Merge
            </MenuItem>
            <MenuItem
              className="p-1"
              onClick={() => {
                splitCell();
                handleClose();
              }}
            >
              {icon.Urlicon}&nbsp;Split
            </MenuItem>
          </Menu>
        </div>
        {/* Content area for text editing */}
        <div className="space h-12"></div>
        <div
          className="pages w-full flex flex-col align-items-center"
          style={{ alignItems: "center" }}
        >
          <div
            className="content w-[8.5in] h-[11in] p-[1in] m-[1rem] bg-white border-none focus:outline-none"
            style={{ boxShadow: "0 0 5px 0 rgba(0, 0, 0, .5)" }}
            contentEditable={true}
            onInput={(e) => setContent(e.target.innerHTML)}
          ></div>
        </div>
        {/* Display editor content */}
        <div className="output">{content}</div>
      </div>
    </>
  );
}
