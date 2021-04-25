import {pipe} from 'fp-ts/function'

import {CheckFunc, Report} from './types';
import {Lens} from 'monocle-ts';
import {append} from 'fp-ts/lib/Array';

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
}): Promise<[number, Report]> {
  // console.log(`bisect(good: ${goodVal}, bad: ${badVal})`)

  const mid = getMid(badVal, goodVal);

  if (mid === badVal || mid === goodVal) {
    return [badVal, report];
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
  return pipe(
    report,
    Lens.fromProp<Report>()('totalRounds').modify(x => x + 1),
    Lens.fromProp<Report>()('records').modify(append({goodVal, badVal})),
  );
}
