import * as path from 'path';
import {Command, flags} from '@oclif/command';
import cli from 'cli-ux'
import {bisect} from './bisect';

class BisectAny extends Command {
  static description = `
    Like git-bisect, but on arbitrary function or command to find the "bad" value.

    Examples:

    - Run a default export function from a js file with bisect values
      E.g. To find the first integer that it's square is larger than 300 (answer: 18)

        bisect-any --file test/is-square-less-than300.js 1 100

    - Run a CLI command with bisect values

        bisect-any --command "node test/is-square-less-than300.js %" 1 100
    `;

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),

    file: flags.string({
      description: 'Js file containing the function to bisect with',
      required: false,
    }),

    command: flags.string({
      description:
        'Custom command to bisect with. "%" will be replaced by the value to be tested.',
    }),
  };

  static args = [
    {name: 'start', description: 'integer', parse: parseInt, required: true},
    {name: 'end', description: 'integer',  parse: parseInt, required: true},
  ];

  async run() {
    const {args, flags} = this.parse(BisectAny);

    // console.log('args', args)
    // console.log('flags', flags)

    cli.action.start('Running bisect...')

    const [result, report] = await bisect({
      start: args.start,
      end: args.end,
      check: flags.file ?
        await (async () => {
          const configPath = path.join(__dirname, '..', flags.file!)
          return import(configPath);
        })() :
        undefined,
      commandToCheck: flags.command,
    });

    cli.action.stop(`\nFound value: ${result}`)
    console.log(report)

    return result
  }
}

// @ts-ignore
BisectAny.bisect = bisect

export = BisectAny
