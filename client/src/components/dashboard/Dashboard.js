import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../hooks/useNotes';
import NoteCard from '../notes/NoteCard';
import NoteModal from '../notes/NoteModal';
import './Dashboard.css';

const CATEGORIES = [
  'All', 'Personal', 'Work', 'Study', 'Health',
  'Finance', 'Shopping', 'Travel', 'Ideas', 'Other',
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const {
    notes, loading, fetchNotes,
    createNote, updateNote, deleteNote,
    togglePin, toggleComplete,
  } = useNotes();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const loadNotes = useCallback(() => {
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (debouncedSearch) params.search = debouncedSearch;
    fetchNotes(params);
  }, [activeCategory, debouncedSearch, fetchNotes]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    if (editingNote) {
      await updateNote(editingNote._id, data);
    } else {
      await createNote(data);
    }
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">✦</span>
          <span className="sidebar-logo-text">ModdyNotes</span>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">Categories</p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`sidebar-nav-item ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="sidebar-nav-dot" />
              {cat}
              {cat !== 'All' && (
                <span className="sidebar-nav-count">
                  {notes.filter((n) => n.category === cat).length || ''}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-email">{user?.email}</p>
          </div>
          <button className="sidebar-logout" onClick={logout} title="Sign out">⏻</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">
              {activeCategory === 'All' ? 'All notes' : activeCategory}
            </h1>
            <span className="topbar-count">{notes.length} notes</span>
          </div>

          <div className="topbar-right">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search notes, categories, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            <button className="add-btn" onClick={handleOpenCreate}>
              <span className="add-btn-icon">+</span>
              New note
            </button>
          </div>
        </div>

        {/* Notes grid */}
        <div className="notes-area">
          {loading ? (
            <div className="notes-loading">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="note-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="notes-empty">
              <div className="empty-icon">
                {search ? '🔍' : '✦'}
              </div>
              <h3 className="empty-title">
                {search ? 'No results found' : 'No notes yet'}
              </h3>
              <p className="empty-sub">
                {search
                  ? `Nothing matched "${search}". Try a different search.`
                  : 'Click the "New note" button to create your first note.'}
              </p>
              {!search && (
                <button className="empty-create-btn" onClick={handleOpenCreate}>
                  + Create note
                </button>
              )}
            </div>
          ) : (
            <>
              {pinnedNotes.length > 0 && (
                <section className="notes-section">
                  <h2 className="notes-section-title">📌 Pinned</h2>
                  <div className="notes-grid">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={handleEdit}
                        onDelete={deleteNote}
                        onTogglePin={togglePin}
                        onToggleComplete={toggleComplete}
                      />
                    ))}
                  </div>
                </section>
              )}

              {unpinnedNotes.length > 0 && (
                <section className="notes-section">
                  {pinnedNotes.length > 0 && (
                    <h2 className="notes-section-title">Others</h2>
                  )}
                  <div className="notes-grid">
                    {unpinnedNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={handleEdit}
                        onDelete={deleteNote}
                        onTogglePin={togglePin}
                        onToggleComplete={toggleComplete}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* FAB for mobile */}
      <button className="fab" onClick={handleOpenCreate} aria-label="New note">+</button>

      {/* Modal */}
      {modalOpen && (
        <NoteModal
          note={editingNote}
          onClose={() => { setModalOpen(false); setEditingNote(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Dashboard;
