import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "./Editor.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
];

const CodeEditor = ({ data, setData }) => {
  return (
    <div className="editor-wrapper">
      <div className="editor-container">
        <ReactQuill
          bounds={".editor-input"}
          theme="bubble" // Set the theme to bubble
          value={data}
          onChange={setData} // Directly pass setData to handle changes
          className="editor-input"
          modules={modules}
          formats={formats}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
