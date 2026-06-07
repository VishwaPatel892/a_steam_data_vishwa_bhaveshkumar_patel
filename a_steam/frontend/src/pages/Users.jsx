import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  setPagination,
  setSearch,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openDeleteModal,
  closeDeleteModal,
} from '../store/slices/usersSlice';
import { GlassCard, Button, DataTable, Modal, Input } from '../components';

// ── Animations ───────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const roleColors = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  user: 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400',
};

const StatusIcon = ({ status }) => {
  if (status === 'active' || status === true) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
  if (status === 'inactive' || status === false) return <XCircle className="w-4 h-4 text-rose-400" />;
  return <Clock className="w-4 h-4 text-amber-400" />;
};

// ── Component ────────────────────────────────────────────────────────────────
const UsersPage = () => {
  const dispatch = useDispatch();
  const {
    users,
    total,
    page,
    limit,
    search,
    sort,
    loading,
    createModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedUser,
  } = useSelector((state) => state.users);

  // Local state for forms
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', isActive: true });
  const [localSearch, setLocalSearch] = useState(search);

  // Fetch users on mount and when dependencies change
  useEffect(() => {
    dispatch(fetchUsers({ page, limit, search, sort }));
  }, [dispatch, page, limit, search, sort]);

  // Handle Search Input (debounced)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(setSearch(query));
    }, 500),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChangePage = (event, newPage) => {
    // MUI Pagination is 0-indexed, our API is 1-indexed
    dispatch(setPagination({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setPagination({ limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Create
  const handleOpenCreate = () => {
    setFormData({ name: '', email: '', password: '', role: 'user', isActive: true });
    dispatch(openCreateModal());
  };

  const submitCreate = async () => {
    await dispatch(createUser(formData));
    dispatch(fetchUsers({ page, limit, search, sort })); // refresh
  };

  // Edit
  const handleOpenEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
    dispatch(openEditModal(user));
  };

  const submitEdit = async () => {
    // Only send allowed fields to API
    await dispatch(updateUser({ id: selectedUser._id, data: formData }));
    dispatch(fetchUsers({ page, limit, search, sort })); // refresh
  };

  // Delete
  const submitDelete = async () => {
    await dispatch(deleteUser(selectedUser._id));
    dispatch(fetchUsers({ page, limit, search, sort })); // refresh
  };

  // ── DataTable Columns ──────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      {
        id: 'user',
        label: 'User',
        minWidth: 250,
        format: (_, row) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 uppercase">
              {row.name?.substring(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        id: 'role',
        label: 'Role',
        minWidth: 100,
        format: (value) => (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[value] || roleColors.user}`}>
            {value || 'user'}
          </span>
        ),
      },
      {
        id: 'isActive',
        label: 'Status',
        minWidth: 120,
        format: (value) => (
          <div className="flex items-center gap-1.5">
            <StatusIcon status={value} />
            <span className="capitalize text-gray-700 dark:text-gray-300">
              {value ? 'Active' : 'Inactive'}
            </span>
          </div>
        ),
      },
      {
        id: 'createdAt',
        label: 'Joined',
        minWidth: 150,
        format: (value) => (value ? new Date(value).toLocaleDateString() : '-'),
      },
      {
        id: 'actions',
        label: '',
        align: 'right',
        minWidth: 100,
        format: (_, row) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-[#27272a] hover:text-blue-500 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(openDeleteModal(row))}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-[#27272a] hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [dispatch]
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <UsersIcon className="w-8 h-8 text-primary-500" />
            Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and monitor all registered users in the system.
          </p>
        </div>
        <Button onClick={handleOpenCreate} startIcon={<UserPlus className="w-4 h-4" />}>
          Add User
        </Button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: total, color: 'from-primary-500 to-blue-600' },
          { label: 'Active', value: users.filter(u => u.isActive).length, color: 'from-emerald-500 to-teal-600' },
          { label: 'Inactive', value: users.filter(u => !u.isActive).length, color: 'from-rose-500 to-pink-600' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'from-amber-500 to-orange-500' },
        ].map((s) => (
          <GlassCard key={s.label} className="!p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
              {s.value}
            </p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Table Section */}
      <motion.div variants={itemVariants}>
        <GlassCard noPadding className="overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Search by name or email..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
              />
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={users}
            isLoading={loading}
            totalCount={total}
            page={page - 1} // MUI is 0-indexed
            rowsPerPage={limit}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </GlassCard>
      </motion.div>

      {/* ── Create Modal ──────────────────────────────────────────────────────── */}
      <Modal
        open={createModalOpen}
        onClose={() => dispatch(closeCreateModal())}
        title="Create New User"
        maxWidth="xs"
        actions={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outlined" onClick={() => dispatch(closeCreateModal())}>Cancel</Button>
            <Button onClick={submitCreate}>Create User</Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <Input label="Full Name" name="name" value={formData.name} onChange={handleFormChange} fullWidth required />
          <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleFormChange} fullWidth required />
          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleFormChange} fullWidth required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
      <Modal
        open={editModalOpen}
        onClose={() => dispatch(closeEditModal())}
        title="Edit User"
        maxWidth="xs"
        actions={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outlined" onClick={() => dispatch(closeEditModal())}>Cancel</Button>
            <Button onClick={submitEdit}>Save Changes</Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <Input label="Full Name" name="name" value={formData.name} onChange={handleFormChange} fullWidth required />
          <Input label="Email Address" name="email" value={formData.email} disabled fullWidth />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleFormChange}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
              Account Active
            </label>
          </div>
        </div>
      </Modal>

      {/* ── Delete Modal ──────────────────────────────────────────────────────── */}
      <Modal
        open={deleteModalOpen}
        onClose={() => dispatch(closeDeleteModal())}
        title="Delete User"
        maxWidth="xs"
        actions={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outlined" onClick={() => dispatch(closeDeleteModal())}>Cancel</Button>
            <Button color="error" className="bg-rose-500 hover:bg-rose-600 text-white" onClick={submitDelete}>
              Confirm Delete
            </Button>
          </div>
        }
      >
        <div className="py-2 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{selectedUser?.name}</span>? 
          This action cannot be undone.
        </div>
      </Modal>

    </motion.div>
  );
};

export default UsersPage;
