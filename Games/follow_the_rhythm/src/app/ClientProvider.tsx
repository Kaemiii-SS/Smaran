"use client";
import { LanguageProvider } from '@/lib/LanguageContext';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
