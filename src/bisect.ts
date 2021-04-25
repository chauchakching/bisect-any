import * as R from 'ramda'

const getMid = (a: number, b: number) => Math.floor(Math.abs(b + a) / 2);

type CheckFunc = (k: number) => boolean

type Report = {
  totalRounds: number;
  records: Record[];
}
type Record = {
  goodVal: number;
  badVal: number;
}

export const bisect = async ({
  start,
  end,
  check,
}: // run,
{
  start: number;
  end: number;
  check: CheckFunc;
  // run: Function;
}): Promise<number> => {
  const v1 = await check(start);
  const v2 = await check(end);

  if (!v1 && !v2) {
    throw new Error(`Error: Both values (${v1}, ${v2}) are falsy in bisection`);
  }
  if (v1 && v2) {
    throw new Error(
      `Error: Both values (${v1}, ${v2}) are truthy in bisection`
    );
  }

  const newGoodVal = v1 ? start : end
  const newBadVal = v1 ? end : start
  const report: Report = {totalRounds: 0, records: []}

  return _bisect({
    badVal: newBadVal,
    goodVal: newGoodVal,
    check,
    report,
  })
};

async function _bisect({
  badVal,
  goodVal,
  check,
  report,
}: {
  badVal: number;
  goodVal: number;
  check: CheckFunc;
  report: Report;
}): Promise<number> {
  // console.log(`bisect(good: ${goodVal}, bad: ${badVal})`)

  const mid = getMid(badVal, goodVal);

  if (mid === badVal || mid === goodVal) {
    console.log(report)
    return badVal
  }

  const result = await check(mid);

  const [newGoodVal, newBadVal] = result ? [mid, badVal] : [goodVal, mid]

  return  _bisect({
    badVal: newBadVal,
    goodVal: newGoodVal,
    check,
    report: addRecord({goodVal: newGoodVal, badVal: newBadVal}, report),
  })
}

function addRecord({goodVal, badVal}: {goodVal: number; badVal: number}, report: Report): Report {
  // @ts-ignore
  return R.pipe(
  // @ts-ignore
    R.over(R.lensProp('totalRounds'), x => x + 1),
    // @ts-ignore
    R.over(R.lensProp('records'), R.append({goodVal, badVal})),
  // @ts-ignore
  )(report)
}
