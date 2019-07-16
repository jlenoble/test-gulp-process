import {
  ChildProcessData,
  SingleTest,
  SingleOptions,
  ErrorWithHistory
} from "child-process-data";
import { spawn } from "child_process";
import path from "path";
import {
  newDest,
  copySources,
  copyGulpfile,
  copyBabelrc,
  linkNodeModules,
  cleanUp,
  SetupOptions,
  NormalizedSetupOptions
} from "./helpers";
import { Messages, TaskMessagesArray } from "./classes";

export interface MultiTestGulpOptions extends SingleOptions, SetupOptions {
  task?: string | string[];
  fullDebug?: boolean;
  timeout?: number;
  messages: TaskMessagesArray | Messages;
}

export interface TestGulpOptions extends MultiTestGulpOptions {
  task: string;
  dest: string;
  createDest: boolean;
}

export class TestGulpProcess extends SingleTest {
  protected _task: string;
  protected _messages: Messages;
  protected _setupOptions: NormalizedSetupOptions;
  protected BABEL_DISABLE_CACHE?: string;

  protected static _debug: boolean = false;
  protected static _fullDebug: boolean = false;

  public static setDebug(debug: boolean): void {
    TestGulpProcess._debug = debug;
  }

  public static setFullDebug(debug: boolean): void {
    TestGulpProcess._fullDebug = debug;
  }

  public constructor(options: TestGulpOptions) {
    super(options);

    this._task = options.task;

    this._silent =
      options.silent || !(options.fullDebug || TestGulpProcess._fullDebug);

    this._debug =
      options.debug ||
      options.fullDebug ||
      TestGulpProcess._debug ||
      TestGulpProcess._fullDebug;

    if (options.messages instanceof Messages) {
      this._messages = options.messages;
    } else {
      this._messages = new Messages(options.messages, { debug: this._debug });
    }

    this._setupOptions = {
      sources: options.sources,
      gulpfile: options.gulpfile,
      dest: options.dest,
      createDest: options.createDest,
      transpileSources: !!options.transpileSources,
      transpileGulp: !!options.transpileGulp
    };
  }

  public async run(): Promise<void> {
    try {
      await this.setupTest();
      await this.spawnTest();
      await this.checkResults();
    } catch (err) {
      try {
        await this.onError(err);
      } catch (e) {
        await this.tearDownTest();
        throw e;
      }
    }

    await this.tearDownTest();
  }

  public async setupTest(): Promise<void> {
    if (this._debug) {
      console.log("[testGulpProcess] setupTest");
    }

    this.BABEL_DISABLE_CACHE = process.env.BABEL_DISABLE_CACHE;
    process.env.BABEL_DISABLE_CACHE = "1"; // Don't use Babel caching for
    // these tests

    if (this._setupOptions.createDest) {
      await Promise.all([
        copySources(this._setupOptions),
        copyGulpfile(this._setupOptions),
        copyBabelrc(this._setupOptions)
      ]);

      await linkNodeModules(this._setupOptions);
    }
  }

  public async spawnTest(): Promise<void> {
    if (this._debug) {
      console.log("[testGulpProcess] spawnTest");
    }

    this._childProcess = spawn(
      "gulp",
      [
        this._task,
        "--gulpfile",
        path.join(this._setupOptions.dest, "gulpfile.babel.js")
      ],
      { detached: true } // Make sure all test processes will be killed
    );

    this._results = new ChildProcessData(this._childProcess, {
      silent: this._silent
    }).results;
  }

  public async checkResults(): Promise<void> {
    if (this._debug) {
      console.log("[testGulpProcess] checkResults");
    }

    if (!this._results) {
      return;
    }

    while (await this._messages.next(this._results)) {
      this._results.testUpTo(this._messages.globalFns, this._messages.message, {
        included: true
      });
      this._results.forgetUpTo(this._messages.message, { included: true });
      await this._messages.runCurrentFns(this._options);
    }
  }

  public async tearDownTest(): Promise<void> {
    if (this._debug) {
      console.log("[testGulpProcess] tearDownTest");
    }

    if (!this._childProcess) {
      return;
    }

    try {
      await cleanUp(
        this._childProcess,
        this._setupOptions.dest,
        this.BABEL_DISABLE_CACHE
      );
    } catch (err) {
      console.error("Failed to clean up after test");
      console.error("You should take time and check that:");
      console.error(`- Directory ${this._setupOptions.dest} is deleted`);
      console.error(
        `- Process ${this._childProcess.pid} is not running any more`
      );
      throw err;
    }
  }

  public async onError(err: ErrorWithHistory): Promise<void> {
    if (this._debug) {
      console.log("[testGulpProcess] onError");
    }
    if (this._options.onError) {
      return this._options.onError(err);
    } else {
      throw err;
    }
  }
}

export class MultiTestGulpProcess {
  protected _tasks: string[];
  protected _tests: TestGulpProcess[];

  public constructor(options: MultiTestGulpOptions) {
    const tasks = options.task || ["default"];
    this._tasks = Array.isArray(tasks) ? tasks : [tasks];

    const dest = options.dest || newDest();
    let messages: Messages;

    if (options.messages instanceof Messages) {
      messages = options.messages;
    } else {
      messages = new Messages(options.messages, { debug: options.debug });
    }

    this._tests = this._tasks.map(
      (task, nth): TestGulpProcess => {
        return new TestGulpProcess({
          ...options,
          task,
          dest,
          createDest: !nth,
          messages
        });
      }
    );
  }

  public async run(): Promise<void> {
    for (const test of this._tests) {
      await test.run();
    }
  }
}

export default function testGulpProcess(
  options: MultiTestGulpOptions = {
    // @ts-ignore
    childProcess: null
  }
): () => Promise<void> {
  return async function(): Promise<void> {
    const timeout = (options && options.timeout) || 20000;

    if (
      // @ts-ignore
      this.timeout && // eslint-disable-line no-invalid-this
      // @ts-ignore
      typeof this.timeout === "function" // eslint-disable-line no-invalid-this
    ) {
      // @ts-ignore
      this.timeout(timeout); // eslint-disable-line no-invalid-this
    }

    return new MultiTestGulpProcess(options).run();
  };
}

export {
  compareTranspiled,
  deleteFile,
  hasSourcemap,
  isChangedContent,
  isDeleted,
  isFound,
  isNewer,
  isSameContent,
  isUntouched,
  never,
  nextTask,
  parallel,
  snapshot,
  touchFile
} from "./test-tools";
