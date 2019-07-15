import { resolveGlob, rebaseGlob } from "polypath";
import chalk from "chalk";
import { expectEventuallyFound } from "stat-again";
import { DestOptions, Fn } from "./options";

export const isFound = (_file: string): Fn => async ({
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

  const found = await Promise.all(
    files.map(
      (file): Promise<boolean> => {
        if (debug) {
          console.info(
            `${chalk.cyan("Checking")} whether ${chalk.green(
              file
            )} can be found`
          );
        }

        return expectEventuallyFound(file);
      }
    )
  );

  return found.every((f): boolean => f);
};
