import {selectArrowState} from '../../store/selectors';
import {ArrowState} from '../../store/arrowSlice';

describe('redux selectors', () => {
  it('should select arrowState properly', () => {
    const arrowState: ArrowState = {
      currentArrow: 'ArrowUp',
      lives: 3,
      score: 0,
      lost: false,
      won: false,
    }

    const result = selectArrowState({ arrow: arrowState });

    expect(result).toEqual(arrowState);
  })
})
