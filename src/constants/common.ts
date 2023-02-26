export const ARROWS_MAP = {
	ArrowUp: '↑',
	ArrowDown: '↓',
	ArrowRight: '→',
	ArrowLeft: '←',
} as const;

export const arrowKeys = Object.keys(ARROWS_MAP);

export const TOTAL_LIVES = 3;

export type ArrowKeyboardKey = keyof typeof ARROWS_MAP;
