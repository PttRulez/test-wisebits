import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import type { AppStore, RootState } from '../../store/store'
import arrowSlice, {initialState} from '../../store/arrowSlice';
import createSagaMiddleware from 'redux-saga';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}
const saga = createSagaMiddleware();

const rootReducer = combineReducers({
  arrow: arrowSlice
})

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [saga],
    preloadedState
  });

  // мокаем dispatch, чтобы потом использовать в тестах, при этом он не теряет свой функционал
  const origDispatch = store.dispatch;
  store.dispatch = jest.fn(origDispatch)

  return store;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    // preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore({ arrow: initialState }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
