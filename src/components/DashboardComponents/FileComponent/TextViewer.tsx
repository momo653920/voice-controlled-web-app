import React from "react";

interface TextViewerProps {
  content: string;
}

const TextViewer: React.FC<TextViewerProps> = ({ content }) => (
  <div className="text-viewer">
    <pre>{content}</pre>
  </div>
);

export default TextViewer;
