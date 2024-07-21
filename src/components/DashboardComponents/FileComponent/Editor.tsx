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

const Editor: React.FC<{ data: string; setData: (data: string) => void }> = ({
  data,
  setData,
}) => {
  return (
    <div className="editor-wrapper">
      <div className="editor-container">
        <ReactQuill
          theme="bubble"
          value={data}
          onChange={setData}
          className="editor-input"
          modules={modules}
          formats={formats}
        />
      </div>
    </div>
  );
};

export default Editor;
