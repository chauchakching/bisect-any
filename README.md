# bisect-any

[![Build](https://github.com/chauchakching/bisect-any/actions/workflows/build.yml/badge.svg)](https://github.com/chauchakching/bisect-any/actions/workflows/build.yml) [![Version](https://img.shields.io/npm/v/bisect-any.svg)](https://www.npmjs.com/package/bisect-any) 


Like git-bisect, but on arbitrary function or command to find the "bad" value.

## Usage

```bash
# install globally
npm install -g bisect-any

# help
bisect-any --help

```

## Examples - CLI

### JS function

Run a default export function from a js file with bisect values

E.g. To find the first integer that it's square is larger than 300 (answer: 18)

Example js function [test/isSquareLessThan300.js](./test/isSquareLessThan300.js)

```bash
bisect-any --file test/is-square-less-than300.js 1 100

# Running bisect...... 
# Found value: 18
# {
#   totalRounds: 8,
#   records: [
#     { goodVal: 1, badVal: 100 },
#     { goodVal: 1, badVal: 50 },
#     { goodVal: 1, badVal: 25 },
#     { goodVal: 13, badVal: 25 },
#     { goodVal: 13, badVal: 19 },
#     { goodVal: 16, badVal: 19 },
#     { goodVal: 17, badVal: 19 },
#     { goodVal: 17, badVal: 18 }
#   ]
# }
```

### CLI command

Run a CLI command with bisect values. If the command exit with non-zero code, it's considered a bad value.

Use `%` as placeholder of bisect value in command string.

Example js program [test/is-square-less-than300.js](./test/is-square-less-than300.js)

```bash
bisect-any --command "node test/is-square-less-than300.js %" 1 100
```

## Examples - library

```js
const { bisect } = require('bisect-any')

(async () => {
  const [result, report] = await bisect({
    start: 1,
    end: 100,
    check: (val) => {
      return val ** 2 <= 300;
    },
  })
})()
/**
 * result === 18
 * 
 * report == {
 *   totalRounds: 8,
 *   records: [
 *     { goodVal: 1, badVal: 100 },
 *     { goodVal: 1, badVal: 50 },
 *     { goodVal: 1, badVal: 25 },
 *     { goodVal: 13, badVal: 25 },
 *     { goodVal: 13, badVal: 19 },
 *     { goodVal: 16, badVal: 19 },
 *     { goodVal: 17, badVal: 19 },
 *     { goodVal: 17, badVal: 18 }
 *   ]
 * }
```