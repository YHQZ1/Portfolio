import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  resetKey?: string;
}

interface ErrorBoundaryState {
  failed: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  componentDidUpdate(previous: ErrorBoundaryProps) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-5 text-center">
        <p className="eyebrow mb-6">Something went wrong</p>
        <h1 className="max-w-xl text-3xl leading-[1.2] font-extralight tracking-tight text-fg sm:text-5xl">
          This page failed to load.
        </h1>
        <p className="mt-6 max-w-md text-base leading-[1.8] text-muted">
          The site may have been updated while this tab was open. Reloading
          usually fixes it.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-10 cursor-pointer border border-fg px-8 py-3.5 text-sm text-fg transition-colors duration-200 hover:bg-fg hover:text-bg"
        >
          Reload page
        </button>
      </main>
    );
  }
}
