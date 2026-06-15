import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import frTranslations from '../traduction/fr.json';
import enTranslations from '../traduction/en.json';

type Locale = 'fr' | 'en' | string;

interface LocalizationContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

interface LocalizationProviderProps {
  defaultLocale?: Locale;
  children: ReactNode;
  translations?: Record<Locale, Record<string, string>>;
}

const defaultTranslations: Record<Locale, Record<string, string>> = {
  fr: frTranslations,
  en: enTranslations,
};

export function LocalizationProvider({
  defaultLocale = 'fr',
  children,
  translations = defaultTranslations,
}: LocalizationProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string) => translations[locale]?.[key] ?? key,
    }),
    [locale, translations],
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
