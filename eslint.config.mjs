import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const browserGlobals = {
  AbortController: "readonly",
  Blob: "readonly",
  CustomEvent: "readonly",
  File: "readonly",
  FileReader: "readonly",
  Request: "readonly",
  Response: "readonly",
  TextEncoder: "readonly",
  URL: "readonly",
  console: "readonly",
  crypto: "readonly",
  document: "readonly",
  fetch: "readonly",
  process: "readonly",
  window: "readonly"
};

export default [
  {
    ignores: [".astro/**", ".next/**", ".agents/**", ".kilo/**", "node_modules/**", "backend/**", "plugins/**", "scripts/**", "dist/**", "_archive/**", "report/**", "docs/**", "kernel/**", "public/**", "demo/**", "vitest.config.js"]
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx,js,jsx}", "components/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      },
      globals: browserGlobals
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-console": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/triple-slash-reference": "off"
    }
  }
];