import {bisect} from './bisect'

describe('bisect', () => {
  it('should find the smallest interger that the square is over 300', async () => {
    await expect(bisect({start: 1, end: 100, check: (val: number) => {
      return val ** 2 <= 300
    }})).resolves.toBe(18)
  })
})
