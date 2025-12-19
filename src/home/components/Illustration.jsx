import React from "react";

export default function Illustration({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "auto",
        display: "block",
      }}
    />
  );
}