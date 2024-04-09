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

  // Function to generate a table with 2px cell margin
  const generateTable = (m = 3, n = 4) => {
    let tableHtml = '<table style="border-collapse: collapse; width: 100%;">';
    for (let i = 0; i < m; i++) {
      tableHtml += "<tr>";
      for (let j = 0; j < n; j++) {
        tableHtml += `<td style="border: 1px solid black; padding: 2px 4px;">${
          i + 1
        }-${j + 1}</td>`;
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</table>";
    document.execCommand("insertHTML", false, tableHtml);
  };

  // Function to get the index of the selected cell
  const getSelectedCellIndex = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    let node = range.startContainer;
    while (node) {
      if (node.nodeName === "TD") {
        const rowIndex = node.parentNode.rowIndex;
        const cellIndex = node.cellIndex;
        return { rowIndex, cellIndex };
      }
      node = node.parentNode;
    }
    return null;
  };

  // Function to handle cell operations
  const handleCellOperation = () => {
    const selectedCell = getSelectedCellIndex();
    if (selectedCell) {
      const { rowIndex, cellIndex } = selectedCell;
      console.log("Selected Row Index:", rowIndex);
      console.log("Selected Cell Index:", cellIndex);
      console.log(selectedCell);
      return selectedCell;
    } else {
      console.log("No cell selected.");
      return null;
    }
  };

  // Function to insert a row at a specific index
  const insertRow = (pos = 1) => {
    const selectedCell = handleCellOperation();
    const table = document.querySelector("table");
    if (!table || selectedCell === null) return;

    const newRow = table.insertRow(selectedCell.rowIndex + pos);
    const columns = table.rows[0].cells.length;

    for (let i = 0; i < columns; i++) {
      const cell = newRow.insertCell(i);
      cell.style.border = "1px solid black";
      cell.style.padding = "2px 4px";
      cell.textContent = `${selectedCell.rowIndex + 1 + pos}-${i + 1}`;
    }
  };

  // Function to insert a column at a specific index
  const insertColumn = (pos = 1) => {
    const selectedCell = handleCellOperation();
    const table = document.querySelector("table");
    if (!table || selectedCell === null) return;

    const rows = table.rows.length;
    for (let i = 0; i < rows; i++) {
      const newRowCell = table.rows[i].insertCell(selectedCell.rowIndex + pos);
      newRowCell.style.border = "1px solid black";
      newRowCell.style.padding = "2px 4px";
      newRowCell.textContent = `${i + 1}-${selectedCell.cellIndex + 1 + pos}`;
    }
  };

  // merge the cells
  const mergeCell = () => {
    try {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const table = range.commonAncestorContainer.closest("table");
      if (!table) return;

      const startCell = range.startContainer.parentElement.closest("td");
      const endCell = range.endContainer.parentElement.closest("td");
      if (!startCell || !endCell) return;

      const startRowIndex = startCell.parentNode.rowIndex;
      const startCellIndex = startCell.cellIndex;
      const endRowIndex = endCell.parentNode.rowIndex;
      const endCellIndex = endCell.cellIndex;

      // Concatenate content of all cells into the first cell with space
      let mergedContent = "";
      for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
        for (
          let cellIndex = startCellIndex;
          cellIndex <= endCellIndex;
          cellIndex++
        ) {
          const cell = table.rows[rowIndex].cells[cellIndex];
          if (rowIndex === startRowIndex && cellIndex === startCellIndex)
            continue;
          mergedContent += " " + cell.textContent; // Add cell content with space
          cell.remove(); // Remove merged cell
        }
      }

      startCell.textContent += mergedContent.trim(); // Append merged content to the first cell

      // Set rowSpan and colSpan for the first cell
      startCell.rowSpan = endRowIndex - startRowIndex + 1;
      startCell.colSpan = endCellIndex - startCellIndex + 1;
    } catch (error) {
      console.error("Error while merging cells:", error);
    }
  };

  // split cell
  const splitCell = () => {
    try {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const table = range.commonAncestorContainer.closest("table");
      if (!table) return;

      const cell = range.startContainer.parentElement.closest("td");
      if (!cell || (cell.rowSpan === 1 && cell.colSpan === 1)) return;

      const startRowIndex = cell.parentNode.rowIndex;
      const startCellIndex = cell.cellIndex;
      const endRowIndex = startRowIndex + cell.rowSpan - 1;
      const endCellIndex = startCellIndex + cell.colSpan - 1;

      // Remove rowSpan and colSpan from the original cell
      cell.rowSpan = 1;
      cell.colSpan = 1;

      // Adjust the colspan of cells in the same row after the split
      for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
        const newRow = table.rows[rowIndex];
        for (
          let cellIndex = startCellIndex + 1;
          cellIndex <= endCellIndex;
          cellIndex++
        ) {
          const newCell = document.createElement("td");
          newCell.textContent = "";
          newRow.insertBefore(newCell, newRow.cells[cellIndex]);
        }
      }
    } catch (error) {
      console.error("Error while splitting cell:", error);
    }
  };

  // Function to delete selected row
  function deleteRow() {
    const selectedCell = handleCellOperation();
    if (!selectedCell) return;

    const table = document.querySelector("table");
    if (!table) return;

    table.deleteRow(selectedCell.rowIndex);
  }

  // Function to delete selected column
  const deleteColumn = () => {
    const selectedCell = handleCellOperation();
    if (!selectedCell) return;

    const table = document.querySelector("table");
    if (!table) return;

    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
      rows[i].deleteCell(selectedCell.cellIndex);
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
                deleteRow();
                handleClose();
              }}
            >
              {icon.Urlicon}&nbsp;Delete Row
            </MenuItem>
            <MenuItem
              className="p-1"
              onClick={() => {
                deleteColumn();
                handleClose();
              }}
            >
              {icon.Urlicon}&nbsp;Delete Column
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
