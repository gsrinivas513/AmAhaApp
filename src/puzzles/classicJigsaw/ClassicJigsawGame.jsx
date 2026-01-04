import { useEffect, useState } from "react";
import JigsawStage from "./JigsawStage";
import { generateJigsawPieces } from "./generateJigsawPieces";
import { useJigsawEngine } from "./useJigsawEngine";

export default function ClassicJigsawGame({ imageUrl, rows = 4, cols = 3 }) {
  const [image, setImage] = useState(null);
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
      setPieces(generateJigsawPieces(img, rows, cols));
    };
  }, [imageUrl, rows, cols]);

  // Call hook unconditionally
  const engine = useJigsawEngine(pieces);

  // Check loading state
  if (!image || pieces.length === 0) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading puzzle...</div>;
  }

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <JigsawStage
        pieces={engine.pieces}
        image={image}
        onSnap={engine.trySnap}
      />

      <div style={{ width: 220 }}>
        <h3>Progress</h3>
        <p>{engine.progress}%</p>
        <p>Moves: {engine.moves}</p>
        <p>
          Pieces: {engine.placed}/{engine.total}
        </p>
        <p>Time: {engine.time}s</p>
      </div>
    </div>
  );
}
