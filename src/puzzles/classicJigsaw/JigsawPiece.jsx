import { Group, Path, Image as KonvaImage } from "react-konva";
import { useEffect, useRef } from "react";

export default function JigsawPiece({ piece, image, onSnap, scale = 1, boardSize = 500 }) {
  const imageRef = useRef(null);
  const groupRef = useRef(null);
  
  useEffect(() => {
    if (imageRef.current && image) {
      // Check if image is already a native Image object or if it's a URL string
      if (typeof image === 'string') {
        const img = new window.Image();
        img.onload = () => {
          imageRef.current.image(img);
        };
        img.src = image;
      } else if (image instanceof window.Image) {
        // Already a native Image object
        imageRef.current.image(image);
      }
    }
  }, [image]);
  
  if (!piece || !image) return null;
  
  return (
    <Group
      ref={groupRef}
      x={piece.x}
      y={piece.y}
      draggable={!piece.locked}
      onDragEnd={(e) => {
        const pos = e.target.position();
        onSnap(piece.id, pos.x, pos.y);
      }}
    >
      {/* Background grid pattern to show piece area */}
      <Path
        data={piece.path}
        fill="rgba(240, 240, 240, 0.5)"
        stroke="#ccc"
        strokeWidth={1.5}
        scaleX={scale}
        scaleY={scale}
      />
      
      {/* Image clipped to piece - positioned at correct offset */}
      <KonvaImage
        ref={imageRef}
        x={-piece.correctX}
        y={-piece.correctY}
        width={boardSize}
        height={boardSize}
        scaleX={scale}
        scaleY={scale}
        opacity={0.8}
      />
      
      {/* Outline on top to show piece shape */}
      <Path
        data={piece.path}
        fill="rgba(0, 0, 0, 0)"
        stroke="#333"
        strokeWidth={2}
        scaleX={scale}
        scaleY={scale}
      />
    </Group>
  );
}
