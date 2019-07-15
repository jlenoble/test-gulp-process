import { Result } from "child-process-data";

const repeat = (
  action,
  interval = 200,
  maxDuration = 4000
): Promise<boolean> => {
  return new Promise((resolve, reject): void => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const intervalId = setInterval(autoCleanAction, interval);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const timeoutId = setTimeout(timeout, maxDuration);

    function timeout(): void {
      clearInterval(intervalId);
      reject(new Error("Waiting too long for child process to finish"));
    }

    function autoCleanAction(): void {
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
    }

    autoCleanAction(); // Start immediately
  });
};

const testMessage = (results: Result, message: string): boolean => {
  return (
    results
      .allMessages()
      .findIndex((el): boolean => !!el.match(new RegExp(message))) !== -1
  );
};

export async function waitForMessage(
  results: Result,
  message: string
): Promise<boolean> {
  const msg = message.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

  try {
    return repeat((): boolean => testMessage(results, msg));
  } catch (err) {
    if (err.message.match(/Waiting too long for child process to finish/)) {
      throw new Error(`Waiting too long for child process to finish:
Message '${message}' was never intercepted`);
    }
    throw err;
  }
}
