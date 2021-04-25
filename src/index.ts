import * as path from 'path';
import {Command, flags} from '@oclif/command';
import {bisect} from './bisect';

class BisectAny extends Command {
  // static description = `
  //   Run bisect to find the "bad" value on arbitrary function or command.

  //   Examples:

  //   Run an default export function from a js file with bisect values
  //   > bisect-any --file test/is-square-less-than300.js 1 100

  //   Run a CLI command with bisect values
  //   > bisect-any --command "node test/is-square-less-than300.js %" 1 100
  //   `;
  static description = 'abc'

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

    const result = await bisect({
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

    console.log('Found value:', result)

    return result
  }
}

export = BisectAny
