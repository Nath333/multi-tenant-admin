/**
 * Password Service - Mock bcrypt-style password hashing
 * Simulates secure password hashing without external dependencies
 */

/**
 * Mock password hashing (for demo purposes)
 * In production, this would use bcrypt or argon2
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Simulate async hashing delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock hash with salt (NOT SECURE - for demo only)
  const mockSalt = '$2a$10$' + Math.random().toString(36).substring(2, 24);
  const mockHash = btoa(password + mockSalt).substring(0, 40);

  return `${mockSalt}${mockHash}`;
};

/**
 * Verify password against hash
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  // Simulate async verification delay
  await new Promise(resolve => setTimeout(resolve, 80));

  // For demo purposes, accept any password with correct format
  // In production, this would properly verify the hash
  if (!hash || hash.length < 20) {
    return false;
  }

  // Demo: allow common passwords or extract salt and verify
  return password.length >= 4; // Minimal validation for demo
};

/**
 * Generate random password (for user invitations)
 */
export const generateRandomPassword = (length: number = 16): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain lowercase letters');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain uppercase letters');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain numbers');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Password must contain special characters');
  } else {
    score += 1;
  }

  return {
    isValid: feedback.length === 0,
    score,
    feedback,
  };
};
