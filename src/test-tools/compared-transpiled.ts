import { rebaseGlob } from "polypath";
import chalk from "chalk";
import path from "path";
import equalFileContents from "equal-file-contents";
import babel from "gulp-babel";
import { DestFn, DestOptions } from "./options";

export const compareTranspiled = (
  _glob: string | string[],
  _dest: string
): DestFn => (options: DestOptions): Promise<boolean> => {
  const dest = path.join(options.dest, _dest);
  const glob = rebaseGlob(_glob, options.dest).map((glb: string): string => {
    return glb.replace(/\.\w+$/, ".js");
  });

  if (options && options.debug) {
    console.info(
      `${chalk.cyan("Checking")} transpilation of ${chalk.green(glob)}`
    );
  }
  return equalFileContents(glob, dest, { pipe: babel, base: options.dest });
};
