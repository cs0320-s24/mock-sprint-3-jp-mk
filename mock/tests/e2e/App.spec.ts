import { expect, test } from "@playwright/test";
import exp from "constants";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

// If you needed to do something before every test case...
test.beforeEach(() => {
  // ... you'd put it here.
  // TODO: Is there something we need to do before every test case to avoid repeating code?
});

/**
 * Don't worry about the "async" yet. We'll cover it in more detail
 * for the next sprint. For now, just think about "await" as something
 * you put before parts of your test that might take time to run,
 * like any interaction with the page.
 */
test("on page load, i see a login button", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Login")).toBeVisible();
});

test("on page load, i dont see the input box until login", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  // click the login button
  await page.getByLabel("Login").click();
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Command input")).toBeVisible();
});

test("after I type into the input box, its text changes", async ({ page }) => {
  // Step 1: Navigate to a URL
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Step 2: Interact with the page
  // Locate the element you are looking for
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

test("on page load, i see a button", async ({ page }) => {
  // CHANGED
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
});

test("after I click the button, its label increments", async ({ page }) => {
  // CHANGED
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.getByRole("button", { name: "Submitted 1 times" })
  ).toBeVisible();
});

test("after I click the button, my command gets pushed", async ({ page }) => {
  // CHANGED
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("Awesome command");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  // you can use page.evaulate to grab variable content from the page for more complex assertions
  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Output");
});

test("after I submit a command, I should see the output table in breif mode", async ({
  page,
}) => {
  // CHANGED
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("Awesome command");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  // you can use page.evaulate to grab variable content from the page for more complex assertions
  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Output");
});

test("Load command with valid file path", async ({ page }) => {
  await page.goto("http://localhost:8000/");

  await page.getByLabel("Login").click();

  // Enter the load command
  await page.fill('input[aria-label="Command input"]', "load path1");

  // Click the submit button
  await page.click("text=Submit");

  // Verify the success message
  const output = await page.textContent(".output");
  expect(output).toBe("Success - File Loaded");
});

test("Load command with different mocked datasets", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Test loading different mocked datasets
  for (const path of ["path1", "path2", "path3"]) {
    await page.getByLabel("Command input").fill(`load ${path}`);
    await page.getByRole("button", { name: "Submit" }).click();
    const output = await page.textContent(".output");
    expect(output).toContain("Success - File Loaded");
  }
});

test("View command displays data after loading a dataset", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Load a mocked dataset
  await page.getByLabel("Command input").fill("load path1");
  await page.getByRole("button", { name: "Submit" }).click();

  // Test the view command
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit" }).click();
  // Verify that data is displayed
  // (Adjust the selector based on your application's structure)
  const dataDisplayed = await page.isVisible("table");
  expect(dataDisplayed).toBeTruthy();
});

test("Search functionality with various criteria", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Load a dataset and perform searches
  await page.getByLabel("Command input").fill("load path1");
  await page.getByRole("button", { name: "Submit" }).click();

  // Perform search and verify results
  await page.getByLabel("Command input").fill("search true hello awesome");
  await page.getByRole("button", { name: "Submit" }).click();
  // Verify search results
  // (Adjust the selector based on your application's structure)
  const searchResultsVisible = await page.isVisible(
    ".repl-history .output-section-brief"
  );

  expect(searchResultsVisible).toBeTruthy();
});

test("after I submit a command, I should see the output table in brief mode", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.locator('button:has-text("Login")').click();
  await page
    .locator('input[aria-label="Command input"]')
    .fill("Awesome command");
  await page.locator('button:has-text("Submitted 0 times")').click();
  const firstChild = await page.textContent(
    ".repl-history .output-section-brief"
  );
  expect(firstChild).toContain("Output");
});
