import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "./Editor.css";
import {
  initSpeechRecognition,
  startListening,
  stopListening,
  debouncedProcessTranscript,
} from "../../../voice/TexxtEditorVoiceControl/speechRecognition";

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
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const editorRef = useRef<ReactQuill>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const setupRecognition = () => {
      try {
        const speechRecognition = initSpeechRecognition(
          (transcript: string) => {
            debouncedProcessTranscript(
              transcript,
              setData,
              isCommandMode,
              setIsCommandMode,
              editorRef
            );
            if (isCommandMode) {
              setTranscript(transcript); 
            }
          }
        );

        recognitionRef.current = speechRecognition;
        startListening(speechRecognition);

        return () => {
          if (recognitionRef.current) {
            stopListening(recognitionRef.current);
          }
        };
      } catch (error) {
        console.error(
          "SpeechRecognition initialization error: ",
          error.message
        );
      }
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
        />
      </div>
      {isCommandMode && (
        <div className="transcript-display">
          <p>Transcript: {transcript}</p>
        </div>
      )}
      <div className="mode-indicator">
        {isCommandMode ? "Command Mode" : "Text Mode"}
      </div>
    </div>
  );
};

export default Editor;
