import { rebaseGlob } from "polypath";
import chalk from "chalk";
import path from "path";
import equalFileContents from "equal-file-contents";
import babel from "gulp-babel";

export const compareTranspiled = (_glob, _dest) => options => {
  const dest = path.join(options.dest, _dest);
  const glob = rebaseGlob(_glob, options.dest);
  if (options && options.debug) {
    console.info(
      `${chalk.cyan("Checking")} transpilation of ${chalk.green(glob)}`
    );
  }
  return equalFileContents(glob, dest, babel, options.dest);
};
