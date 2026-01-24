// Configuration
// Detect if running on localhost or production
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost ? 'http://localhost:8000' : window.location.origin;

// Utility: Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// State
let state = {
    isAuthenticated: false,
    token: null,
    entries: [],
    loading: false,
    isSignUp: false,
    currentUser: null,
};

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    restoreSession();
    render();
});

function restoreSession() {
    const token = localStorage.getItem('token');
    if (token) {
        state.token = token;
        state.isAuthenticated = true;
        fetchEntries();
    }
}

// ============ RENDER FUNCTION ============
function render() {
    const app = document.getElementById('app');
    
    if (state.isAuthenticated) {
        app.innerHTML = renderJournalPage();
        attachJournalListeners();
    } else {
        app.innerHTML = renderLoginPage();
        attachLoginListeners();
    }
}

// ============ LOGIN PAGE ============
function renderLoginPage() {
    return `
        <div class="login-page">
            <div class="login-card">
                <h1>✨ Reflective Journal</h1>
                <p class="subtitle">Your safe space for thoughts</p>
                <form id="loginForm">
                    <div id="errorContainer"></div>
                    
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            id="email" 
                            required
                            autocomplete="email"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter password" 
                            id="password" 
                            required
                            autocomplete="${state.isSignUp ? 'new-password' : 'current-password'}"
                        >
                    </div>
                    
                    <button type="submit" id="submitBtn" class="submit-btn">
                        ${state.isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>
                
                <div class="toggle-section">
                    <button class="toggle-btn" id="toggleBtn">
                        ${state.isSignUp ? '← Back to Log In' : 'Create Account →'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function attachLoginListeners() {
    const form = document.getElementById('loginForm');
    const toggleBtn = document.getElementById('toggleBtn');
    
    form.addEventListener('submit', handleLogin);
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        state.isSignUp = !state.isSignUp;
        render();
    });
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submitBtn');
    const errorContainer = document.getElementById('errorContainer');
    
    submitBtn.disabled = true;
    errorContainer.innerHTML = '';
    
    // Basic validation
    if (!email || !password) {
        errorContainer.innerHTML = '<div class="error">Email and password required</div>';
        submitBtn.disabled = false;
        return;
    }
    
    try {
        const endpoint = state.isSignUp ? '/api/auth/registration/' : '/api/auth/login/';
        const headers = {
            'Content-Type': 'application/json',
        };
        
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) {
            headers['X-CSRFToken'] = csrftoken;
        }
        
        let body;
        if (state.isSignUp) {
            // Generate unique username using UUID (guaranteed unique)
            const username = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            body = JSON.stringify({
                username: username,
                email: email,
                password1: password,
                password2: password,
            });
        } else {
            body = JSON.stringify({
                email: email,
                password: password,
            });
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            credentials: 'include',
            body: body,
        });
        
        const data = await response.json();
        console.log(`${state.isSignUp ? 'Signup' : 'Login'} response:`, response.status, data);
        
        if (response.ok) {
            const token = data.key || data.token || data.access_token;
            if (!token) {
                errorContainer.innerHTML = '<div class="error">Server error: no token received</div>';
                console.error('No token:', data);
                submitBtn.disabled = false;
                return;
            }
            
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem('token', state.token);
            state.entries = [];
            fetchEntries();
            render();
        } else {
            // Parse error response
            let errorMsg = 'Failed';
            
            if (data.detail) errorMsg = data.detail;
            else if (data.username) errorMsg = `Username: ${Array.isArray(data.username) ? data.username[0] : data.username}`;
            else if (data.email) errorMsg = `Email: ${Array.isArray(data.email) ? data.email[0] : data.email}`;
            else if (data.password) errorMsg = `Password: ${Array.isArray(data.password) ? data.password[0] : data.password}`;
            else if (data.password1) errorMsg = `Password: ${Array.isArray(data.password1) ? data.password1[0] : data.password1}`;
            else if (data.non_field_errors) errorMsg = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
            else errorMsg = JSON.stringify(data);
            
            errorContainer.innerHTML = `<div class="error">${errorMsg}</div>`;
            console.error('Auth error:', errorMsg);
            submitBtn.disabled = false;
        }
    } catch (err) {
        errorContainer.innerHTML = `<div class="error">Network error: ${err.message}</div>`;
        console.error('Request failed:', err);
        submitBtn.disabled = false;
    }
}}

// ============ JOURNAL PAGE ============
function renderJournalPage() {
    return `
        <div class="header">
            <h1>✨ Reflective Journal</h1>
            <button class="logout-btn" id="logoutBtn">Logout</button>
        </div>
        <div class="main-container">
            <div class="container">
                <div class="journal-page">
                    ${renderJournalForm()}
                    ${renderEntries()}
                </div>
            </div>
        </div>
    `;
}

function renderJournalForm() {
    return `
        <div class="form-container">
            <h2>New Entry</h2>
            <form id="entryForm">
                <div id="formErrorContainer"></div>
                <input 
                    type="text" 
                    placeholder="Title (optional)" 
                    id="title"
                >
                <textarea 
                    placeholder="What's on your mind?" 
                    id="content" 
                    required
                ></textarea>
                <select id="mood" required>
                    <option value="happy">😊 Happy</option>
                    <option value="sad">😢 Sad</option>
                    <option value="neutral" selected>😐 Neutral</option>
                    <option value="anxious">😰 Anxious</option>
                    <option value="excited">🤩 Excited</option>
                </select>
                <button type="submit" id="submitEntryBtn">Save Entry</button>
            </form>
        </div>
    `;
}

function renderEntries() {
    if (state.loading) {
        return `
            <div class="entries-container">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading entries...</p>
                </div>
            </div>
        `;
    }
    
    if (state.entries.length === 0) {
        return `
            <div class="entries-container">
                <div class="empty-state">
                    <p>No entries yet. Start writing! 📝</p>
                </div>
            </div>
        `;
    }
    
    const entriesHTML = state.entries.map(entry => `
        <article class="entry-card">
            <div class="entry-header">
                <h3>${escapeHtml(entry.title || 'Untitled')}</h3>
                <span class="mood">${getMoodEmoji(entry.mood)}</span>
            </div>
            <p class="entry-content">${escapeHtml(entry.content)}</p>
            <footer class="entry-footer">
                <time>${new Date(entry.created_at).toLocaleDateString()}</time>
            </footer>
        </article>
    `).join('');
    
    return `
        <div class="entries-container">
            <h2>Your Entries</h2>
            <div class="entries-list">
                ${entriesHTML}
            </div>
        </div>
    `;
}

function attachJournalListeners() {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('entryForm').addEventListener('submit', handleCreateEntry);
}

// ============ JOURNAL ACTIONS ============
async function fetchEntries() {
    state.loading = true;
    render();
    
    try {
        const response = await fetch(`${API_URL}/api/entries/`, {
            headers: {
                'Authorization': `Token ${state.token}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            state.entries = data.results || data;
        } else {
            console.error('Failed to fetch entries');
        }
    } catch (err) {
        console.error('Error fetching entries:', err);
    } finally {
        state.loading = false;
        render();
    }
}

async function handleCreateEntry(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const mood = document.getElementById('mood').value;
    const submitBtn = document.getElementById('submitEntryBtn');
    const errorContainer = document.getElementById('formErrorContainer');
    
    submitBtn.disabled = true;
    errorContainer.innerHTML = '';
    
    try {
        const headers = {
            'Authorization': `Token ${state.token}`,
            'Content-Type': 'application/json',
        };
        
        // Add CSRF token if available
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) {
            headers['X-CSRFToken'] = csrftoken;
        }
        
        const response = await fetch(`${API_URL}/api/entries/`, {
            method: 'POST',
            headers: headers,
            credentials: 'include',  // Include cookies
            body: JSON.stringify({
                title,
                content,
                mood,
            }),
        });
        
        if (response.ok) {
            const newEntry = await response.json();
            state.entries.unshift(newEntry);
            document.getElementById('entryForm').reset();
            document.getElementById('mood').value = 'neutral';
            render();
            attachJournalListeners();
        } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.detail || 'Failed to create entry';
            errorContainer.innerHTML = `<div class="error">${errorMsg}</div>`;
        }
    } catch (err) {
        errorContainer.innerHTML = `<div class="error">Error: ${err.message}</div>`;
    } finally {
        submitBtn.disabled = false;
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    state.isAuthenticated = false;
    state.token = null;
    state.entries = [];
    state.isSignUp = false;
    render();
}

// ============ UTILITY FUNCTIONS ============
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
