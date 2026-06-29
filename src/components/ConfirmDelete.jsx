import React, { useState } from 'react';
import styles from './ConfirmDelete.module.css';

export default function ConfirmDelete({ user, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(user.id); onClose(); }
    catch { setLoading(false); }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <h3 className={styles.title}>Delete User</h3>
        <p className={styles.body}>
          Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>?
          This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>Cancel</button>
          <button className={styles.deleteBtn} onClick={handleConfirm} disabled={loading}>
            {loading ? <><span className={styles.spinner}/> Deleting…</> : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
