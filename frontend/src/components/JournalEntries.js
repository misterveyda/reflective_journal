import React from 'react';

function JournalEntries({ entries }) {
  if (entries.length === 0) {
    return <div className="empty-state"><p>No entries yet. Start writing! 📝</p></div>;
  }

  return (
    <div className="entries-container">
      <h2>Your Entries</h2>
      <div className="entries-list">
        {entries.map((entry) => (
          <article key={entry.id} className="entry-card">
            <div className="entry-header">
              <h3>{entry.title}</h3>
              <span className="mood">{getMoodEmoji(entry.mood)}</span>
            </div>
            <p className="entry-content">{entry.content}</p>
            <footer className="entry-footer">
              <time>{new Date(entry.created_at).toLocaleDateString()}</time>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

function getMoodEmoji(mood) {
  const moods = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    anxious: '😰',
    excited: '🤩',
  };
  return moods[mood] || '😐';
}

export default JournalEntries;
