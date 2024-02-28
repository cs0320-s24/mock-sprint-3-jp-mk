import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { HistoryEntry, OutputContent } from "./types";
import {
  mockedCSV1,
  mockedCSV2,
  mockedCSV3,
  mockedCSV4,
  mockedCSV5,
  mockedCSV6,
  searchMock,
} from "./mockedJson";
import { invalidCommandTable } from "./invalidCommandJson";

interface REPLInputProps {
  history: HistoryEntry[];
  setHistory: Dispatch<SetStateAction<HistoryEntry[]>>;
  mode: "brief" | "verbose";
  setMode: Dispatch<SetStateAction<"brief" | "verbose">>;
}

export function REPLInput(props: REPLInputProps) {
  // keeps track of input
  const [commandString, setCommandString] = useState<string>("");
  // keeps track of currently loaded data
  const [currentDataset, setCurrentDataset] = useState<(string | number)[][]>();
  //keep track if file is loaded
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

  // submit functionality
  function handleSubmit(commandString: string) {
    // safeguard
    const trimmedCommand = commandString.trim();
    let output: OutputContent = { message: "--" }; // default output
    // allowed commands

    if (trimmedCommand === "brief" || trimmedCommand === "verbose") {
      output = handleModeChange(trimmedCommand);
    } else if (trimmedCommand.startsWith("load_file ")) {
      output = handleLoadFile(trimmedCommand);
    } else if (trimmedCommand == "view") {
      output = handleView();
    } else if (commandString.split(" ")[0] === "search") {
      output = handleSearch();
    } else {
      output = { data: invalidCommandTable };
    }

    // output is designed to take either a message(string) OR a csv file (2D array of strings and numbers)
    props.setHistory([
      ...props.history,
      { command: trimmedCommand, output: output },
    ]);

    setCommandString("");
  }

  /**
   * Helper method to apply the search to retrieve mocked data
   * @param target Search target
   * @param header Presence of headers
   * @param index Whether headers are indexes or strings
   * @param column Optional column parameter for the header name
   * @returns Returns a string message, invalid command dataset, or searched row
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
   * Helper method to handle the change between modes
   * @param command a string indicating what mode should be set
   * @returns Returns a success message or an invalid command table
   */
  function handleModeChange(command: string): OutputContent {
    const trimmedCommand = command.trim();
    if (trimmedCommand === "brief" || trimmedCommand === "verbose") {
      props.setMode(trimmedCommand as "brief" | "verbose");
      return { message: "Mode changed" };
    }
    return { data: invalidCommandTable };
  }

  /**
   * Helper method to handle the change between files
   * @param command a string indicating the file path
   * @returns Returns a success message or an error message
   */
  function handleLoadFile(command: string): OutputContent {
    const filePath = command.slice(10);
    if (mockedFiles[filePath]) {
      setCurrentDataset(mockedFiles[filePath]);
      setFileLoaded(true);
      return { message: "Success - File Loaded" };
    } else {
      setFileLoaded(false);
      return { message: "Error - File does not exist" };
    }
  }

  /**
   * This method handles the logic for implementing view functionality. It checks
   * if the file is empty or whether there is a dataset loaded. Otherwise, it displays the
   * dataset in the history.
   *
   * @returns Either a message or the dataset
   */
  function handleView(): OutputContent {
    if (
      currentDataset &&
      currentDataset.length > 0 &&
      currentDataset[0].length > 0
    ) {
      return { data: currentDataset };
    } else if (
      currentDataset &&
      (currentDataset.length === 0 ||
        (currentDataset.length === 1 && currentDataset[0].length === 0))
    ) {
      return { message: "File is empty" };
    } else {
      return { message: "No dataset is currently loaded" };
    }
  }

  /**
   * This function handles the logic for searching. It deals with incorrect
   * input and handling the request from the user. It contains inline comments.
   *
   * @returns Varies from descriptive messages, an invalid command dataset, or
   * the searched row
   */
  function handleSearch(): OutputContent {
    //splits the entire request by spaces
    const splitString: string[] = commandString.split(" ");
    console.log(splitString);

    //regex to split words in []
    const regexString: string[] | null =
      commandString.match(/(?<=\[).+?(?=\])/g);
    console.log(regexString);

    /**
     * Checks the regexed string for correct number of inputs or whether it is null,
     * and handles accordingly.
     */
    if (regexString != null) {
      if (regexString.length < 3) {
        if (splitString[1] === "false") {
          if (regexString.length > 1) {
            return { data: invalidCommandTable };
          } else {
            return { data: applySearch(regexString[1], false, false) };
          }
        } else if (
          currentDataset &&
          (currentDataset.length === 0 ||
            (currentDataset.length === 1 && currentDataset[0].length === 0))
        ) {
          return { message: "File is empty" };
        } else if (!isFileLoaded) {
          return { message: "Load file before searching" };
        } else if (splitString.length < 2) {
          return {
            message: "Please include a target and an optional column to search",
          };
        } else if (splitString[1] === "true") {
          if (regexString.length > 1) {
            if (splitString[2] === "true") {
              return {
                data: applySearch(regexString[1], true, true, regexString[2]),
              };
            } else if (splitString[2] === "false") {
              return {
                data: applySearch(regexString[1], true, false, regexString[2]),
              };
            } else {
              return { data: invalidCommandTable };
            }
          } else {
            return { data: invalidCommandTable };
          }
        } else {
          return { data: invalidCommandTable };
        }
      }
    }
    return { data: invalidCommandTable };
  }

  /**
   * repl input that allows for the user to submit requests.
   * Consists of label for input and button to submit.
   */
  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>

      <button onClick={() => handleSubmit(commandString)}>Submit</button>
    </div>
  );
}
