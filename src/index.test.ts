import BisectAny = require('.')

describe('bisect', () => {
  it('handle command', async () => {
    const result = await BisectAny.run(['--command', 'node test/is-square-less-than300.js %', '1', '100'])
    expect(result).toBe(18)
  })

  it('handle js file', async () => {
    const result = await BisectAny.run(['--file', 'test/isSquareLessThan300.js', '1', '100'])
    expect(result).toBe(18)
  })
})
