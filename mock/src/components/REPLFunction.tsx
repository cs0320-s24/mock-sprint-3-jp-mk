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


// mocked data
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
    (args: Array<string>,
        stateMap: StateMap
    ): OutputContent;
}
/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
export function mode(_args: string[], stateMap: StateMap
): OutputContent {
    const mode: boolean = stateMap.getState('mode');
    const setMode: Dispatch<SetStateAction<boolean>> = stateMap.getDispatch('mode');
    setMode(!mode)

    if (mode) {
        return { message: "Mode changed to Verbose" };
    } else {
        return { message: "Mode changed to Brief" };
    }
}

/**
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */

export function view(_args: string[],
    stateMap: StateMap
): OutputContent {
    const currData : (string | number)[][] = stateMap.getState('currData');
    if (currData == undefined){
        return { message: "Data sources were never initialized" }
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
 * TODO: Docs for this function.
 *
 * @param
 * @returns
 */
export function load(args: string[], stateMap: StateMap
): OutputContent {
    const setCurrData : Dispatch<SetStateAction<(string | number)[][]>> = stateMap.getDispatch('currData');
    const setFileLoaded : Dispatch<SetStateAction<boolean>> = stateMap.getDispatch('isFileLoaded');
    if (setCurrData == undefined || setFileLoaded == undefined){
        return { message: "Data sources were never initialized" }
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
export function search(args: string[], stateMap: StateMap
): OutputContent {
    const isFileLoaded: boolean = stateMap.getState('isFileLoaded');
    const currData : (string | number)[][] = stateMap.getState('currData');
    if (isFileLoaded == undefined || currData == undefined){
        return { message: "Data sources were never initialized" }
    }

    //Split the command string by spaces and extract words within brackets
    //const regexString = args[0].match(/(?<=\[).+?(?=\])/g);

    if (!args || args.length < 1) {
        return { data: invalidCommandTable };
    }

    //const regexString = args[0];


    // Validate the basic conditions
    if (!isFileLoaded) {
        return { message: "Load file before searching" };
    }

    if (
        !currData ||
        currData.length === 0 ||
        (currData.length >= 1 && currData[0].length == 0)
    ) {
        return { message: "Error: Malformed CSV Data."};
    }

    // if (args.length < 2) {
    //     return {
    //         message: "Please include a target and an optional column to search",
    //     };
    // }


    // Extract the parameters from the split string
    const isExactMatch = args[2] === "true";
    const isCaseSensitive = args[3] === "true";
    const target = args[0];

    // Apply search based on the extracted parameters
    return { data: applySearch(target, isExactMatch, isCaseSensitive) };
}
