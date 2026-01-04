export const SNAP_DISTANCE = 18;

export function shouldSnap(x, y, tx, ty) {
  return (
    Math.abs(x - tx) < SNAP_DISTANCE &&
    Math.abs(y - ty) < SNAP_DISTANCE
  );
}
