import React from 'react';
import { PAGE_SIZE_OPTIONS } from '../utils/constants';
import styles from './Pagination.module.css';

export default function Pagination({ currentPage, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.ceil(total / pageSize);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  const pages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const arr = [];
    if (currentPage <= 4) {
      arr.push(1,2,3,4,5,'…',totalPages);
    } else if (currentPage >= totalPages - 3) {
      arr.push(1,'…',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages);
    } else {
      arr.push(1,'…',currentPage-1,currentPage,currentPage+1,'…',totalPages);
    }
    return arr;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> users
      </div>

      <div className={styles.controls}>
        <div className={styles.pageSizeWrap}>
          <label className={styles.label}>Rows</label>
          <select
            className={styles.select}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className={styles.pageButtons}>
          <button
            className={styles.navBtn}
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="First page"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
            </svg>
          </button>
          <button
            className={styles.navBtn}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous page"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {pages().map((p, i) =>
            p === '…'
              ? <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
              : <button
                  key={p}
                  className={`${styles.pageBtn} ${p === currentPage ? styles.activePage : ''}`}
                  onClick={() => onPageChange(p)}
                >{p}</button>
          )}

          <button
            className={styles.navBtn}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            title="Next page"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button
            className={styles.navBtn}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            title="Last page"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
