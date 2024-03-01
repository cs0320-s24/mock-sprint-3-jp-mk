import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { OutputContent } from "./types";
import { invalidCommandTable } from "./invalidCommandJson";
import { HistoryEntry } from "./types";
import {
  mockedCSV1,
  mockedCSV2,
  mockedCSV3,
  mockedCSV4,
  mockedCSV5,
  mockedCSV6,
  searchMock,
} from "./mockJson";

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
  // State that tracks current (mock) filepath
  const [currData, setCurrData] = useState<(string | number)[][]>();
  // State that tracks if a file is loaded
  const [isFileLoaded, setFileLoaded] = useState<boolean>(false);

  // mocked data
  const mockedFiles: { [key: string]: (string | number)[][] } = {
    path1: mockedCSV1,
    path2: mockedCSV2,
    path3: mockedCSV3,
    path4: mockedCSV4,
    path5: mockedCSV5,
    path6: mockedCSV6,
  };

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
    console.log(trimmedCommand);
    const args: string[] = commandString.trim().split(" ");
    const command: string = args[0];
    const [, ...rest] = args; // rest is an array with everything but the first argument of args
    // const replFun: REPLFunction = map.get(args[0]);

    // replFun(rest);
    let output: OutputContent = { message: "--" }; //default output

    switch (command) {
      case "mode":
        output = mode(trimmedCommand);
        break;
      case "load":
        output = load(rest[0]);
        break;
      case "view":
        output = view();
        break;
      case "search":
        output = search();
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
  function view() {
    if (!currData) {
      return { message: "No dataset is currently loaded" };
    }
    if (currData.some((row) => row.length > 0)) {
      return { data: currData };
    }
    return { message: "File is empty" };
  }

  /**
   * TODO: Docs for this function.
   *
   * @param
   * @returns
   */
  function load(arg: string) {
    const filePath = arg;
    if (mockedFiles[filePath]) {
      setCurrData(mockedFiles[filePath]);
      setFileLoaded(true);
      return { message: "Success - File Loaded" };
    } else {
      setFileLoaded(false);
      return { message: "Error - File does not exist" };
    }
  }

  /**
   * TODO: Docs for this function.
   *
   * @param
   * @returns
   */

  function applySearch(
    target: string,
    header: boolean,
    index: boolean,
    column?: string
  ): (string | number)[][] {
    return searchMock(index, header, column || "", target);
  }

  /**
   * TODO: Docs for this function.
   *
   * @param
   * @returns
   */
  function search(): OutputContent {
    // Split the command string by spaces and extract words within brackets
    const splitString = commandString.split(" ");
    const regexString = commandString.match(/(?<=\[).+?(?=\])/g);

    console.log(splitString, regexString);

    // Validate the basic conditions
    if (!isFileLoaded) {
      return { message: "Load file before searching" };
    }
    if (
      !currData ||
      currData.length === 0 ||
      (currData.length === 1 && currData[0].length === 0)
    ) {
      return { message: "File is empty" };
    }
    if (splitString.length < 2) {
      return {
        message: "Please include a target and an optional column to search",
      };
    }
    if (!regexString || regexString.length < 1) {
      return { data: invalidCommandTable };
    }

    // Extract the parameters from the split string
    const isExactMatch = splitString[1] === "true";
    const isCaseSensitive = splitString[2] === "true";
    const target = regexString[0];

    // Apply search based on the extracted parameters
    return { data: applySearch(target, isExactMatch, isCaseSensitive) };
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
