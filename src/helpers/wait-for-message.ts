const repeat = (action, interval = 200, maxDuration = 4000) => {
  let intervalId;
  let timeoutId;

  return new Promise((resolve, reject) => {
    const timeout = () => {
      clearInterval(intervalId);
      reject(new Error("Waiting too long for child process to finish"));
    };

    const autoCleanAction = () => {
      try {
        if (action()) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          resolve(true);
        }
      } catch (e) {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        reject(e);
      }
    };

    intervalId = setInterval(autoCleanAction, interval);
    timeoutId = setTimeout(timeout, maxDuration);

    autoCleanAction(); // Start immediately
  });
};

const testMessage = (results, message) => {
  return (
    results.allMessages.findIndex(el => el.match(new RegExp(message))) !== -1
  );
};

export function waitForMessage(results, message) {
  const msg = message.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  return repeat(() => testMessage(results, msg)).catch(err => {
    if (err.message.match(/Waiting too long for child process to finish/)) {
      throw new Error(`Waiting too long for child process to finish:
Message '${message}' was never intercepted`);
    }
    throw err;
  });
}
