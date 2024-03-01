import React from "react";
import { HistoryEntry, OutputContent } from "./types";

interface REPLHistoryProps {
  history: HistoryEntry[];
  mode: Boolean;
}

// Modified CSVTable component to handle the new data structure
const CSVTable = ({ data }: { data: (string | number)[][] }) => {
  if (!data || data.length === 0) return null;

  // Assuming the first row contains headers
  const headers = data[0];
  const [,...rows] = data; // All rows except the header row

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

export function REPLHistory({ history, mode = true }: REPLHistoryProps) {
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
