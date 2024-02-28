import "../styles/main.css";
import { HistoryEntry } from "./types";
import { CSV } from "./CSV";

/**
 * Prop defining the history as the history entry type, and with a mode
 * either as brief or verbose.
 */
interface REPLHistoryProps {
  history: HistoryEntry[];
  mode: "brief" | "verbose";
}
export function REPLHistory({ history, mode }: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {history.map((entry, index) =>
        /**
         *  Verbose
         */
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
          /**
           *  Brief
           */
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
