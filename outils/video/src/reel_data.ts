// généré par heygen/reel/prep_reel.py — ne pas modifier à la main
export const REEL_SP = 1.1;
export const REEL_VOIX = 23.745;
export const REEL_CUM: [number, number, number][] = [[0.08, 1.36, 0.0], [1.8800000000000001, 4.24, 1.28], [4.6000000000000005, 9.44, 3.64], [9.76, 12.120000000000001, 8.48], [12.24, 14.200000000000001, 10.84], [14.44, 16.6, 12.8], [16.88, 19.04, 14.96], [19.240000000000002, 23.12, 17.12], [23.400000000000002, 24.400000000000002, 21.0], [24.68, 25.72, 22.0], [25.96, 27.080000000000002, 23.04], [27.28, 29.240000000000002, 24.16]];
export const RT = (x: number): number => { for (const [a, b, c] of REEL_CUM) if (x <= b + 0.01) return (c + Math.max(0, x - a)) / REEL_SP; return REEL_VOIX; };
