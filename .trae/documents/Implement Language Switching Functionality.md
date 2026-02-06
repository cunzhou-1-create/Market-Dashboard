## Implementation Plan for Language Switching

### 1. Add Language State Management
- Add `language` state to `AppContext.jsx` with default value 'en'
- Add `setLanguage` function to update language preference
- Store language preference in localStorage

### 2. Create Language Translation Files
- Create `src/i18n/` directory
- Create `en.js` and `zh.js` translation files with key-value pairs for all UI texts
- Include translations for Account Settings page elements

### 3. Implement Language Selector Component
- Create `LanguageSelector.jsx` component for the language selection modal
- Add Chinese language option alongside English
- Style the component to match the existing design system

### 4. Update Settings Component
- Modify the Language section in `Settings.jsx` to show current language
- Add click handler to open language selector modal
- Update UI to reflect selected language

### 5. Add Translation Hook
- Create `useTranslation.js` hook to access translations
- Implement simple translation function that returns text based on current language

### 6. Update UI Texts
- Replace hardcoded English texts with translation function calls
- Ensure all UI elements on Account Settings page are translatable

### 7. Test Language Switching
- Verify that language changes persist after page refresh
- Test that all UI elements update correctly when switching languages
- Ensure the design maintains consistency across both languages

This implementation will provide a static interface for language switching first, with the foundation to integrate API calls later when they become available.