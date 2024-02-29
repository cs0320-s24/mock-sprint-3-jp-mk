import "../styles/main.css";
// import { HistoryEntry } from "./types";
import { CSV } from "./CSV";
import { HistoryEntry } from "../types";
import { OutputContent } from "../types";

/**
 * Prop defining the history as the history entry type, and with a mode
 * either as brief or verbose.
 */
interface REPLHistoryProps {
  history: HistoryEntry[];
  mode: "brief" | "verbose";
}

export function REPLHistory({ history, mode = "brief" }: REPLHistoryProps) {
  return (
    <div className="repl-history" aria-label="repl-history">
      {/* This is where command history will go */}
      {/* TODO: To go through all the pushed commands... try the .map() function! */}
      {/* CHANGED */}
      {history.map((entry, index) =>
        mode === "verbose" ? (
          <div key={index}>
            <span className="label">Command:</span>{" "}
            <span className="command">{entry.command}</span>
            <br />
            <span className="label">Output:</span>
            {/* output is a message */}
            {entry.output.message ? (
              <span className="output">{entry.output.message}</span>
            ) : (
              <span className="table">
                {/* output is a non null table */}
                <CSV data={entry.output.data!} />
              </span>
            )}
          </div>
        ) : (
          <p key={index}>
            {entry.output.message ? (
              <span className="output">{entry.output.message}</span>
            ) : (
              <span className="table">
                <CSV data={entry.output.data!} />
              </span>
            )}
          </p>
        )
      )}
    </div>
  );
}
