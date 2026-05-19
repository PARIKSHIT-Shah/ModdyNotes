import React, { useState, useEffect } from 'react';
import './NoteModal.css';

const CATEGORIES = [
  'Personal', 'Work', 'Study', 'Health',
  'Finance', 'Shopping', 'Travel', 'Ideas', 'Other',
];

const COLORS = [
  '#13131a', '#1a1a2e', '#1a2e1a',
  '#2e1a1a', '#2e2a1a', '#1a2a2e',
  '#2a1a2e', '#2e1a2a',
];

const NoteModal = ({ note, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Personal',
    color: '#13131a',
    tags: '',
    isPinned: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (note) {
      setForm({
        title: note.title || '',
        content: note.content || '',
        category: note.category || 'Personal',
        color: note.color || '#13131a',
        tags: (note.tags || []).join(', '),
        isPinned: note.isPinned || false,
      });
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await onSave(payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box animate-scaleIn">
        <div className="modal-header">
          <h2 className="modal-title">{note ? 'Edit note' : 'New note'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="modal-input modal-title-input"
            name="title"
            type="text"
            placeholder="Note title..."
            value={form.title}
            onChange={handleChange}
            autoFocus
            required
          />

          <textarea
            className="modal-textarea"
            name="content"
            placeholder="Write your note here..."
            value={form.content}
            onChange={handleChange}
            rows={5}
          />

          <div className="modal-row">
            <div className="modal-field">
              <label>Category</label>
              <select
                className="modal-select"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <label>Tags <span className="modal-hint">(comma separated)</span></label>
              <input
                className="modal-input"
                name="tags"
                type="text"
                placeholder="e.g. urgent, personal"
                value={form.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-field">
            <label>Card color</label>
            <div className="modal-colors">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`modal-color-dot ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <label className="modal-pin">
            <input
              type="checkbox"
              name="isPinned"
              checked={form.isPinned}
              onChange={handleChange}
            />
            <span>Pin this note</span>
            <span className="modal-pin-icon">📌</span>
          </label>

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-save" disabled={loading || !form.title.trim()}>
              {loading ? <span className="auth-spinner" /> : note ? 'Save changes' : 'Create note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
