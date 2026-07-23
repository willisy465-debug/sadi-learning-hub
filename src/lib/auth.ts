import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { signToken, verifyToken, JWTPayload } from './token';
export { signToken, verifyToken };
export type { JWTPayload };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('sadi_token')?.value;
    if (!token) return null;
    const user = await verifyToken(token);
    if (!user) return null;

    return {
      ...user,
      firstName: user.firstName || 'User',
      lastName: user.lastName || '',
      roles: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : ['LEARNER'],
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function setAuthCookie(payload: JWTPayload) {
  const token = await signToken(payload);
  cookies().set('sadi_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  return token;
}

export async function clearAuthCookie() {
  cookies().delete('sadi_token');
}

export async function logAuditEvent(
  actorEmail: string,
  action: string,
  entityType: string,
  details?: string,
  actorId?: string,
  entityId?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        actorEmail,
        action,
        entityType,
        entityId,
        details,
      },
    });
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}
