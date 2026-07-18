import { ROLES, type Role } from 'designsight-shared';

// No accounts — a visitor's name and "commenting as" role are self-declared once per
// browser and remembered in localStorage, purely for not re-typing them on every reply.
const NAME_KEY = 'designsight:name';
const ROLE_KEY = 'designsight:role';

export function getStoredName(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(NAME_KEY) ?? '';
}

export function setStoredName(name: string) {
  window.localStorage.setItem(NAME_KEY, name);
}

export function getStoredRole(): Role {
  if (typeof window === 'undefined') return 'designer';
  const value = window.localStorage.getItem(ROLE_KEY);
  return (ROLES as readonly string[]).includes(value ?? '') ? (value as Role) : 'designer';
}

export function setStoredRole(role: Role) {
  window.localStorage.setItem(ROLE_KEY, role);
}
