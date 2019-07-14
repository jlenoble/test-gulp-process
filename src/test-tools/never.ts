import chalk from "chalk";

export const never = _msg => (msg, options) => {
  if (options && options.debug) {
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
