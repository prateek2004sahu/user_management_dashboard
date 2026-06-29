import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/userService';
import { mapApiUser, generateId } from '../utils/helpers';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((res) => {
        setUsers(res.data.map(mapApiUser));
        setError(null);
      })
      .catch(() => {
        setError('Failed to load users. Please check your connection and try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const addUser = async (formData) => {
    const res = await createUser(formData);
    // JSONPlaceholder returns id=11 always; we generate a unique local id
    const newUser = { ...formData, id: generateId(users) };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const editUser = async (id, formData) => {
    await updateUser(id, formData);
    const updated = { ...formData, id };
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  const removeUser = async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return { users, loading, error, addUser, editUser, removeUser };
};
