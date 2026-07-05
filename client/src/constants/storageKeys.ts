/** Central registry of every localStorage key the app touches, so keys
 * never drift or collide between features. */
export const STORAGE_KEYS = {
  chatMessages: "gurukul:messages:v1",
  themeMode: "gurukul.themeMode",
} as const;
