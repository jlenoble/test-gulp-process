import { rebaseGlob, resolveGlob } from "polypath";
import chalk from "chalk";
import { expectEventuallyDeleted } from "stat-again";
import { DestOptions, Fn } from "./options";

export const isDeleted = (_file: string): Fn => async ({
  dest,
  debug
}: DestOptions): Promise<boolean> => {
  const destGlob = rebaseGlob(_file, dest);
  const files: string[] = await resolveGlob(destGlob);

  if (!files.length) {
    const str = JSON.stringify(destGlob);

    if (debug) {
      console.info(
        `${chalk.cyan("Checking")} whether ${chalk.green(str)} is deleted`
      );
    }

    throw new Error(`${str} resolves to nothing`);
  }

  const found = await Promise.all(
    files.map(
      (file): Promise<boolean> => {
        if (debug) {
          console.info(
            `${chalk.cyan("Checking")} whether ${chalk.green(file)} is deleted`
          );
        }

        return expectEventuallyDeleted(file);
      }
    )
  );

  return found.every((f): boolean => f);
};
