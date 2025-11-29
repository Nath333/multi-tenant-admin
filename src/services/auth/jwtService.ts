/**
 * JWT Service - Mock JWT token generation and validation
 * Simulates secure JWT with tenant context embedding
 */

// Mock JWT implementation (browser-safe, no crypto dependencies)
interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = 'mock-secret-key-for-demo-purposes-only';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a mock JWT token with tenant context
 */
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const now = Date.now();
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_EXPIRY,
  };

  // Mock JWT: base64 encode the payload
  // In production, this would use proper JWT signing
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(fullPayload));
  const signature = btoa(`${header}.${body}.${JWT_SECRET}`);

  return `${header}.${body}.${signature}`;
};

/**
 * Decode and validate a JWT token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1])) as JWTPayload;

    // Check expiration
    if (payload.exp < Date.now()) {
      console.warn('Token expired');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

/**
 * Extract tenant ID from token
 */
export const getTenantFromToken = (token: string): string | null => {
  const payload = verifyToken(token);
  return payload?.tenantId || null;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = verifyToken(token);
  if (!payload) return true;
  return payload.exp < Date.now();
};

/**
 * Refresh token (generate new with extended expiry)
 */
export const refreshToken = (token: string): string | null => {
  const payload = verifyToken(token);
  if (!payload) return null;

  return generateToken({
    userId: payload.userId,
    tenantId: payload.tenantId,
    email: payload.email,
    role: payload.role,
  });
};
