import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Navbar from "./Navbar";

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe("mobile menu", () => {
  it("opens, locks page scroll and closes with Escape", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    await user.click(toggle);

    expect(
      screen
        .getByRole("button", { name: "Close menu" })
        .getAttribute("aria-expanded")
    ).toBe("true");
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes after choosing a page", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const links = screen.getAllByRole("link", { name: "About" });
    await user.click(links[links.length - 1]);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("");
  });
});
