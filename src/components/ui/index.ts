/**
 * BrightAI UI Kit — Canonical components.
 *
 * هذا الـ barrel يسهّل الاستيراد من الصفحات:
 *   import { Button, Card, SectionHeading } from '../components/ui';
 *
 * المكونات هنا مكملة للأنماط الموجودة في components.css — لا تحل محلها.
 * كل component يحترم tokens (لا raw colors) + prefers-reduced-motion + RTL.
 */
export { default as Button } from './Button.astro';
export { default as Card } from './Card.astro';
export { default as SectionHeading } from './SectionHeading.astro';
