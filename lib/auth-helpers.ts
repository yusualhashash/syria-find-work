// Helper to normalize phone number to international format
export function normalizePhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, "")

  // If starts with 09, convert to 9639
  if (cleanPhone.startsWith("09")) {
    return `+963${cleanPhone.slice(1)}`
  }

  // If starts with 963, add +
  if (cleanPhone.startsWith("963")) {
    return `+${cleanPhone}`
  }

  // If starts with 9 (without country code), add +963
  if (cleanPhone.startsWith("9") && cleanPhone.length === 9) {
    return `+963${cleanPhone}`
  }

  return `+${cleanPhone}`
}

// Helper to convert phone number to email format for Supabase
export function phoneToEmail(phone: string): string {
  const normalized = normalizePhoneNumber(phone)
  // Remove + and use as email
  const cleanPhone = normalized.replace(/\D/g, "")
  return `${cleanPhone}@syriamoneyapp.local`
}

// Helper to format phone number for display
export function formatPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone)
  const cleanPhone = normalized.replace(/\D/g, "")

  if (cleanPhone.startsWith("963")) {
    // Format: +963 9XX XXX XXX
    return `+${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)} ${cleanPhone.slice(9)}`
  }

  return normalized
}
