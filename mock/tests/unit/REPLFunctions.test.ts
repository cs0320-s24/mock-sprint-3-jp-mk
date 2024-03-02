import { expect, test } from "vitest";

import * as replFun from "../../src/components/REPLFunction";
import { StateMap } from "../../src/components/REPLInput";
import { useState } from "react";

const args: string[] = [];
const stateMap: StateMap = new StateMap();
var mode = true;
var isLoaded = true;
var currData = {};
//const [mode, setMode] = useState<Boolean>(true);

test("test: null functionality", () => {
  expect(replFun.mode(args, stateMap)).toEqual({
    message: "The functionality for this command is not currently operating.",
  });
  expect(replFun.view(args, stateMap)).toEqual({
    message: "The functionality for this command is not currently operating.",
  });
  expect(replFun.load(args, stateMap)).toEqual({
    message: "The functionality for this command is not currently operating.",
  });
  expect(replFun.search(args, stateMap)).toEqual({
    message: "The functionality for this command is not currently operating.",
  });
});

function changeModeTest(changeMode: boolean) {
  mode = changeMode;
}

function changeLoadTest(load: boolean) {
  isLoaded = load;
}

function changeDataTest(data: (string | number)[][]) {
  currData = data;
}

test("test: mode changes successfully", () => {
  stateMap.setState("mode", mode, changeModeTest);

  expect(replFun.mode(args, stateMap)).toEqual({
    message: "Mode changed to Verbose",
  });
});

test("test: load is successful", () => {
  const args: string[] = ["path1"];

  stateMap.setState("isLoaded", isLoaded, changeLoadTest);
  stateMap.setState("currData", currData, changeDataTest);

  //expect(replFun.load(args, stateMap)).toEqual({ message: "Success - File Loaded" })
});
