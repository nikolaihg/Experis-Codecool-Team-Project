import type { JwtClaims } from "../../types"

export const decodeToken = (token: string | null): JwtClaims | null => {
  if (!token || typeof token !== "string") return null

  try {
    const parts = token.split(".")
    if (parts.length < 2) return null

    const payload = parts[1]

    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

    // safe decode (handles unicode)
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )

    return JSON.parse(json)
  } catch (error) {
    console.error("Failed to decode token payload", error)
    return null
  }
}