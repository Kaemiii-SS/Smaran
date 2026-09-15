import React from 'react';
import './app/globals.css';
import ClientProvider from './app/ClientProvider';
import FollowTheRhythmApp from './app/page';

export default function FollowTheRhythmGame() {
  return (
    <ClientProvider>
      <FollowTheRhythmApp />
    </ClientProvider>
  );
}
