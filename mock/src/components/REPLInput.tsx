import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { OutputContent } from "./types";
import { invalidCommandTable } from "./invalidCommandJson";
import { HistoryEntry } from "./types";

/**
 * TODO: Docs for this class.
 */

interface REPLInputProps {
  history: HistoryEntry[];
  setHistory: Dispatch<SetStateAction<HistoryEntry[]>>;
  mode: Boolean;
  setMode: Dispatch<SetStateAction<Boolean>>;
}

/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
export function REPLInput(props: REPLInputProps) {
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  // TODO WITH TA : add a count state
  const [count, setCount] = useState<number>(0);

  /* A Map of strings to REPLFunctions. 
        The key represents the, 
        while the value is the corresponding function to that key value. 
    */
  // const map = new Map<string, REPLFunction>();

  // const mapInit = () => {
  //   map.set("mode", mode);
  //   map.set("load", load);
  //   map.set("view", view);
  //   map.set("search", search);
  // };

  // This function is triggered when the button is clicked.
  function handleSubmit(commandString: string) {
    // mapInit();
    const trimmedCommand = commandString.trim();
    const args: string[] = commandString.trim().split(" ");
    const [, ...rest] = args; // rest is an array with everything but the first argument of args
    // const replFun: REPLFunction = map.get(args[0]);

    // replFun(rest);
    let output: OutputContent = { message: "--" }; //default o put

    switch (trimmedCommand) {
      case "mode":
        output = mode(trimmedCommand);
        break;
      case "load":
        output = load(args);
        break;
      case "view":
        output = view(args);
        break;
      case "search":
        output = search(args);
        break;
      default:
        output = { data: invalidCommandTable };
    }

    setCount(count + 1);
    props.setHistory([
      ...props.history,
      { command: trimmedCommand, output: output },
    ]);

    setCommandString("");
  }

  /**
   * A command-processor function for our REPL. The function returns a string, which is the value to print to history when
   * the command is done executing.
   *
   * The arguments passed in the input (which need not be named "args") should
   * *NOT* contain the command-name prefix.
   */
  interface REPLFunction {
    (args: Array<string>): String | String[][];
  }

  /**
   * TODO: Docs for this function.
   *
   * @param
   * @returns
   */
  function mode(command: string) {
    if (props.mode) {
      props.setMode(!props.mode);
      return { message: "Mode changed to Verbose" };
    } else {
      props.setMode(!props.mode);
      return { message: "Mode changed to Brief" };
    }
  }

  /**
   * TODO: Docs for this function.
   *
   * @param
   * @returns
   */
  function view(args: string[]) {
    return { message: "Mode changed" };
  }

  /**
   * TODO: Docs for this function.
   *
   * @param
   * @returns
   */
  function load(args: string[]) {
    return { message: "Mode changed" };
  }

  /**
   * TODO: Docs for this function.
   *
   * @param
   * @returns
   */
  function search(args: string[]) {
    return { message: "Mode changed" };
  }

  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
  return (
    <div className="repl-input">
      {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
            braces, so that React knows it should be interpreted as TypeScript */}
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>
        Submitted {count} times
      </button>
    </div>
  );
}
