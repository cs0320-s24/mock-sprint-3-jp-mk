import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
//import { REPLFunction, mode, load, view, search } from "./REPLFunction";
import { HistoryEntry, OutputContent } from "./types";
import React from 'react';
import { invalidCommandTable } from "./invalidCommandJson";
  /**
 * TODO: Docs for this class.
 */

  interface REPLInputProps {
    history: HistoryEntry[];
    setHistory: Dispatch<SetStateAction<HistoryEntry[]>>;
    mode: "brief" | "verbose";
    setMode: Dispatch<SetStateAction<"brief" | "verbose">>;
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
function mode(args: string[]) {
    props.mode;
    return args.toString();
  }

/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
function view(args: string[]) {
  return args.toString();
}

/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
 function load(args: string[]) {
  return args.toString();
}

/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
function search(args: string[]) {
  return args.toString();
}
  const map = new Map<string, REPLFunction>();

  
  const mapInit : Function = () => {
    map.set("mode", mode);
    map.set("load", load);
    map.set("view", view);
    map.set("search", search);
  };

  // This function is triggered when the button is clicked.
  function handleSubmit(commandString: string) {
    mapInit();
    const args: string[] = commandString.trim().split(" ");
    const [, ...rest] = args; // rest is an array with everything but the first argument of args

    let output: OutputContent = { message: "" };

    setCount(count + 1);
    props.setHistory([
      ...props.history,
      { command: trimmedCommand, output: output },
    ]);
    setCommandString("");
  }

      const replFun: REPLFunction | undefined = map.get(args[0]);
        
      if(replFun == undefined){
        console.log("Invalid function input.")
      }

      setCount(count+1)
      props.setHistory([...props.history, commandString])
      setCommandString('')
  /**
   * Helper method to handle the change between modes
   * @param command a string indicating what mode should be set
   * @returns Returns a success message or an invalid command table
   */
  function handleModeChange(command: string): OutputContent {
    const trimmedCommand = command.trim();
    if (trimmedCommand === "brief" || trimmedCommand === "verbose") {
      props.setMode(trimmedCommand as "brief" | "verbose");
      console.log("returned message");
      return { message: "Mode changed" };
    }
    console.log("invalid command returned");
    return { data: invalidCommandTable };
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
