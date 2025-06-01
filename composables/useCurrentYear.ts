/**
 * Returns the current year from the server
 * @returns The current year as a number
 */
export default function useCurrentYear() {
  return new Date().getFullYear()
}
