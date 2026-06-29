import { DEPARTMENTS } from './constants';

/** Split "Leanne Graham" → { firstName: "Leanne", lastName: "Graham" } */
export const splitName = (fullName = '') => {
  const parts = fullName.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
};

/** Assign a deterministic department from the user id */
export const assignDepartment = (id) =>
  DEPARTMENTS[(id - 1) % DEPARTMENTS.length];

/** Map raw JSONPlaceholder user → app user shape */
export const mapApiUser = (apiUser) => {
  const { firstName, lastName } = splitName(apiUser.name);
  return {
    id: apiUser.id,
    firstName,
    lastName,
    email: apiUser.email,
    department: assignDepartment(apiUser.id),
  };
};

/** Generate a new local id (for POST-simulated users) */
export const generateId = (users) =>
  users.length ? Math.max(...users.map((u) => u.id)) + 1 : 11;
