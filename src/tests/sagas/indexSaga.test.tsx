import {arrowTimedOut, pressArrow, refreshArrow} from '../../store/arrowSlice';
import {renderWithProviders} from '../redux/testStore';
import App from '../../App';
import {refreshWorker, restartWorker} from '../../sagas';
import {delay, put, select} from 'redux-saga/effects';
import {selectArrowState} from '../../store/selectors';

describe('restartWorker', () => {
	it('when app restarted new arrow should be generated', () => {
		const g = restartWorker();

		expect(g.next().value).toEqual(put(refreshArrow()));
	});
});

describe('refreshWorker', () => {
	it('should dispatch arrowTimedOut and refreshArrow actions', () => {
		const {store} = renderWithProviders(<App />);
		const g = refreshWorker();

		let next = g.next();
		expect(next.value).toEqual(select(selectArrowState));

		next = g.next(store?.getState().arrow);
		expect(next.value).toEqual(delay(3000));

		next = g.next();
		expect(next.value).toEqual(put(arrowTimedOut()));

		next = g.next();
		expect(next.value).toEqual(put(refreshArrow()));
	});

	it('shouldn not do anything if we lost all lifes', () => {
		const {store} = renderWithProviders(<App />);

		store?.dispatch(arrowTimedOut());
		store?.dispatch(arrowTimedOut());
		store?.dispatch(arrowTimedOut());

		const g = refreshWorker();

		let next = g.next();
		expect(next.value).toEqual(select(selectArrowState));

		next = g.next(store?.getState().arrow);
		expect(next.value).toEqual(delay(3000));

		next = g.next();
		expect(next.value).toEqual(undefined);
		expect(next.done).toEqual(true);
	});

	it('should not do anything if we have won already', () => {
		const {store} = renderWithProviders(<App />);

		let currentArrow = store?.getState().arrow.currentArrow;
		store?.dispatch(pressArrow(currentArrow));
		currentArrow = store?.getState().arrow.currentArrow;
		store?.dispatch(pressArrow(currentArrow));
		currentArrow = store?.getState().arrow.currentArrow;
		store?.dispatch(pressArrow(currentArrow));

		const g = refreshWorker();

		let next = g.next();
		expect(next.value).toEqual(select(selectArrowState));

		next = g.next(store?.getState().arrow);
		expect(next.value).toEqual(delay(3000));

		next = g.next();
		expect(next.value).toEqual(undefined);
		expect(next.done).toEqual(true);
	});
});




