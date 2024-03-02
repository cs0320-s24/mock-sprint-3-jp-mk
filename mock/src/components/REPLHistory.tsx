import React from "react";
import { HistoryEntry } from "./types";

/**
 * Interface for the properties of the REPLHistory component.
 *
 * @interface REPLHistoryProps
 *
 * @property {HistoryEntry[]} history - An array of HistoryEntry objects. Each HistoryEntry
 * represents a single command entered into the REPL and its corresponding output.
 *
 * @property {Boolean} mode - A boolean flag indicating the current mode of the REPL. If true,
 * the REPL is in 'breif' mode and displays detailed information for each command. If false,
 * the REPL is in 'verbose' mode and displays minimal information.
 */
interface REPLHistoryProps {
  history: HistoryEntry[];
  mode: Boolean;
}

/**
 * Functional React component that renders a table to display CSV data.
 *
 * @param {Object} props - Component properties.
 * @param {(string | number)[][]} props.data - 2D array of data to be displayed in the table.
 * Assumes the first row contains header information.
 *
 * @returns {JSX.Element|null} A table element populated with CSV data or null if data is empty.
 */
const CSVTable = ({
  data,
}: {
  data: (string | number)[][];
}): JSX.Element | null => {
  if (!data || data.length === 0) return null;

  // Assuming the first row contains headers
  const headers = data[0];
  const rows = data.slice(1); // All rows except the header row

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * Functional React component that renders the history of commands and outputs in the REPL.
 *
 * @param {REPLHistoryProps} props - Properties passed to the component.
 *
 * @returns {JSX.Element} A div element containing the REPL history. Each history entry
 * is rendered according to the current mode. In 'brief' mode, only the output of the command
 * is shown. In 'verbose' mode, both the command and its output are displayed.
 */
export function REPLHistory({
  history,
  mode = true,
}: REPLHistoryProps): JSX.Element {
  return (
    <div className="repl-history" aria-label="repl-history">
      <div className="history-header">
        {mode ? (
          <h3>Output</h3>
        ) : (
          <>
            <h3>Command History</h3>
            <h3>Output</h3>
          </>
        )}
      </div>
      {history.map((entry, index) => (
        <div key={index} className="history-entry">
          {mode ? (
            // Brief mode: Show only output
            <div className="output-section-brief">
              {entry.output.message ? (
                <span className="output">{entry.output.message}</span>
              ) : entry.output.data ? (
                <CSVTable data={entry.output.data} />
              ) : null}
            </div>
          ) : (
            // Verbose mode: Show command and output
            <>
              <div className="command-section">
                <span className="command">{entry.command}</span>
              </div>
              <div className="output-section">
                {entry.output.message ? (
                  <span className="output">{entry.output.message}</span>
                ) : entry.output.data ? (
                  <CSVTable data={entry.output.data} />
                ) : null}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
