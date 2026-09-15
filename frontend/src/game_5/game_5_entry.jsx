import React from 'react';
import './src/index.css';
import App from './src/App';
import { ThemeProvider } from './src/components/theme-provider';

export default function Game5Entry() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="game5-container min-h-screen">
        <App />
      </div>
    </ThemeProvider>
  );
}
