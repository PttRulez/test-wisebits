import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ArrowKeyboardKey, ARROWS_MAP } from '../constants/common';
import {TOTAL_LIVES} from '../constants/common';

export interface ArrowState {
	currentArrow: ArrowKeyboardKey;
	lives: number;
	score: number;
	lost: boolean;
	won: boolean;
}

export const initialState: ArrowState = {
	currentArrow: 'ArrowUp',
	lives: 3,
	score: 0,
	lost: false,
	won: false,
}

const loseLife = (state: ArrowState) => {
	state.lives = state.lives - 1;
	state.score = 0;
	if (state.lives <= 0) {
		state.lost = true;
	}
}

const generateNewArrow = (): ArrowKeyboardKey => {
	return Object.keys(ARROWS_MAP)[Math.floor(Math.random() * 4)] as ArrowKeyboardKey;
}

const arrowSlice = createSlice({
	name: 'arrow',
	initialState,
	reducers: {
		arrowTimedOut: (state) => {
			loseLife(state);
		},
		refreshArrow: (state) => {
			if (!state.won && !state.lost) {
				state.currentArrow = generateNewArrow();
			}
		},
		pressArrow: (state, {payload: pressedArrow}: PayloadAction<ArrowKeyboardKey>) => {
			if (pressedArrow === state.currentArrow) {
				state.score = state.score + 1;
				if (state.score >= 3) {
					state.won = true;
				}
			} else {
				loseLife(state);
			}
		},
		restart: (state) => {
			state.won = false;
			state.lost = false;
			state.score = 0;
			state.lives = TOTAL_LIVES;

		}
	}
})

export const {arrowTimedOut, pressArrow, refreshArrow, restart} = arrowSlice.actions;

export default arrowSlice.reducer;
