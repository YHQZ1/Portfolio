import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../context/ThemeContext";
import About from "./About";
import Contact from "./Contact";
import Home from "./Home";
import NotFound from "./NotFound";
import ProjectDetail from "./ProjectDetail";

const contactApi = vi.fn();

function renderAt(path: string, ui?: ReactNode) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {ui}
      </MemoryRouter>
    </ThemeProvider>
  );
}

beforeEach(() => {
  contactApi.mockReset();
  contactApi.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, init?: RequestInit) =>
      url === "/api/contact"
        ? contactApi(url, init)
        : Promise.resolve({
            ok: true,
            json: async () => ({
              contributions: [
                { date: "2026-10-01", count: 3, level: 2 },
                { date: "2026-10-02", count: 0, level: 0 },
                { date: "2026-10-03", count: 1, level: 1 },
              ],
            }),
          })
    )
  );
});

describe("Home", () => {
  it("renders the main sections and the activity stats", async () => {
    renderAt("/");

    for (const heading of [
      "Smaller Builds",
      "Technical Skills",
      "Tools & Workflow",
      "Activity",
    ]) {
      expect(
        screen.getByRole("heading", { name: new RegExp(heading) })
      ).toBeTruthy();
    }

    expect(await screen.findByText("Longest streak")).toBeTruthy();
  });

  it("links to the four selected projects", () => {
    renderAt("/");

    const links = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    for (const slug of ["kprobe", "esx", "provenance", "hatch"]) {
      expect(links).toContain(`/projects/${slug}`);
    }
  });
});

describe("About", () => {
  it("renders the statement, competencies and both timelines", () => {
    renderAt("/about");

    expect(
      screen.getByRole("heading", { level: 1, name: /Drawn to the parts/ })
    ).toBeTruthy();
    expect(screen.getByText("Core Competencies")).toBeTruthy();
    expect(screen.getByText("Work Experience")).toBeTruthy();
    expect(screen.getByText("Beyond the Code")).toBeTruthy();
    expect(
      screen.getAllByText("Software Engineer Intern").length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("President").length).toBeGreaterThan(0);
  });
});

describe("Project detail", () => {
  it("renders a selected project with its diagram and code link", () => {
    renderAt("/projects/kprobe");

    expect(
      screen.getByRole("heading", { level: 1, name: "kprobe" })
    ).toBeTruthy();
    expect(
      screen.getByRole("img", { name: /architecture diagram/i })
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: /source code on github/i })
        .getAttribute("href")
    ).toMatch(/github\.com\/YHQZ1\/kprobe/);
  });

  it("shows the 404 page for an unknown or non-selected project", () => {
    const { unmount } = renderAt("/projects/does-not-exist");
    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeTruthy();
    unmount();

    renderAt("/projects/trixie");
    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeTruthy();
  });
});

describe("Not found", () => {
  it("offers a way back home", () => {
    renderAt("/anything-else");

    expect(
      screen.getByRole("link", { name: /back home/i }).getAttribute("href")
    ).toBe("/");
  });
});

describe("Contact form", () => {
  it("keeps the send button disabled until the form is valid", async () => {
    const user = userEvent.setup();
    renderAt("/contact");

    const button = screen.getByRole("button", { name: /send message/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);

    await user.type(screen.getByLabelText(/your name/i), "Ada");
    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.type(screen.getByLabelText(/your message/i), "Hello");
    expect((button as HTMLButtonElement).disabled).toBe(true);

    await user.clear(screen.getByLabelText(/email address/i));
    await user.type(screen.getByLabelText(/email address/i), "ada@example.com");
    expect((button as HTMLButtonElement).disabled).toBe(false);
  });

  it("sends the message and shows a confirmation", async () => {
    const user = userEvent.setup();
    renderAt("/contact");

    await user.type(screen.getByLabelText(/your name/i), "Ada");
    await user.type(screen.getByLabelText(/email address/i), "ada@example.com");
    await user.type(screen.getByLabelText(/your message/i), "Hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    const status = await screen.findByRole("status");
    expect(within(status).getByText(/thank you/i)).toBeTruthy();

    expect(contactApi).toHaveBeenCalledTimes(1);
    const [url, init] = contactApi.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init.body)).toMatchObject({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello there",
      website: "",
    });

    expect(
      (screen.getByLabelText(/your name/i) as HTMLInputElement).value
    ).toBe("");
  });

  it("shows an error with a fallback email when sending fails", async () => {
    contactApi.mockResolvedValue({ ok: false, status: 502 });
    const user = userEvent.setup();
    renderAt("/contact");

    await user.type(screen.getByLabelText(/your name/i), "Ada");
    await user.type(screen.getByLabelText(/email address/i), "ada@example.com");
    await user.type(screen.getByLabelText(/your message/i), "Hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    const alert = await screen.findByRole("alert");
    await waitFor(() => expect(within(alert).getByRole("link")).toBeTruthy());
    expect(
      (screen.getByLabelText(/your name/i) as HTMLInputElement).value
    ).toBe("Ada");
  });
});
