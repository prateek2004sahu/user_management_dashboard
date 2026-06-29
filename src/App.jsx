import React, { useState, useMemo } from 'react';
import { useUsers } from './hooks/useUsers';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPopup from './components/FilterPopup';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import UserForm from './components/UserForm';
import ConfirmDelete from './components/ConfirmDelete';
import Toast from './components/Toast';
import styles from './App.module.css';

const EMPTY_FILTERS = { firstName: '', lastName: '', email: '', department: '' };

export default function App() {
  const { users, loading, error, addUser, editUser, removeUser } = useUsers();

  // Search & filter
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // Sort
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [formUser, setFormUser] = useState(null);   // null = closed, {} = add, user = edit
  const [formOpen, setFormOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  // ── Derived data ─────────────────────────────────────────
  const processed = useMemo(() => {
    let result = [...users];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filters.firstName) result = result.filter((u) => u.firstName.toLowerCase().includes(filters.firstName.toLowerCase()));
    if (filters.lastName) result = result.filter((u) => u.lastName.toLowerCase().includes(filters.lastName.toLowerCase()));
    if (filters.email) result = result.filter((u) => u.email.toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.department) result = result.filter((u) => u.department === filters.department);

    // Sort
    result.sort((a, b) => {
      const va = String(a[sortField]).toLowerCase();
      const vb = String(b[sortField]).toLowerCase();
      return sortOrder === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    return result;
  }, [users, search, filters, sortField, sortOrder]);

  const totalFiltered = processed.length;
  const visibleUsers = processed.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // ── Handlers ─────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortField === field) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortOrder('asc'); }
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => { setSearch(val); setCurrentPage(1); };
  const handleFilterApply = (f) => { setFilters(f); setCurrentPage(1); };
  const handlePageSizeChange = (n) => { setPageSize(n); setCurrentPage(1); };

  const handleOpenAdd = () => { setFormUser(null); setFormOpen(true); };
  const handleOpenEdit = (user) => { setFormUser(user); setFormOpen(true); };
  const handleCloseForm = () => setFormOpen(false);

  const handleSave = async (data) => {
    if (formUser) {
      await editUser(formUser.id, data);
      showToast(`${data.firstName} ${data.lastName} updated successfully`);
    } else {
      await addUser(data);
      showToast(`${data.firstName} ${data.lastName} added successfully`);
    }
  };

  const handleDelete = async (id) => {
    await removeUser(id);
    showToast('User deleted successfully');
  };

  return (
    <div className={styles.app}>
      <Header onAddUser={handleOpenAdd} />

      <main className={styles.main}>
        {/* Stats bar */}
        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{users.length}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalFiltered}</span>
            <span className={styles.statLabel}>Matching</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <SearchBar value={search} onChange={handleSearchChange} />
          <div className={styles.toolbarRight}>
            <FilterPopup filters={filters} onApply={handleFilterApply} activeCount={activeFilterCount} />
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className={styles.errorBanner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Table */}
        <UserTable
          users={visibleUsers}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleOpenEdit}
          onDelete={setDeleteUser}
          loading={loading}
        />

        {/* Pagination */}
        {!loading && totalFiltered > 0 && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalFiltered}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </main>

      {/* Modals */}
      {formOpen && (
        <UserForm
          user={formUser}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
      {deleteUser && (
        <ConfirmDelete
          user={deleteUser}
          onConfirm={handleDelete}
          onClose={() => setDeleteUser(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
