import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { OutputContent } from "./types";
import { invalidCommandTable } from "./invalidCommandJson";
import { HistoryEntry } from "./types";
import { REPLFunction, mode, view, search, load } from "./REPLFunction";

/**
 * TODO: Docs for this class.
 */

interface REPLInputProps {
  history: HistoryEntry[];
  setHistory: Dispatch<SetStateAction<HistoryEntry[]>>;
  mode: Boolean;
  setMode: Dispatch<SetStateAction<Boolean>>;
}

export class REPLMap {

  data = new Map<string, REPLFunction>()

  get(key: string): REPLFunction {
    var entry = this.data.get(key)
    if (entry == undefined) {
      return (): OutputContent => ({ data: invalidCommandTable });
    } else {
      return entry;
    }
  }

  set(key: string, value: REPLFunction): this {
    (key !== undefined && key !== "" && key !== null) ? this.data.set(key, value) : console.log("Key cannot be undefined, null or empty!")
    return this
  }
}

export class StateMap {
  stateData = new Map<string, any>()
  dispatchData = new Map<string, Dispatch<SetStateAction<any>>>()


  getState(key: string): any {
    var entry = this.stateData.get(key)
    if (entry == undefined) {
      console.log("Invalid dispatch key: Values returned from this function may be unpredictable")
      return undefined;
    } else {
      return entry;
    }
  }

  getDispatch(key: string): Dispatch<SetStateAction<any>> {
    var entry = this.dispatchData.get(key)
    if (entry == undefined) {
      console.log("Invalid state key: Values returned from this function may be unpredictable")
      return () => undefined;
    } else {
      return entry;
    }
  }

  setState(key: string, state: any, dispatch: Dispatch<SetStateAction<any>>): this {
    (key !== undefined && key !== "" && key !== null) ? this.stateData.set(key, state) : console.log("Key cannot be undefined, null or empty!");
    (key !== undefined && key !== "" && key !== null) ? this.dispatchData.set(key, dispatch) : console.log("Key cannot be undefined, null or empty!")
    return this
  }
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

  const [isFileLoaded, setFileLoaded] = useState<boolean>(false);

  const [currData, setCurrData] = useState<(string | number)[][]>();

  // State that tracks loading

  /**
 * A command-processor function for our REPL. The function returns a string, which is the value to print to history when
 * the command is done executing.
 *
 * The arguments passed in the input (which need not be named "args") should
 * *NOT* contain the command-name prefix.
 */

  /* A Map of strings to REPLFunctions. 
        The key represents the, 
        while the value is the corresponding function to that key value. 
    */
  const replMap: REPLMap = new REPLMap();
  const stateMap: StateMap = new StateMap();

  const mapInit = () => {
    replMap.set("mode", mode);
    replMap.set("load", load);
    replMap.set("view", view);
    replMap.set("search", search);
    stateMap.setState('mode', props.mode, props.setMode);
    stateMap.setState('isFileLoaded', isFileLoaded, setFileLoaded);
    stateMap.setState('currData', currData, setCurrData);
  };

  // This function is triggered when the button is clicked.
  function handleSubmit(commandString: string) {
    mapInit();
    const args: string[] = commandString.trim().split(" ");
    const command: string = args[0];
    const [, ...rest] = args; // rest is an array with everything but the first argument of args

    const replFun: REPLFunction = replMap.get(command);

    let output: OutputContent = replFun(rest, stateMap);
    //stateMap

    setCount(count + 1);
    props.setHistory([
      ...props.history,
      { command: command, output: output },
    ]);

    setCommandString("");
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
