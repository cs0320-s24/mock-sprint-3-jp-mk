/**
 * This type is used to represent the output of a command executed in the REPL.
 *
 * @type {OutputContent}
 *
 * @property {string?} message - An optional string property to hold a textual message.
 *                               This is used for commands that produce a text output.
 *                               If the command's output is just a simple message or information,
 *                               it will be stored in this property.
 *
 * @property {(string | number)[][]?} data - An optional 2D array property to hold structured data,
 *                                          typically from a CSV file or similar structured source.
 *                                          This property is used for commands that produce table-like data,
 *                                          where each array element represents a row, and each row is an
 *                                          array of values (which can be either strings or numbers).
 */
export type OutputContent = {
  message?: string;
  data?: (string | number)[][];
};

/**
 * Type definition for an entry in the history of a REPL environment.
 * This type is used to represent a single interaction in the REPL, including both the command entered and its output.
 *
 * @type {HistoryEntry}
 *
 * @property {string} command - The command text that was entered into the REPL. This property records the exact
 *                              command entered by the user.
 *
 * @property {OutputContent} output - The output generated in response to the command. This property uses the
 *                                    OutputContent type to allow for flexibility in the kind of output a command can
 *                                    produce, whether it be a simple message or structured data like a CSV table.
 */
export type HistoryEntry = {
  command: string;
  output: OutputContent;
};
