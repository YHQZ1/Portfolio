import { Suspense, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import ScrollToTopButton from "./ScrollToTopButton";
import Navbar from "./nav/Navbar";

export default function PageLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <>
      <Navbar />
      <ErrorBoundary resetKey={pathname}>
        <Suspense fallback={<div className="min-h-screen bg-bg" />}>
          {children}
        </Suspense>
      </ErrorBoundary>
      <ScrollToTopButton />
    </>
  );
}
