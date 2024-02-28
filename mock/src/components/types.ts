// Type denoting the types of output as a message or data
export type OutputContent = {
  message?: string;
  data?: (string | number)[][];
};

// inputs for the history as a command or output content
export type HistoryEntry = {
  command: string;
  output: OutputContent;
};
