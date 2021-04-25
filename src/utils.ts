import * as R from 'ramda';

import {CheckFunc, Report} from './types';

export const getMid = (a: number, b: number) => Math.floor(Math.abs(b + a) / 2);

export async function _bisect({
  badVal,
  goodVal,
  run,
  report,
}: {
  badVal: number;
  goodVal: number;
  run: CheckFunc;
  report: Report;
}): Promise<number> {
  // console.log(`bisect(good: ${goodVal}, bad: ${badVal})`)

  const mid = getMid(badVal, goodVal);

  if (mid === badVal || mid === goodVal) {
    console.log(report)
    return badVal;
  }

  const result = await run(mid);

  const [newGoodVal, newBadVal] = result ? [mid, badVal] : [goodVal, mid];

  return _bisect({
    badVal: newBadVal,
    goodVal: newGoodVal,
    run,
    report: addRecord({goodVal: newGoodVal, badVal: newBadVal}, report),
  });
}

function addRecord(
  {goodVal, badVal}: { goodVal: number; badVal: number },
  report: Report
): Report {
  // @ts-ignore
  return R.pipe(
    // @ts-ignore
    R.over(R.lensProp('totalRounds'), x => x + 1),
    // @ts-ignore
    R.over(R.lensProp('records'), R.append({goodVal, badVal}))
    // @ts-ignore
  )(report);
}
