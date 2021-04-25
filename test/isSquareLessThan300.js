const n = parseInt(process.argv.slice(2)[0])

const code = n ** 2 <= 300 ? 0 : 1

process.exit(code)
