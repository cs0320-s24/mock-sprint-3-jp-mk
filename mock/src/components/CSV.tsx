import React from "react";
/**
 * Formatting for the CSV table and how the data is mapped
 *
 * @param data 2D Data passed in to create the table
 * @returns A dataset in the CSVTable format
 */
export function CSV({ data }: { data: (string | number)[][] }) {
  return (
    <table>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
