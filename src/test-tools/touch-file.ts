import { rebaseGlob, resolveGlob } from "polypath";
import touchMs from "touch-ms";
import chalk from "chalk";
import { DestOptions, Fn } from "./options";

export const touchFile = (_file: string): Fn => async ({
  dest,
  debug
}: DestOptions): Promise<boolean> => {
  const destGlob = rebaseGlob(_file, dest);
  const files: string[] = await resolveGlob(destGlob);

  if (!files.length) {
    const str = JSON.stringify(destGlob);

    if (debug) {
      console.info(
        `${chalk.cyan("Checking")} whether ${chalk.green(str)} can be found`
      );
    }

    throw new Error(`${str} resolves to nothing`);
  }

  const touched = await Promise.all(
    files.map(
      (file): Promise<boolean> => {
        if (debug) {
          console.info(`${chalk.cyan("Touching")} file ${chalk.green(file)}`);
        }

        return touchMs(file);
      }
    )
  );

  return touched.every((f): boolean => !!f);
};
