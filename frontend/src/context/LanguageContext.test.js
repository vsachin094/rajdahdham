import { languageForLocation } from './LanguageContext';

describe('languageForLocation', () => {
  test('selects Hindi for visitors located in Jharkhand, India', () => {
    expect(languageForLocation({ country_code: 'IN', region: 'Jharkhand' })).toBe('hi');
  });

  test('selects English for visitors outside Jharkhand', () => {
    expect(languageForLocation({ country_code: 'IN', region: 'Bihar' })).toBe('en');
    expect(languageForLocation({ country_code: 'US', region: 'Jharkhand' })).toBe('en');
  });

  test('handles missing or malformed location data', () => {
    expect(languageForLocation(null)).toBe('en');
    expect(languageForLocation({ country_code: 91, region: null })).toBe('en');
  });
});
