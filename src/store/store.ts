import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import arrowSlice from './arrowSlice';

const saga = createSagaMiddleware();

const store = configureStore({
	reducer: {
		arrow: arrowSlice
	},
	middleware: [saga]
});
saga.run(rootSaga);

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
