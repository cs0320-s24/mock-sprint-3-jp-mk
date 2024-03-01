import { ClassType, Dispatch, Key, SetStateAction, useState } from "react";
import "../styles/main.css";
import { OutputContent } from "./types";
import { invalidCommandTable } from "./invalidCommandJson";

import {
  mockedCSV1,
  mockedCSV2,
  mockedCSV3,
  mockedCSV4,
  mockedCSV5,
  mockedCSV6,
  searchMock,
} from "./mockJson";
import { StateMap } from "./REPLInput";

/**
 * Object representing a collection of mocked CSV file data.
 * Each key in the object corresponds to a mock file path, and the associated value
 * is a 2D array of data (strings or numbers) representing the contents of the CSV file.
 *
 * The structure of the data is as follows:
 * - path1, path2, ..., path6: Each of these keys represents a different mock file path.
 * - mockedCSV1, mockedCSV2, ..., mockedCSV6: These are the mock data sets,
 *   each being a 2D array of strings or numbers. Each array represents the contents
 *   of a CSV file, where each inner array is a row of data in the CSV.
 */
const mockedFiles: { [key: string]: (string | number)[][] } = {
  path1: mockedCSV1,
  path2: mockedCSV2,
  path3: mockedCSV3,
  path4: mockedCSV4,
  path5: mockedCSV5,
  path6: mockedCSV6,
};

/**
 * A command-processor function for our REPL. The function returns a string, which is the value to print to history when
 * the command is done executing.
 *
 * The arguments passed in the input (which need not be named "args") should
 * *NOT* contain the command-name prefix.
 */
export interface REPLFunction {
  (args: Array<string>, stateMap: StateMap): OutputContent;
}
/**
 * Toggles the mode of the REPL between 'brief' and 'verbose' and returns the appropriate message.
 *
 * @param {string[]} _args - Unused in the current implementation, but can be utilized for future enhancements.
 * @param {StateMap} stateMap - An object that holds the current state of the REPL, including the mode.
 *
 * @returns {OutputContent} An object containing a message indicating the new mode after toggling.
 *
 * The function first retrieves the current mode state and its dispatcher from the stateMap.
 * It then toggles the mode state and returns a message indicating the new mode.
 * In 'brief' mode, the REPL displays minimal information, whereas in 'verbose' mode,
 * it shows detailed information for each command.
 */
export function mode(_args: string[], stateMap: StateMap): OutputContent {
  const mode: boolean = stateMap.getState("mode");
  const setMode: Dispatch<SetStateAction<boolean>> =
    stateMap.getDispatch("mode");
  // Toggle mode state
  setMode(!mode);

  // Return appropiate message
  if (mode) {
    return { message: "Mode changed to Verbose" };
  } else {
    return { message: "Mode changed to Brief" };
  }
}

/**
 * Displays the currently loaded dataset or an appropriate message if no data is loaded.
 *
 * @param {string[]} _args - Arguments passed to the view command. Unused in the current implementation,
 *                           but can be utilized for future enhancements such as specifying which part of the data to view.
 * @param {StateMap} stateMap - An object that holds the current state of the REPL, including the current dataset.
 *
 * @returns {OutputContent} - An object containing either the current dataset or a message.
 *                            The message can indicate that no data is loaded, that the data sources were never initialized,
 *                            or that the loaded file is empty.
 *
 * This function checks the 'currData' state in the stateMap to determine if any dataset is currently loaded in the REPL.
 * It returns the dataset if available. If no data is available, it returns an appropriate message based on the condition:
 * data sources not initialized, no dataset loaded, or file is empty.
 */
export function view(_args: string[], stateMap: StateMap): OutputContent {
  const currData: (string | number)[][] = stateMap.getState("currData");
  if (currData == undefined) {
    return { message: "Data sources were never initialized" };
  }

  if (!currData) {
    return { message: "No dataset is currently loaded" };
  }
  if (currData.some((row) => row.length > 0)) {
    return { data: currData };
  }
  return { message: "File is empty" };
}

/**
 * Loads a dataset into the REPL environment from the given file path.
 *
 * @param {string[]} args - The arguments passed to the load command, where args[0] is the file path.
 * @param {StateMap} stateMap - An object that holds the current state of the REPL,
 *                              including the current data and file load status.
 *
 * @returns {OutputContent} - Returns an object of type OutputContent. If the file is successfully
 *                            loaded, it returns a success message. Otherwise, returns an error message.
 *
 * This function attempts to load a dataset based on a provided file path (args[0]). It uses the
 * 'mockedFiles' object to simulate loading data from different file paths. The function updates the
 * 'currData' and 'isFileLoaded' states in the stateMap with the new dataset or loading status.
 * If the file path does not correspond to any entry in 'mockedFiles', an error message is returned.
 */
export function load(args: string[], stateMap: StateMap): OutputContent {
  const setCurrData: Dispatch<SetStateAction<(string | number)[][]>> =
    stateMap.getDispatch("currData");
  const setFileLoaded: Dispatch<SetStateAction<boolean>> =
    stateMap.getDispatch("isFileLoaded");
  if (setCurrData == undefined || setFileLoaded == undefined) {
    return { message: "Data sources were never initialized" };
  }

  const filePath = args[0];

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
 * Applies search criteria to the mocked data and returns the filtered results.
 *
 * @param {string} target - The target string or value to search for within the dataset.
 * @param {boolean} header - Indicates whether to consider the header row in the search.
 * @param {boolean} index - Specifies whether to treat the 'column' parameter as an index.
 * @param {string} [column] - The column name or index in which to search for the target. Optional.
 *
 * @returns {(string | number)[][]} - A 2D array containing the rows of data that match the search criteria.
 *
 * This function utilizes the 'searchMock' function to perform the search operation. It passes
 * the 'index', 'header', 'column', and 'target' parameters to 'searchMock' and returns the resulting dataset.
 * The function is designed to handle different types of searches, including searching in a specific column
 * or across the entire dataset, and can be adapted to include more complex search functionalities.
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
 * Executes a search operation on the currently loaded dataset based on provided arguments.
 *
 * @param {string[]} args - Arguments passed to the search command.
 *                          The first element is the target string for the search,
 *                          followed by flags indicating whether the search is an exact match
 *                          and whether it is case-sensitive.
 * @param {StateMap} stateMap - An object representing the current state of the REPL,
 *                              including whether a file is loaded and the current data.
 *
 * @returns {OutputContent} - Returns an object of type OutputContent. If a file is not loaded,
 *                            or if the dataset is malformed or empty, it returns an error message.
 *                            Otherwise, it returns the search results.
 *
 * This function first checks if the data sources were initialized and if a file is loaded.
 * Then, it validates the provided arguments and the format of the current data.
 * If these checks pass, it executes the search using the 'applySearch' function and
 * returns the results. The search behavior and results depend on the flags provided in args.
 */
export function search(args: string[], stateMap: StateMap): OutputContent {
  const isFileLoaded: boolean = stateMap.getState("isFileLoaded");
  const currData: (string | number)[][] = stateMap.getState("currData");
  if (isFileLoaded == undefined || currData == undefined) {
    return { message: "Data sources were never initialized" };
  }

  if (!args || args.length < 1) {
    return { data: invalidCommandTable };
  }

  // Validate the basic conditions
  if (!isFileLoaded) {
    return { message: "Load file before searching" };
  }

  if (
    !currData ||
    currData.length === 0 ||
    (currData.length >= 1 && currData[0].length == 0)
  ) {
    return { message: "Error: Malformed CSV Data." };
  }

  // Extract the parameters from the split string
  const isExactMatch = args[2] === "true";
  const isCaseSensitive = args[3] === "true";
  const target = args[0];

  // Apply search based on the extracted parameters
  return { data: applySearch(target, isExactMatch, isCaseSensitive) };
}
