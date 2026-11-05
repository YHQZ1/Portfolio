import { lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import PageLayout from "./components/layout/PageLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
import { SoundProvider } from "./context/SoundContext";
import { ThemeProvider } from "./context/ThemeContext";

const loadProjectDetail = () => import("./pages/ProjectDetail");
const loadAbout = () => import("./pages/About");
const loadContact = () => import("./pages/Contact");

const ProjectDetail = lazy(loadProjectDetail);
const About = lazy(loadAbout);
const Contact = lazy(loadContact);
const NotFound = lazy(() => import("./pages/NotFound"));

// Warm the other routes once the landing page is idle so navigation feels instant.
function usePrefetchRoutes() {
  useEffect(() => {
    const prefetch = () => {
      void loadAbout();
      void loadContact();
      void loadProjectDetail();
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(prefetch, 2000);
    return () => window.clearTimeout(id);
  }, []);
}

export default function App() {
  usePrefetchRoutes();

  return (
    <SoundProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <PageLayout>
                  <Home />
                </PageLayout>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <PageLayout>
                  <ProjectDetail />
                </PageLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PageLayout>
                  <About />
                </PageLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PageLayout>
                  <Contact />
                </PageLayout>
              }
            />

            <Route
              path="*"
              element={
                <PageLayout>
                  <NotFound />
                </PageLayout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </SoundProvider>
  );
}
