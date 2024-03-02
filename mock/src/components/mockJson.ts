/**
 * NOTE: File that holds testing pre-parsed CSV's
 */

/**
 * Function retrieving the mocked inputs. Acts as "search" for the backend.
 *
 * @param index Whether the header is an index
 * @param header Whether there are headers
 * @param col The header name
 * @param target Search target
 * @returns Dataset with search
 */
export function searchMock(
  index: boolean,
  header: boolean,
  col: string,
  target: string
): (string | number)[][] {
  if (header && index) {
    return [mockSearch1];
  } else if (header && !index) {
    return [mockSearch2];
  } else if (!header) {
    return [mockSearch4];
  } else {
    return [];
  }
}

/**
 * Mocked search results for various inputs
 */
export const mockSearch1 = ["42 Thayer St", "Providence", "RI", 500000];

export const mockSearch2 = [1, 2, 3, 4];

export const mockSearch3 = ["silly", "goose", "RI", 500000];

export const mockSearch4 = ["hi", "hi", "hi", "hi"];

/**
 * a regular table with headers and multiple rows and columns
 */
export const mockedCSV1 = [
  ["address", "city", "state", "price"],
  ["42 Thayer St", "Providence", "RI", 500000],
  ["86 Charlesfield", "Providence", "RI", 600000],
  ["60 Thayer St", "Providence", "RI", 5000],
  ["72 Benefit St", "Providence", "RI", 6000],
];

/**
 * table with a row and a header
 */
export const mockedCSV2 = [
  ["address", "city", "state", "price"],
  ["silly", "goose", "RI", 500000],
];

/**
 * table with 1 row
 */
export const mockedCSV3 = [["silly", "goose", "RI", 500000]];

/**
 * table with 1 column
 */
export const mockedCSV4 = [["address"], ["42 Thayer St"]];

/**
 * table that is empty but still 2 dimensional
 */
export const mockedCSV5 = [[]];

/**
 * table that is empty - 1 dimensional
 */
export const mockedCSV6 = [[]];
