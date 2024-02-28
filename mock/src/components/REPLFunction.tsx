/**
 * A command-processor function for our REPL. The function returns a string, which is the value to print to history when
 * the command is done executing.
 *
 * The arguments passed in the input (which need not be named "args") should
 * *NOT* contain the command-name prefix.
 */
export interface REPLFunction {
  (args: Array<string>): String | String[][];
}

/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
export function mode(args: string) {
  if (args === "mode") {
    const newMode = args[0];
  }
}

/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
export function view(args: string[]) {
  return args.toString();
}

/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
export function load(args: string[]) {
  return args.toString();
}

/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
export function search(args: string[]) {
  return args.toString();
}
