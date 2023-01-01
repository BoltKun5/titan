import { readdirSync } from 'fs-extra';
import { extname, resolve } from 'path';

export const requireModules = (name: string): any[] =>
  readdirSync(resolve(`${name}`))
    .filter((f) => ['.js', '.ts'].includes(extname(f)) && !/\.d\.ts/.exec(f))
    .map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const a = require(resolve(`${name}/${f}`));
      if (Object.entries(a).length) {
        return Object.entries(a)[0][1] as any;
      }
      return null;
    })
    .filter((e) => e !== null)
    .filter((e) => e);

export const importModules = (name: string): string[] =>
  readdirSync(resolve(`${name}`))
    .filter((f) => extname(f) === '.js')
    .map((f) => resolve(`${name}/${f}`))
    .filter((e) => e !== null);

export const extensionFileToImport = () => {
  return process.env.NODE_ENV === 'DEVELOPMENT' ? '.ts' : '.js';
};
