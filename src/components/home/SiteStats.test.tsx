import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SiteStats from "./SiteStats";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  window.localStorage.clear();
});

const respond = (body: unknown, ok = true) =>
  fetchMock.mockResolvedValue({ ok, json: async () => body });

describe("SiteStats", () => {
  it("registers the first visit of the day and shows the totals", async () => {
    respond({ visitors: 1284, countries: 23, since: "2026-11-06" });

    render(<SiteStats />);

    expect(await screen.findByText("Visitors")).toBeTruthy();
    expect(await screen.findByText(/1,284/)).toBeTruthy();
    expect(screen.getByText("23 countries · since Nov 2026")).toBeTruthy();
    expect(fetchMock.mock.calls[0][1].method).toBe("POST");
  });

  it("only reads the totals on later visits the same day", async () => {
    respond({ visitors: 5, countries: 1, since: null });
    const first = render(<SiteStats />);
    await screen.findByText("5");
    first.unmount();

    fetchMock.mockClear();
    render(<SiteStats />);
    await screen.findByText("5");

    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
  });

  it("shows nothing when the counter is unavailable", async () => {
    respond({ error: "not_configured" }, false);

    const { container } = render(<SiteStats />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container.textContent).toBe("");
  });

  it("ignores unexpected responses", async () => {
    respond({ contributions: [] });

    const { container } = render(<SiteStats />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container.textContent).toBe("");
  });
});
