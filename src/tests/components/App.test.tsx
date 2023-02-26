import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import App from '../../App';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../redux/testStore';
import { pressArrow } from "../../store/arrowSlice";
import {ArrowKeyboardKey,  ARROWS_MAP} from '../../constants/common';
import * as redux from 'react-redux';
import * as reduxHooks from '../../hooks/redux';
import {initialState as inititalArrowState} from '../../store/arrowSlice';

// const mockedDispatch = jest.spyOn(reduxHooks, 'useAppDispatch');

describe('App', () => {
  it('should create App', () => {
   renderWithProviders(<App />);

    expect(screen).toMatchSnapshot();
  });

  it('should create hearts line', () => {
   renderWithProviders(<App />);

    expect(screen).toMatchSnapshot();
  });

  it('any arrow click dispatches pressArrow action', async () => {
    const { store } = renderWithProviders(<App />);

    // imitating any random arrow click
    const randomArrow = Object.keys(ARROWS_MAP)[Math.floor(Math.random() * 4)] as ArrowKeyboardKey;
    fireEvent.keyDown(window, { key: randomArrow })
    expect(store.dispatch).toHaveBeenCalledWith(pressArrow(randomArrow));
  });

  it('keyboard pressing current arrow increases score on the screen', async () => {
    const { store } = renderWithProviders(<App />);
    const currentArrow = store?.getState().arrow.currentArrow;

    fireEvent.keyDown(window, { key: currentArrow })
    const scoreElem = screen.getByText(/Score/);
    expect(scoreElem.textContent).toContain("1");
  });

  it('keyboard pressing wrong arrow decreases lives and score on the screen', async () => {
    const { store } = renderWithProviders(<App />);
    const currentArrow = store?.getState().arrow.currentArrow;

    const wrongArrow = Object.keys(ARROWS_MAP).find(key => key !== currentArrow);
    fireEvent.keyDown(window, { key: wrongArrow });

    const scoreElem = screen.getByText(/Score/);
    expect(scoreElem.textContent).toContain("0");

    const heartsOnScreen = await screen.findAllByText(/❤/);
		expect(heartsOnScreen).toHaveLength(2);
  });
});

