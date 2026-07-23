import { JWTPayload } from './auth';

export type SystemRole =
  | 'SUPER_ADMIN'
  | 'PROGRAMME_DIRECTOR'
  | 'OPERATIONS_MANAGER'
  | 'LMS_ADMIN'
  | 'PROGRAMME_MANAGER'
  | 'PROGRAMME_COORDINATOR'
  | 'FACILITATOR'
  | 'ASSESSOR'
  | 'FINANCE_OFFICER'
  | 'MARKETING_USER'
  | 'CORPORATE_ADMIN'
  | 'LEARNER'
  | 'SUPPORT_AGENT';

export function hasRole(user: JWTPayload | null, allowedRoles: SystemRole[]): boolean {
  if (!user || !user.roles) return false;
  if (user.roles.includes('SUPER_ADMIN')) return true;
  return allowedRoles.some((role) => user.roles.includes(role));
}

export function isCorporateAdmin(user: JWTPayload | null, orgId?: string): boolean {
  if (!user) return false;
  if (user.roles.includes('SUPER_ADMIN')) return true;
  if (!user.roles.includes('CORPORATE_ADMIN')) return false;
  if (orgId && user.organisationId !== orgId) return false;
  return true;
}

export function canManageFinance(user: JWTPayload | null): boolean {
  return hasRole(user, ['SUPER_ADMIN', 'PROGRAMME_DIRECTOR', 'FINANCE_OFFICER']);
}

export function canGradeAssessments(user: JWTPayload | null): boolean {
  return hasRole(user, ['SUPER_ADMIN', 'PROGRAMME_DIRECTOR', 'FACILITATOR', 'ASSESSOR']);
}

export function canManageCourses(user: JWTPayload | null): boolean {
  return hasRole(user, ['SUPER_ADMIN', 'PROGRAMME_DIRECTOR', 'LMS_ADMIN', 'PROGRAMME_MANAGER']);
}
