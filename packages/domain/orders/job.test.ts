import { describe, expect, test } from "bun:test";
import { canTransition, transition } from "./job";

describe("job lifecycle", () => {
  test("allows the requested -> dispatching transition", () => {
    expect(canTransition("requested", "dispatching")).toBe(true);
    expect(transition("requested", "dispatching")).toBe("dispatching");
  });

  test("rejects terminal-state resurrection", () => {
    expect(canTransition("completed", "requested")).toBe(false);
    expect(() => transition("completed", "requested")).toThrow();
  });

  test("rejects arbitrary lifecycle jumps", () => {
    expect(canTransition("requested", "completed")).toBe(false);
    expect(() => transition("requested", "completed")).toThrow();
  });
});
