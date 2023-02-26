import arrowReducer, {arrowTimedOut, pressArrow} from '../../store/arrowSlice';
import {renderWithProviders} from './testStore';
import App from '../../App';
import {act, screen} from '@testing-library/react';
import {ArrowKeyboardKey, ARROWS_MAP} from '../../constants/common';

describe('arrowSlice', () => {
	it('should return default state when passed an empty action', () => {
		const result = arrowReducer(undefined, {type: ''});

		expect(result).toEqual({
			currentArrow: 'ArrowUp',
			lives: 3,
			score: 0,
			lost: false,
			won: false,
		})
	});

	it('should increase count in slice and on screen if pressArrow same as currenArrow', async () => {
		const {store} = renderWithProviders(<App/>);
		const currentArrow = store?.getState().arrow.currentArrow;

		act(() => {
			store.dispatch(pressArrow(currentArrow));
		});

		const counter = await screen.findByText(/Score/)
		expect(store.getState().arrow.score).toEqual(1);
		expect(counter.textContent).toContain('1');
	});

	it('dispatching pressArrow not same as currenArrow should decrease lives in slice and on screen after', async () => {
		const {store} = renderWithProviders(<App/>);
		const currentArrow = store?.getState().arrow.currentArrow;
		const differentArrow = Object.keys(ARROWS_MAP).find(arrow => arrow !== currentArrow) as ArrowKeyboardKey;

		act(() => {
			store.dispatch(pressArrow(differentArrow));
		});

		expect(store.getState().arrow.lives).toEqual(2);
		const heartsOnScreen = await screen.findAllByText(/❤/);
		expect(heartsOnScreen).toHaveLength(2);
	});

	it('after not guessing arrow three times store should have "lost" equal to true', () => {
		const {store} = renderWithProviders(<App/>);

		act(() => {
			store?.dispatch(arrowTimedOut());

			const currentArrow = store?.getState().arrow.currentArrow;
			const wrongArrow = Object.keys(ARROWS_MAP).find(a => a !== currentArrow) as ArrowKeyboardKey;
			store?.dispatch(pressArrow(wrongArrow));

			store?.dispatch(arrowTimedOut());
		})

		expect(store?.getState().arrow.lost).toEqual(true);
	});

	it('after guessing arrow three times in a row store should have "won" equal to true', () => {
		const {store} = renderWithProviders(<App/>);

		act(() => {
			let currentArrow = store?.getState().arrow.currentArrow;
			store?.dispatch(pressArrow(currentArrow));

			currentArrow = store?.getState().arrow.currentArrow;
			store?.dispatch(pressArrow(currentArrow));

			currentArrow = store?.getState().arrow.currentArrow;
			store?.dispatch(pressArrow(currentArrow));
		});

		expect(store?.getState().arrow.won).toEqual(true);
	});
});
