import { renderToString } from "react-dom/server";
import { Counter } from "./Counter";
import { expect, test } from "vitest";

test("renders with initial value", () => {
  let html = renderToString(<Counter initialValue={7}/>);
  expect(html).toMatch(/7/);
});
