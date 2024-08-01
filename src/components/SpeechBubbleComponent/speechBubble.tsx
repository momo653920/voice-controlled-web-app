import React from "react";
import "./SpeechBubble.css";

interface SpeechBubbleProps {
  text: string;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text }) => {
  return (
    <div
      className="speech-bubble"
      style={{
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <p className="text-bubble">{text}</p>
    </div>
  );
};

export default SpeechBubble;
