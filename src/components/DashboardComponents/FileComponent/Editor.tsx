import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "./Editor.css";
import {
  initSpeechRecognition,
  startListening,
  stopListening,
  debouncedProcessTranscript,
} from "../../../voice/Editor/speechRecognition";
import SpeechBubble from "../../SpeechBubbleComponent/speechBubble";

const modules = {
  toolbar: [
    [{ header: [1, 2] }],
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
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const editorRef = useRef<ReactQuill>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const setupRecognition = () => {
      const speechRecognition = initSpeechRecognition((transcript: string) => {
        debouncedProcessTranscript(
          transcript,
          setData,
          isCommandMode,
          setIsCommandMode,
          editorRef
        );
        setTranscript(transcript);
      });

      recognitionRef.current = speechRecognition;
      startListening(speechRecognition);

      return () => {
        if (recognitionRef.current) {
          stopListening(recognitionRef.current);
        }
      };
    };

    setupRecognition();

    return () => {
      if (recognitionRef.current) {
        stopListening(recognitionRef.current);
      }
    };
  }, [isCommandMode, setData]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  return (
    <div
      className={`editor-wrapper ${isCommandMode ? "command-mode" : "text-mode"}`}
    >
      <div className="editor-container">
        <ReactQuill
          ref={editorRef}
          theme="bubble"
          value={data}
          onChange={setData}
          className="editor"
          modules={modules}
          formats={formats}
          style={{ fontSize: "24px", lineHeight: "1.6" }} // Apply font size and line height inline
        />
      </div>
      <div className="mode-indicator">
        {isCommandMode ? "Command Mode" : "Text Mode"}
      </div>
      <SpeechBubble text={transcript} />
    </div>
  );
};

export default Editor;
