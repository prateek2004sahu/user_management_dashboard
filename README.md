# User Management Dashboard

A responsive admin dashboard for managing users with full CRUD operations, built with **React + Vite** and powered by the **JSONPlaceholder** mock API.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── api/
│   └── userService.js        # Axios API calls (GET, POST, PUT, DELETE)
├── components/
│   ├── Header.jsx             # Top bar with Add User CTA
│   ├── SearchBar.jsx          # Real-time search input
│   ├── FilterPopup.jsx        # Multi-field filter dropdown
│   ├── UserTable.jsx          # Sortable data table
│   ├── Pagination.jsx         # Page controls + page-size selector
│   ├── UserForm.jsx           # Add / Edit modal form
│   ├── ConfirmDelete.jsx      # Delete confirmation modal
│   └── Toast.jsx              # Success / error notification
├── hooks/
│   └── useUsers.js            # Custom hook: fetch + CRUD state
├── utils/
│   ├── constants.js           # API_URL, DEPARTMENTS, PAGE_SIZE_OPTIONS
│   ├── validators.js          # Form validation rules
│   └── helpers.js             # mapApiUser, splitName, assignDepartment
├── styles/
│   └── global.css             # CSS design tokens + reset
├── App.jsx                    # Root — search/filter/sort/pagination logic
└── main.jsx                   # React entry point
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **View Users** | Fetches 10 users from JSONPlaceholder on load |
| **Add User** | POST to API → simulated 201 → added to local state |
| **Edit User** | Pre-populated modal → PUT → local state updated |
| **Delete User** | Confirmation modal → DELETE → filtered from state |
| **Search** | Real-time match on first name, last name, email |
| **Filter Popup** | Filter by first name, last name, email, department |
| **Sort** | Click any column header, toggles asc/desc |
| **Pagination** | 10 / 25 / 50 / 100 rows per page with smart page buttons |
| **Validation** | Required fields, email regex, inline error messages |
| **Error Handling** | Network errors shown as banner; API failures caught with toast |
| **Responsive** | Mobile, tablet, desktop breakpoints |

---

## 🔧 Engineering Assumptions

1. **Name splitting:** The JSONPlaceholder API returns a single `name` field (e.g. `"Leanne Graham"`). This is split on the first space into `firstName` and `lastName`.

2. **Department assignment:** JSONPlaceholder has no department field. Departments are assigned deterministically using `DEPARTMENTS[(id - 1) % DEPARTMENTS.length]` from a fixed list: Engineering, Marketing, Sales, HR, Finance, Design, IT, Operations.

3. **POST/PUT/DELETE are simulated:** JSONPlaceholder does not persist data. All mutations are reflected only in local React state. A POST always returns `id: 11` from the API; the app generates its own incremental id.

4. **Default page size:** 10 rows per page on initial load.

---

## 🧱 Libraries Used

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Axios | HTTP requests |
| CSS Modules | Scoped component styles |

---

## 🏗️ Challenges & Solutions

- **Simulated mutations:** Since JSONPlaceholder is read-only, all state changes (add, edit, delete) are managed locally in React state after the API call succeeds.
- **Name/department mapping:** Required programmatic transformation at fetch time, clearly isolated in `helpers.js` for maintainability.
- **Pagination reset:** Search, filter, and sort all reset `currentPage` to 1 to prevent empty views.

---

## 🔭 Future Improvements

- **Real backend:** Connect to a real REST API or Firebase for persistent data.
- **Auth:** JWT-based admin login flow.
- **Bulk actions:** Select multiple users for batch delete.
- **Column visibility toggle:** Let admins show/hide columns.
- **Export:** CSV / Excel export of filtered data.
- **Dark/light theme toggle.**
