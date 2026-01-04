import { Stage, Layer, Group } from "react-konva";
import JigsawPiece from "./JigsawPiece";

const BOARD_X = 20;
const BOARD_Y = 20;
const BOARD_SIZE = 500;
const PIECE_SIZE_BOARD = 100; // For pieces on board
const PIECE_SIZE_TRAY = 70; // For pieces in tray
const PIECE_GAP = 8;

export default function JigsawStage({ pieces, image, onSnap }) {
  if (!pieces || pieces.length === 0 || !image) return null;
  
  const cols = Math.ceil(Math.sqrt(pieces.length));
  const pieceSize = BOARD_SIZE / cols;

  // Pieces in tray (unlocked)
  const trayPieces = pieces.filter(p => !p.locked);
  
  // Pieces on board (locked)
  const boardPieces = pieces.filter(p => p.locked);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Board Stage */}
      <div style={{ position: 'absolute', top: BOARD_Y, left: BOARD_X }}>
        <Stage width={BOARD_SIZE} height={BOARD_SIZE}>
          <Layer>
            {boardPieces.map(p => (
              <JigsawPiece
                key={p.id}
                piece={p}
                image={image}
                onSnap={onSnap}
                scale={1}
                boardSize={BOARD_SIZE}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Tray Stage - show pieces in horizontal layout */}
      <div style={{
        position: 'absolute',
        top: BOARD_Y + BOARD_SIZE + 30,
        left: 50,
        right: 50,
        height: 180,
        background: '#f0f0f0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        padding: '10px',
        gap: '8px',
      }}>
        {trayPieces.map((piece, idx) => {
          const scale = PIECE_SIZE_TRAY / pieceSize;
          return (
            <div
              key={piece.id}
              style={{
                minWidth: `${PIECE_SIZE_TRAY + 20}px`,
                height: `${PIECE_SIZE_TRAY + 20}px`,
                background: '#fff',
                border: '2px solid #999',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <Stage width={PIECE_SIZE_TRAY + 20} height={PIECE_SIZE_TRAY + 20}>
                <Layer>
                  <JigsawPiece
                    piece={{
                      ...piece,
                      x: (PIECE_SIZE_TRAY + 20) / 2,
                      y: (PIECE_SIZE_TRAY + 20) / 2,
                    }}
                    image={image}
                    onSnap={onSnap}
                    scale={scale}
                    boardSize={BOARD_SIZE}
                  />
                </Layer>
              </Stage>
            </div>
          );
        })}
      </div>
    </div>
  );
}
