export const decodeToken = (token: string | null): { email: string | null, role: string | null } => {
  if (!token) return { email: null, role: null }

  try {
    const [, payload] = token.split('.')
    if (!payload) return { email: null, role: null }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    const data = JSON.parse(json)

    const email = data.email || data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null
    const role = data.role || data['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null

    return { email, role }
  } catch (error) {
    console.error('Failed to decode token payload', error)
    return { email: null, role: null }
  }
}