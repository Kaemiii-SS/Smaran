"use client";
import { LanguageProvider } from '@/lib/LanguageContext';

export default function ClientProvider({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
