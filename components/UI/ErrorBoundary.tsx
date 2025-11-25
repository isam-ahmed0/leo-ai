'use client';
import React, { Component, ErrorInfo } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorLog: string;
  isFixing: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorLog: '', isFixing: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorLog: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LEO System Crash:", error, errorInfo);
    this.initiateSelfRepair(error.message);
  }

  async initiateSelfRepair(log: string) {
    this.setState({ isFixing: true });
    
    // In a real app, this calls a separate AI endpoint specifically configured in settings
    // to analyze the error and return a "patch" or suggested config change.
    
    setTimeout(() => {
        // Simulating a fix
        console.log("LEO Fixer: Applied patch for", log);
        this.setState({ isFixing: false, hasError: false });
        window.location.reload(); 
    }, 3000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-red-500 font-mono">
          <Loader2 className="animate-spin mb-4" size={48} />
          <h2 className="text-xl uppercase tracking-widest">System Failure Detected</h2>
          <p className="text-red-500/50 mt-2">LEO Autonomous Fixer Engaging...</p>
          <div className="mt-4 p-4 bg-red-950/30 border border-red-500/20 rounded max-w-lg overflow-hidden">
            <code className="text-xs">{this.state.errorLog}</code>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
