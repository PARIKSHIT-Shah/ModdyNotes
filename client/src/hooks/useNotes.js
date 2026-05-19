import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/notes', { params });
      setNotes(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = async (noteData) => {
    try {
      const { data } = await api.post('/notes', noteData);
      setNotes((prev) => [data, ...prev]);
      toast.success('Note created!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create note');
      throw err;
    }
  };

  const updateNote = async (id, updates) => {
    try {
      const { data } = await api.put(`/notes/${id}`, updates);
      setNotes((prev) => prev.map((n) => (n._id === id ? data : n)));
      toast.success('Note updated!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update note');
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete note');
      throw err;
    }
  };

  const togglePin = async (note) => {
    return updateNote(note._id, { isPinned: !note.isPinned });
  };

  const toggleComplete = async (note) => {
    return updateNote(note._id, { isCompleted: !note.isCompleted });
  };

  return {
    notes,
    loading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleComplete,
  };
};
