import { delay, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {arrowTimedOut, refreshArrow} from '../store/arrowSlice';


export function* refreshWorker() {
	const { won, lost } = yield select(state => state.arrow);
	yield delay(3000);
	if (!won && !lost) {
		yield put(arrowTimedOut());
		yield put(refreshArrow());
	}
}

export function* restartWorker() {
	yield put(refreshArrow());
}

export function* watchRefreshArrow() {
	yield takeLatest('arrow/refreshArrow', refreshWorker);
}

export function* watchRestart() {
	console.log('restarted')
	yield takeEvery('arrow/restart', restartWorker);
}

export default function* index() {
	yield watchRefreshArrow();
	yield watchRestart();
}
