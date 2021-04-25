import {bisect} from './bisect';

describe('bisect', () => {
  it('should find the smallest interger that the square is over 300', async () => {
    const [result] = await bisect({
      start: 1,
      end: 100,
      check: (val: number) => {
        return val ** 2 <= 300;
      },
    })

    expect(result).toBe(18);
  });

  it('handle command', async () => {
    const [result] = await bisect({
      start: 1,
      end: 100,
      commandToCheck: 'node test/is-square-less-than300.js %',
    })

    expect(result).toBe(18);
  });
});
