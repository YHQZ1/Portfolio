import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

function Boom({ explode }: { explode: boolean }) {
  if (explode) throw new Error("boom");
  return <p>All good</p>;
}

function Harness() {
  const [key, setKey] = useState("a");
  return (
    <>
      <button onClick={() => setKey("b")}>navigate</button>
      <ErrorBoundary resetKey={key}>
        <Boom explode={key === "a"} />
      </ErrorBoundary>
    </>
  );
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders its children when nothing fails", () => {
    render(
      <ErrorBoundary>
        <Boom explode={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("All good")).toBeTruthy();
  });

  it("shows a reload prompt when a child throws", () => {
    render(
      <ErrorBoundary>
        <Boom explode />
      </ErrorBoundary>
    );

    expect(screen.getByText(/failed to load/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /reload page/i })).toBeTruthy();
  });

  it("recovers when the reset key changes", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.getByText(/failed to load/i)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "navigate" }));

    expect(await screen.findByText("All good")).toBeTruthy();
  });
});
