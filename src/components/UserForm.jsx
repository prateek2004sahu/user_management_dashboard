import React, { useState, useEffect } from 'react';
import { DEPARTMENTS } from '../utils/constants';
import { validateUserForm } from '../utils/validators';
import styles from './UserForm.module.css';

const EMPTY = { firstName: '', lastName: '', email: '', department: '' };

export default function UserForm({ user, onSave, onClose, loading }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState(isEdit ? { ...user } : EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(isEdit ? { ...user } : EMPTY);
    setErrors({});
  }, [user]);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validateUserForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      setErrors({ _global: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.modalIcon}>
              {isEdit
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              }
            </div>
            <h2>{isEdit ? 'Edit User' : 'Add New User'}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {errors._global && <div className={styles.globalError}>{errors._global}</div>}

          <div className={styles.row2}>
            <Field label="First Name" error={errors.firstName}>
              <input className={`${styles.input} ${errors.firstName ? styles.inputErr : ''}`}
                value={form.firstName} onChange={set('firstName')} placeholder="e.g. Priya" />
            </Field>
            <Field label="Last Name" error={errors.lastName}>
              <input className={`${styles.input} ${errors.lastName ? styles.inputErr : ''}`}
                value={form.lastName} onChange={set('lastName')} placeholder="e.g. Sharma" />
            </Field>
          </div>

          <Field label="Email Address" error={errors.email}>
            <input className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
              type="email" value={form.email} onChange={set('email')} placeholder="priya@company.com" />
          </Field>

          <Field label="Department" error={errors.department}>
            <select className={`${styles.input} ${errors.department ? styles.inputErr : ''}`}
              value={form.department} onChange={set('department')}>
              <option value="">Select a department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={submitting}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? <><span className={styles.spinner}/> Saving…</>
              : isEdit ? 'Save Changes' : 'Add User'
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</label>
      {children}
      {error && <span style={{ fontSize:11, color:'var(--danger)' }}>{error}</span>}
    </div>
  );
}
