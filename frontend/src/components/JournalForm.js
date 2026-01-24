import React, { useState } from 'react';

function JournalForm({ onEntryCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/entries/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          mood,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onEntryCreated(data);
        setTitle('');
        setContent('');
        setMood('neutral');
      } else {
        setError('Failed to create entry');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>New Entry</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="6"
        ></textarea>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="happy">😊 Happy</option>
          <option value="sad">😢 Sad</option>
          <option value="neutral">😐 Neutral</option>
          <option value="anxious">😰 Anxious</option>
          <option value="excited">🤩 Excited</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}

export default JournalForm;
