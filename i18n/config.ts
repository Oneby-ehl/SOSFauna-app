export type LanguageFeatures = Readonly<{
  englishPublished: boolean;
  selectorEnabled: boolean;
  automaticRedirectEnabled: boolean;
}>;

// Enable only after the corresponding English pages and offline export are ready.
export const languageFeatures: LanguageFeatures = Object.freeze({
  englishPublished: true,
  selectorEnabled: true,
  automaticRedirectEnabled: true,
});
