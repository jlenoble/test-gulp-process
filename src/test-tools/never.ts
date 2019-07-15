import chalk from "chalk";

interface Options {
  debug?: boolean;
}
type Fn = (msg: string, options: Options) => boolean;

export const never = (_msg: string): Fn => (
  msg: string,
  { debug }: Options = {}
): boolean => {
  if (debug) {
    console.info(
      `${chalk.cyan("ensuring")} '${chalk.green(
        msg
      )}' doesn't match '${chalk.green(_msg)}'`
    );
  }
  if (msg.match(new RegExp(_msg.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")))) {
    throw new Error(`Forbidden message "${_msg}" was caught`);
  }
  return true;
};
