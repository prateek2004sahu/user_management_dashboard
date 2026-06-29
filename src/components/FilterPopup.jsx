import React, { useState, useRef, useEffect } from 'react';
import { DEPARTMENTS } from '../utils/constants';
import styles from './FilterPopup.module.css';

const EMPTY = { firstName: '', lastName: '', email: '', department: '' };

export default function FilterPopup({ filters, onApply, activeCount }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleApply = () => { onApply(draft); setOpen(false); };
  const handleClear = () => { setDraft(EMPTY); onApply(EMPTY); };

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={`${styles.trigger} ${activeCount > 0 ? styles.active : ''}`}
        onClick={() => { setDraft(filters); setOpen((p) => !p); }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        Filter
        {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
      </button>

      {open && (
        <div className={styles.popup}>
          <div className={styles.popupHeader}>
            <span className={styles.popupTitle}>Filter Users</span>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className={styles.fields}>
            {['firstName', 'lastName', 'email'].map((field) => (
              <div className={styles.field} key={field}>
                <label className={styles.label}>{field === 'firstName' ? 'First Name' : field === 'lastName' ? 'Last Name' : 'Email'}</label>
                <input
                  className={styles.input}
                  type="text"
                  value={draft[field]}
                  onChange={(e) => setDraft((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder={`Filter by ${field === 'firstName' ? 'first name' : field === 'lastName' ? 'last name' : 'email'}`}
                />
              </div>
            ))}
            <div className={styles.field}>
              <label className={styles.label}>Department</label>
              <select
                className={styles.input}
                value={draft.department}
                onChange={(e) => setDraft((p) => ({ ...p, department: e.target.value }))}
              >
                <option value="">All departments</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.clearBtn} onClick={handleClear}>Clear all</button>
            <button className={styles.applyBtn} onClick={handleApply}>Apply filters</button>
          </div>
        </div>
      )}
    </div>
  );
}
