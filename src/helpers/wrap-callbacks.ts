import { onError } from "./cleanup";

export const wrapCallbacks = opts => {
  const options = Object.assign({}, opts);

  ["onSetupError", "onSpawnError", "onCheckResultsError"].forEach(method => {
    if (opts[method]) {
      options[method] = function(err) {
        return onError.call(this, err).catch(() => {
          return opts[method].call(this, err);
        });
      };
    }
  });

  return options;
};
