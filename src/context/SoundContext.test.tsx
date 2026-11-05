import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SoundProvider } from "./SoundContext";
import { useSound } from "./useSound";

const created = { oscillators: 0, contexts: 0 };

class FakeAudioContext {
  state = "running";
  currentTime = 0;
  destination = {};

  constructor() {
    created.contexts += 1;
  }

  resume() {
    return Promise.resolve();
  }

  createGain() {
    return {
      gain: {
        value: 1,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }

  createOscillator() {
    created.oscillators += 1;
    return {
      type: "sine",
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }
}

function Probe() {
  const { enabled, toggle, play } = useSound();
  return (
    <>
      <button onClick={toggle}>{enabled ? "on" : "off"}</button>
      <button onClick={() => play("fail")}>fail</button>
      <button onClick={() => play("tick", { level: 3 })}>tick</button>
    </>
  );
}

const renderProbe = () =>
  render(
    <SoundProvider>
      <Probe />
    </SoundProvider>
  );

describe("sound", () => {
  beforeEach(() => {
    created.oscillators = 0;
    created.contexts = 0;
    vi.stubGlobal("AudioContext", FakeAudioContext);
    Object.defineProperty(navigator, "userActivation", {
      configurable: true,
      value: { hasBeenActive: true },
    });
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is off by default and makes no noise until it is turned on", async () => {
    const user = userEvent.setup();
    renderProbe();

    expect(screen.getByRole("button", { name: "off" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "fail" }));
    expect(created.oscillators).toBe(0);
  });

  it("turns on, confirms with a sound and remembers the choice", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "off" }));

    expect(screen.getByRole("button", { name: "on" })).toBeTruthy();
    expect(localStorage.getItem("sound")).toBe("on");
    expect(created.oscillators).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "on" }));
    expect(localStorage.getItem("sound")).toBe("off");
  });

  it("starts on when it was left on last time", () => {
    localStorage.setItem("sound", "on");
    renderProbe();

    expect(screen.getByRole("button", { name: "on" })).toBeTruthy();
  });

  it("plays sounds once enabled", async () => {
    localStorage.setItem("sound", "on");
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "fail" }));

    expect(created.oscillators).toBe(1);
  });

  it("does not play in a background tab", async () => {
    localStorage.setItem("sound", "on");
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "fail" }));

    expect(created.oscillators).toBe(0);
  });

  it("stays silent until the person has interacted with the page", async () => {
    localStorage.setItem("sound", "on");
    Object.defineProperty(navigator, "userActivation", {
      configurable: true,
      value: { hasBeenActive: false },
    });
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "fail" }));

    expect(created.oscillators).toBe(0);
  });

  it("limits how fast ticks can fire while scrubbing", async () => {
    localStorage.setItem("sound", "on");
    const clock = vi.spyOn(performance, "now");
    const user = userEvent.setup();
    renderProbe();

    clock.mockReturnValue(10_000);
    await user.click(screen.getByRole("button", { name: "tick" }));
    clock.mockReturnValue(10_010);
    await user.click(screen.getByRole("button", { name: "tick" }));
    clock.mockReturnValue(10_020);
    await user.click(screen.getByRole("button", { name: "tick" }));

    expect(created.oscillators).toBe(1);

    clock.mockReturnValue(10_200);
    await user.click(screen.getByRole("button", { name: "tick" }));

    expect(created.oscillators).toBe(2);
    clock.mockRestore();
  });
});
