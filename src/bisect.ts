import * as shell from 'shelljs'
import {CheckFunc, Report} from './types';
import {_bisect} from './utils';

export const bisect = async ({
  start,
  end,
  check,
  commandToCheck,
}: {
  start: number;
  end: number;
  check?: CheckFunc;
  commandToCheck?: string;
}): Promise<[number, Report]> => {
  const run =
    check ||
    ((val: number) => {
      if (!commandToCheck!.includes('%')) {
        throw new Error('command string must contains "%" to substitute value')
      }
      const command = commandToCheck!.replace('%', String(val));
      const {code} = shell.exec(command, {silent: true})
      return code === 0
    });

  const v1 = await run(start);
  const v2 = await run(end);

  if (!v1 && !v2) {
    throw new Error(`Both values (${v1}, ${v2}) are falsy in bisection`);
  }
  if (v1 && v2) {
    throw new Error(
      `Both values (${v1}, ${v2}) are truthy in bisection`
    );
  }

  const goodVal = v1 ? start : end;
  const badVal = v1 ? end : start;
  const report: Report = {totalRounds: 1, records: [{goodVal, badVal}]};

  return _bisect({
    badVal,
    goodVal,
    run,
    report,
  });
};
