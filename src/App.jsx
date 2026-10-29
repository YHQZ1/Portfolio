import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/useTheme";

function ScrollToTopButtonWrapper() {
  const { darkMode } = useTheme();
  return <ScrollToTopButton darkMode={darkMode} />;
}

function PageWithLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <ScrollToTopButtonWrapper />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Cursor />
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <PageWithLayout>
                <Profile />
              </PageWithLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PageWithLayout>
                <About />
              </PageWithLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PageWithLayout>
                <Contact />
              </PageWithLayout>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
