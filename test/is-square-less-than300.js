const check =  n => {
  return n ** 2 <= 300
}

const n = parseInt(process.argv.slice(2)[0])

if (!check(n)) {
  throw new Error(`The square of ${n} is larger than 300`)
}
