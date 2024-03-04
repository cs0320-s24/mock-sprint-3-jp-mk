/**
 * A table that informs the user of the valid commands, usually displayed after an invalid command
 */

export const invalidCommandTable = [
  ["Valid Command", "Input", "Output"],
  [
    "mode",
    "N/A",
    "Brief: Shows only the output of the command | Verbose: Shows both the read command and the output of the command",
  ],
  ["load", "Path of file", "Loads the desired CSV file"],
  ["view", "N/A", "Displays a table from the loaded file"],
  [
    "search",
    "headers: true or false | index: true or false | column: as the name or a number between [] | target: string to search for between []",
    "Rows that contain this value",
  ],
];
