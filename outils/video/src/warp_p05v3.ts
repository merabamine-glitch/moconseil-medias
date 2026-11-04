// Recalage de la v3 du Pack Conciergerie : temps de la voix v2 (align_p05.json) -> temps de la nouvelle voix.
// Identité tant que la nouvelle voix n'est pas livrée ; ensuite, une paire [mot v2, même mot nouvelle voix] par repère.
export const ANCHORS5: [number, number][] = [[0, 0], [30, 30]];
export const Wp5 = (x: number): number => {
  const A = ANCHORS5;
  if (x <= A[0][0]) return A[0][1] + (x - A[0][0]);
  for (let i = 1; i < A.length; i++) {
    if (x <= A[i][0]) {
      const [a0, b0] = A[i - 1];
      const [a1, b1] = A[i];
      return b0 + ((x - a0) * (b1 - b0)) / (a1 - a0);
    }
  }
  const [a, b] = A[A.length - 1];
  return b + (x - a);
};
