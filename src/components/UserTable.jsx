import React from 'react';
import styles from './UserTable.module.css';

const COLUMNS = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'firstName', label: 'First Name', sortable: true },
  { key: 'lastName', label: 'Last Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];

const DEPT_COLORS = {
  Engineering: '#6366f1', Marketing: '#ec4899', Sales: '#f59e0b',
  HR: '#22c55e', Finance: '#06b6d4', Design: '#a855f7',
  IT: '#3b82f6', Operations: '#f97316',
};

export default function UserTable({ users, sortField, sortOrder, onSort, onEdit, onDelete, loading }) {
  const SortIcon = ({ field }) => {
    if (sortField !== field) return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3">
        <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
      </svg>
    );
    return sortOrder === 'asc'
      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>
      : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>;
  };

  if (loading) return (
    <div className={styles.loadingWrap}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeleton} style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );

  if (!users.length) return (
    <div className={styles.empty}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
      <p>No users found</p>
      <span>Try adjusting your search or filters</span>
    </div>
  );

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${col.sortable ? styles.sortable : ''} ${sortField === col.key ? styles.active : ''}`}
                onClick={col.sortable ? () => onSort(col.key) : undefined}
              >
                <span>{col.label}</span>
                {col.sortable && <SortIcon field={col.key} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={styles.row}>
              <td className={styles.td}>
                <span className={styles.idBadge}>#{user.id}</span>
              </td>
              <td className={styles.td}>{user.firstName}</td>
              <td className={styles.td}>{user.lastName}</td>
              <td className={styles.td}>
                <a className={styles.email} href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td className={styles.td}>
                <span
                  className={styles.dept}
                  style={{ '--dept-color': DEPT_COLORS[user.department] || '#6366f1' }}
                >
                  {user.department}
                </span>
              </td>
              <td className={styles.td}>
                <div className={styles.actionBtns}>
                  <button className={styles.editBtn} onClick={() => onEdit(user)} title="Edit user">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button className={styles.deleteBtn} onClick={() => onDelete(user)} title="Delete user">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
