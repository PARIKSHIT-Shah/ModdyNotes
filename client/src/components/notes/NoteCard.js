import React, { useState } from 'react';
import './NoteCard.css';

const CATEGORY_COLORS = {
  Personal: '#7c6aff',
  Work: '#6affda',
  Study: '#facc15',
  Health: '#4ade80',
  Finance: '#fb923c',
  Shopping: '#f472b6',
  Travel: '#38bdf8',
  Ideas: '#c084fc',
  Other: '#94a3b8',
};

const NoteCard = ({ note, onEdit, onDelete, onTogglePin, onToggleComplete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const categoryColor = CATEGORY_COLORS[note.category] || '#7878a0';

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(note._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`note-card animate-fadeIn ${note.isCompleted ? 'note-card--done' : ''}`}
      style={{ background: note.color || 'var(--bg-card)' }}
    >
      {note.isPinned && <span className="note-pin-badge" title="Pinned">📌</span>}

      <div className="note-card-header">
        <span
          className="note-category-tag"
          style={{ color: categoryColor, borderColor: `${categoryColor}40`, background: `${categoryColor}12` }}
        >
          {note.category}
        </span>

        <div className="note-card-actions">
          <button
            className="note-action-btn"
            onClick={() => onToggleComplete(note)}
            title={note.isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {note.isCompleted ? '↩' : '✓'}
          </button>
          <button
            className="note-action-btn"
            onClick={() => onTogglePin(note)}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            📌
          </button>

          <div className="note-menu-wrap">
            <button
              className="note-action-btn"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ···
            </button>
            {menuOpen && (
              <div className="note-menu">
                <button
                  onClick={() => {
                    onEdit(note);
                    setMenuOpen(false);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className={confirmDelete ? 'danger' : ''}
                  onClick={handleDelete}
                >
                  {confirmDelete ? '⚠️ Confirm' : '🗑 Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="note-card-body" onClick={() => onEdit(note)}>
        <h3 className={`note-title ${note.isCompleted ? 'note-title--done' : ''}`}>
          {note.title}
        </h3>
        {note.content && (
          <p className="note-content">{note.content}</p>
        )}
      </div>

      {note.tags?.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag) => (
            <span key={tag} className="note-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="note-card-footer">
        <span className="note-date">{formatDate(note.updatedAt)}</span>
        {note.isCompleted && <span className="note-done-badge">Done</span>}
      </div>
    </div>
  );
};

export default NoteCard;
