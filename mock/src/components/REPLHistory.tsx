import "../styles/main.css";
// import { HistoryEntry } from "./types";
import { CSV } from "./CSV";

/**
 * Prop defining the history as the history entry type, and with a mode
 * either as brief or verbose.
 */
interface REPLHistoryProps {
  history: String[];
  mode: "brief" | "verbose";
}

export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history" aria-label="repl-history">
      {/* This is where command history will go */}
      {/* TODO: To go through all the pushed commands... try the .map() function! */}
      {/* CHANGED */}
      {props.history.map((command, index) => (
        <p>{command}</p>
      ))}
      {props.history.map((mode, index) => (
        <p>{mode}</p>
      ))}
    </div>
  );
}
