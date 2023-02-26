import React, {useEffect, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from './hooks/redux';
import {pressArrow, refreshArrow, restart} from './store/arrowSlice';
import styles from './styles/index.module.scss';
import {ArrowKeyboardKey, arrowKeys, ARROWS_MAP, TOTAL_LIVES} from './constants/common';
import {v4} from 'uuid';
import {selectArrowState} from './store/selectors';

function App() {
	const dispatch = useAppDispatch();
	const { currentArrow, lost, lives, score, won} = useAppSelector(selectArrowState);

	const hearts = useMemo(() => {
		const arr = [];
		for (let i = 1; i <= TOTAL_LIVES; i++) {
			if (i <= lives) {
				arr.push('❤');
			} else {
				arr.push(' ');
			}
		}
		return arr;
	}, [lives])

	const clickRestart = () => {
		dispatch(restart());
		dispatch(refreshArrow());
	}

	useEffect(() => {
		function keyboardHandler(e: KeyboardEvent) {
			if (arrowKeys.includes(e.key)) {
				dispatch(pressArrow(e.key as ArrowKeyboardKey));
				dispatch(refreshArrow());
			}
		}

		window.addEventListener('keydown', keyboardHandler);
		dispatch(refreshArrow());
		return () => window.removeEventListener('keydown', keyboardHandler)
	}, []);

	return (
		<div className={styles.wrapper}>
			<div>
				<p>Score: {score}</p>
			</div>
			<div className={styles.arrow}>{ARROWS_MAP[currentArrow]}</div>
			<div className={styles.hearts}>
				{hearts.map(heart => (<span className={styles.heart} key={v4()}>{heart}</span>))}
			</div>
			<div className={styles.result}>
				{won && <p>Congrats! You won 🏆</p>}
				{lost && <p>You lost 😣</p>}
				{(won || lost) && <button onClick={clickRestart}>Restart</button> }
			</div>
		</div>
	);
}

export default App;
