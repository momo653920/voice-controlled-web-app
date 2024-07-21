import React from "react";

interface ImageViewerProps {
  src: string;
  alt?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt = "Image" }) => (
  <div className="image-viewer">
    <img src={src} alt={alt} style={{ maxWidth: "100%", maxHeight: "100%" }} />
  </div>
);

export default ImageViewer;
