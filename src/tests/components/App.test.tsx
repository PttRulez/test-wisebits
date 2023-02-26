import React from 'react';
import {act, fireEvent, screen} from '@testing-library/react';
import App from '../../App';
import {renderWithProviders} from '../redux/testStore';
import {arrowTimedOut, pressArrow} from '../../store/arrowSlice';
import {ArrowKeyboardKey, ARROWS_MAP} from '../../constants/common';
import userEvent from '@testing-library/user-event';

describe('App', () => {
	it('should create App', () => {
		renderWithProviders(<App/>);

		expect(screen).toMatchSnapshot();
	});

	it('should create line of 3 hearts and show score equal to 0', async () => {
		renderWithProviders(<App/>);

		const heartsOnScreen = await screen.findAllByText(/❤/);
		expect(heartsOnScreen).toHaveLength(3);

		const scoreElem = screen.getByText(/Score/);
		expect(scoreElem.textContent).toContain('0');
	});

	it('any arrow click dispatches pressArrow action', async () => {
		const {store} = renderWithProviders(<App/>);

		const randomArrow = Object.keys(ARROWS_MAP)[Math.floor(Math.random() * 4)] as ArrowKeyboardKey;
		fireEvent.keyDown(window, {key: randomArrow})
		expect(store.dispatch).toHaveBeenCalledWith(pressArrow(randomArrow));
	});

	it('keyboard pressing current arrow increases score on the screen', async () => {
		const {store} = renderWithProviders(<App/>);
		const currentArrow = store?.getState().arrow.currentArrow;

		fireEvent.keyDown(window, {key: currentArrow})
		const scoreElem = screen.getByText(/Score/);
		expect(scoreElem.textContent).toContain('1');
	});

	it('keyboard pressing wrong arrow decreases lives and score resets to 0 on the screen', async () => {
		const {store} = renderWithProviders(<App/>);
		let currentArrow = store?.getState().arrow.currentArrow;
		fireEvent.keyDown(window, {key: currentArrow});
		const scoreElem = screen.getByText(/Score/);
		expect(scoreElem.textContent).toContain('1');

		currentArrow = store?.getState().arrow.currentArrow;
		const wrongArrow = Object.keys(ARROWS_MAP).find(key => key !== currentArrow);
		fireEvent.keyDown(window, {key: wrongArrow});

		expect(scoreElem.textContent).toContain('0');

		const heartsOnScreen = await screen.findAllByText(/❤/);
		expect(heartsOnScreen).toHaveLength(2);
	});

	it('after not pressing correct arrow three times ui should have "lost" message', () => {
		const {store} = renderWithProviders(<App/>);

		act(() => {
			store?.dispatch(arrowTimedOut());

			const currentArrow = store?.getState().arrow.currentArrow;
			const wrongArrow = Object.keys(ARROWS_MAP).find(a => a !== currentArrow) as ArrowKeyboardKey;
			store?.dispatch(pressArrow(wrongArrow));

			store?.dispatch(arrowTimedOut());
		})

		const elem = screen.getByText(/You lost 😣/)
		expect(elem).toBeInTheDocument();
	});

	it('after pressing arrow three times in a row ui should have "won" message', () => {
		const {store} = renderWithProviders(<App/>);

		act(() => {
			let currentArrow = store?.getState().arrow.currentArrow;
			store?.dispatch(pressArrow(currentArrow));

			currentArrow = store?.getState().arrow.currentArrow;
			store?.dispatch(pressArrow(currentArrow));

			currentArrow = store?.getState().arrow.currentArrow;
			store?.dispatch(pressArrow(currentArrow));
		})

		const elem = screen.getByText(/Congrats! You won 🏆/)
		expect(elem).toBeInTheDocument();
	});

	it('after restart you get new hearts line and score 0', async () => {
		const {store} = renderWithProviders(<App/>);

		act(() => {
			store?.dispatch(arrowTimedOut());
			store?.dispatch(arrowTimedOut());
			store?.dispatch(arrowTimedOut());
		});

		let heartsOnScreen = screen.queryAllByText(/❤/);
		expect(heartsOnScreen).toHaveLength(0);

		const restartButton = await screen.findByText(/Restart/)
		expect(restartButton).toBeInTheDocument();
		fireEvent.click(restartButton)

		heartsOnScreen = screen.queryAllByText(/❤/);
		expect(heartsOnScreen).toHaveLength(3);
	});
});

