export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// DEPRECATED: This OAuth portal system is not used
// The app uses Supabase authentication instead
// This function is kept for backward compatibility but should not be called
export const getLoginUrl = () => {
  console.warn('[Auth] getLoginUrl() is deprecated - use Supabase authentication instead');
  return "/"; // Return home page instead of OAuth portal
};
