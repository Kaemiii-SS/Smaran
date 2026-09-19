import { I18nProvider } from './i18nContext';
import App from './App';

export default function NameGameEntry() {
  return (
    <I18nProvider>
      <App />
    </I18nProvider>
  );
}
