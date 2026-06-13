import { SITE, type HreflangLink, type SupportedLang } from './site';

export interface I18nPair {
  arabic: string;
  english: string;
}

export const LEGAL_I18N_PAIRS = [
  { arabic: '/privacy-policy/', english: '/en/privacy-policy/' },
  { arabic: '/cookie-policy/', english: '/en/cookie-policy/' },
  { arabic: '/terms/', english: '/en/terms/' },
  { arabic: '/pdpl-statement/', english: '/en/pdpl-statement/' },
  { arabic: '/data-processing-agreement/', english: '/en/data-processing-agreement/' },
] as const satisfies readonly I18nPair[];

export function getLanguageCounterpart(route: string): string | undefined {
  const pair = LEGAL_I18N_PAIRS.find(({ arabic, english }) => arabic === route || english === route);
  if (!pair) return undefined;
  return pair.arabic === route ? pair.english : pair.arabic;
}

export function getLegalAlternates(route: string, lang: SupportedLang): HreflangLink[] {
  const counterpart = getLanguageCounterpart(route);
  const arabicRoute = lang === 'ar' ? route : counterpart;
  const englishRoute = lang === 'en' ? route : counterpart;

  const links: HreflangLink[] = [];
  if (arabicRoute) links.push({ lang: 'ar-SA', href: `${SITE.url}${arabicRoute}` });
  if (englishRoute) links.push({ lang: 'en-SA', href: `${SITE.url}${englishRoute}` });
  if (arabicRoute) links.push({ lang: 'x-default', href: `${SITE.url}${arabicRoute}` });
  return links;
}

