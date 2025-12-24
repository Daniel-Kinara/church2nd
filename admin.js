// ===== ADMIN VARIABLES =====
const ADMIN_USERNAME = 'Daniel Kinara';
const ADMIN_PASSWORD = 'Kinara@2026+';
let isAdminLoggedIn = false;

// ===== DOM ELEMENTS =====
const adminLogin = document.getElementById('adminLogin');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const adminTabs = document.querySelectorAll('.admin-tab');
const tabContents = document.querySelectorAll('.tab-content');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    checkAdminLogin();
    initAdminTabs();
    initEventForm();
    initMediaForm();
    initDonationsTab();
    initSettingsTab();
    
    // Load initial data
    loadAdminData();
});

// ===== AUTHENTICATION =====
function checkAdminLogin() {
    const savedLogin = localStorage.getItem('adminLoggedIn');
    if (savedLogin === 'true') {
        showAdminDashboard();
    } else {
        showAdminLogin();
    }
}

function showAdminLogin() {
    if (adminLogin) adminLogin.style.display = 'flex';
    if (adminDashboard) adminDashboard.style.display = 'none';
    isAdminLoggedIn = false;
}

function showAdminDashboard() {
    if (adminLogin) adminLogin.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';
    isAdminLoggedIn = true;
}

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            showAdminDashboard();
        } else {
            const errorEl = document.getElementById('loginError');
            if (errorEl) {
                errorEl.textContent = 'Invalid username or password';
            }
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        showAdminLogin();
    });
}

// ===== ADMIN TABS =====
function initAdminTabs() {
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            adminTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId + 'Tab') {
                    content.classList.add('active');
                }
            });
        });
    });
}

// ===== EVENT MANAGEMENT =====
function initEventForm() {
    const eventForm = document.getElementById('eventForm');
    if (!eventForm) return;
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('eventDate');
    if (dateInput) {
        dateInput.min = today;
        dateInput.value = today;
    }
    
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const eventData = {
            id: Date.now(),
            title: document.getElementById('eventTitle').value.trim(),
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            type: document.getElementById('eventType').value,
            location: document.getElementById('eventLocation').value.trim() || 'Church Sanctuary',
            description: document.getElementById('eventDescription').value.trim(),
            image: document.getElementById('eventImage').value.trim() || 'https://images.unsplash.com/photo-1518834103329-0d6c95f1e6b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            featured: document.getElementById('eventFeatured').checked,
            notification: document.getElementById('sendNotification').checked
        };
        
        // Add event
        addEvent(eventData);
        
        // Show success message
        alert('Event added successfully!');
        
        // Reset form
        this.reset();
        dateInput.value = today;
        document.getElementById('eventFeatured').checked = true;
        
        // Refresh events list
        loadEventsList();
        updateAdminStats();
    });
}

function addEvent(eventData) {
    // Get existing events
    const events = JSON.parse(localStorage.getItem('churchEvents')) || [];
    
    // Add new event
    events.push(eventData);
    
    // Save to localStorage
    localStorage.setItem('churchEvents', JSON.stringify(events));
    
    // Send notification if enabled
    if (eventData.notification) {
        sendEventNotification(eventData);
    }
}

function loadEventsList() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;
    
    const events = JSON.parse(localStorage.getItem('churchEvents')) || [];
    
    if (events.length === 0) {
        eventsList.innerHTML = '<p>No events found.</p>';
        return;
    }
    
    // Sort by date (newest first)
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    eventsList.innerHTML = events.map(event => `
        <div class="event-item">
            <div class="event-info">
                <h4>${event.title}</h4>
                <p>${formatDate(event.date)} • ${event.time} • ${event.type}</p>
            </div>
            <div class="event-actions">
                <button class="action-btn preview-btn" data-id="${event.id}">Preview</button>
                <button class="action-btn edit-btn" data-id="${event.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${event.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = parseInt(this.dataset.id);
            previewEvent(eventId);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = parseInt(this.dataset.id);
            editEvent(eventId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = parseInt(this.dataset.id);
            deleteEvent(eventId);
        });
    });
}

function previewEvent(eventId) {
    const events = JSON.parse(localStorage.getItem('churchEvents')) || [];
    const event = events.find(e => e.id === eventId);
    
    if (event) {
        alert(`Preview: ${event.title}\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\n\n${event.description}`);
    }
}

function editEvent(eventId) {
    alert('Edit functionality would open a form with event data pre-filled.');
    // In a full implementation, this would populate the form with event data for editing
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        const events = JSON.parse(localStorage.getItem('churchEvents')) || [];
        const filteredEvents = events.filter(e => e.id !== eventId);
        localStorage.setItem('churchEvents', JSON.stringify(filteredEvents));
        
        loadEventsList();
        updateAdminStats();
        alert('Event deleted successfully.');
    }
}

function sendEventNotification(event) {
    // Get subscribers
    const subscribers = JSON.parse(localStorage.getItem('eventSubscriptions')) || [];
    
    if (subscribers.length === 0) return;
    
    // In a real implementation, this would send emails
    console.log(`Notification sent to ${subscribers.length} subscribers about: ${event.title}`);
    
    // For demo, just show an alert
    alert(`Event notification would be sent to ${subscribers.length} subscribers.`);
}

// ===== MEDIA MANAGEMENT =====
function initMediaForm() {
    const mediaForm = document.getElementById('mediaForm');
    if (!mediaForm) return;
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('mediaDate');
    if (dateInput) {
        dateInput.value = today;
    }
    
    mediaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const mediaData = {
            id: Date.now(),
            title: document.getElementById('mediaTitle').value.trim(),
            type: document.getElementById('mediaType').value,
            url: document.getElementById('mediaUrl').value.trim(),
            description: document.getElementById('mediaDescription').value.trim(),
            speaker: document.getElementById('mediaSpeaker').value.trim() || 'Pastor John Smith',
            date: document.getElementById('mediaDate').value || today,
            thumbnail: document.getElementById('mediaThumbnail').value.trim() || getDefaultThumbnail()
        };
        
        // Add media
        addMedia(mediaData);
        
        // Show success message
        alert('Media added successfully!');
        
        // Reset form
        this.reset();
        dateInput.value = today;
        
        // Refresh media list
        loadMediaList();
        updateAdminStats();
    });
}

function getDefaultThumbnail() {
    return 'https://images.unsplash.com/photo-1518834103329-0d6c95f1e6b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
}

function addMedia(mediaData) {
    // Get existing media
    const media = JSON.parse(localStorage.getItem('churchMedia')) || [];
    
    // Add new media
    media.push(mediaData);
    
    // Save to localStorage
    localStorage.setItem('churchMedia', JSON.stringify(media));
}

function loadMediaList() {
    const mediaList = document.getElementById('mediaList');
    if (!mediaList) return;
    
    const media = JSON.parse(localStorage.getItem('churchMedia')) || [];
    
    if (media.length === 0) {
        mediaList.innerHTML = '<p>No media found.</p>';
        return;
    }
    
    // Sort by date (newest first)
    media.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    mediaList.innerHTML = media.map(item => `
        <div class="media-item">
            <div class="media-info">
                <h4>${item.title}</h4>
                <p>${item.type} • ${item.speaker} • ${formatDate(item.date)}</p>
            </div>
            <div class="media-actions">
                <button class="action-btn preview-btn" data-id="${item.id}">Preview</button>
                <button class="action-btn edit-btn" data-id="${item.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${item.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaId = parseInt(this.dataset.id);
            previewMedia(mediaId);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaId = parseInt(this.dataset.id);
            editMedia(mediaId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaId = parseInt(this.dataset.id);
            deleteMedia(mediaId);
        });
    });
}

function previewMedia(mediaId) {
    const media = JSON.parse(localStorage.getItem('churchMedia')) || [];
    const item = media.find(m => m.id === mediaId);
    
    if (item) {
        alert(`Preview: ${item.title}\nType: ${item.type}\nSpeaker: ${item.speaker}\nDate: ${item.date}\n\n${item.description}`);
    }
}

function editMedia(mediaId) {
    alert('Edit functionality would open a form with media data pre-filled.');
}

function deleteMedia(mediaId) {
    if (confirm('Are you sure you want to delete this media item?')) {
        const media = JSON.parse(localStorage.getItem('churchMedia')) || [];
        const filteredMedia = media.filter(m => m.id !== mediaId);
        localStorage.setItem('churchMedia', JSON.stringify(filteredMedia));
        
        loadMediaList();
        updateAdminStats();
        alert('Media deleted successfully.');
    }
}

// ===== DONATIONS TAB =====
function initDonationsTab() {
    const dateFilter = document.getElementById('donationDateFilter');
    const typeFilter = document.getElementById('donationTypeFilter');
    
    if (dateFilter) {
        dateFilter.addEventListener('change', loadDonationsTable);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', loadDonationsTable);
    }
    
    loadDonationsTable();
}

function loadDonationsTable() {
    const donationsTable = document.getElementById('donationsTable');
    if (!donationsTable) return;
    
    const donations = JSON.parse(localStorage.getItem('churchDonations')) || [];
    
    // Apply filters
    let filteredDonations = [...donations];
    const dateFilter = document.getElementById('donationDateFilter');
    const typeFilter = document.getElementById('donationTypeFilter');
    
    if (dateFilter && dateFilter.value) {
        filteredDonations = filteredDonations.filter(d => d.timestamp.startsWith(dateFilter.value));
    }
    
    if (typeFilter && typeFilter.value !== 'all') {
        filteredDonations = filteredDonations.filter(d => d.type === typeFilter.value);
    }
    
    // Sort by date (newest first)
    filteredDonations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (filteredDonations.length === 0) {
        donationsTable.innerHTML = '<tr><td colspan="5">No donations found.</td></tr>';
        return;
    }
    
    donationsTable.innerHTML = filteredDonations.map(donation => `
        <tr>
            <td>${formatDate(donation.timestamp)}</td>
            <td>${donation.anonymous ? 'Anonymous' : donation.name}</td>
            <td>${donation.type}</td>
            <td>${formatCurrency(donation.amount)}</td>
            <td><span class="status-completed">Completed</span></td>
        </tr>
    `).join('');
    
    // Update summary
    updateDonationsSummary(filteredDonations);
}

function updateDonationsSummary(donations) {
    const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const monthly = donations
        .filter(d => {
            const donationDate = new Date(d.timestamp);
            const now = new Date();
            return donationDate.getMonth() === now.getMonth() &&
                   donationDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, donation) => sum + donation.amount, 0);
    
    const average = donations.length > 0 ? total / donations.length : 0;
    
    const totalEl = document.getElementById('totalDonationsSum');
    const monthlyEl = document.getElementById('monthlyDonations');
    const averageEl = document.getElementById('averageDonation');
    
    if (totalEl) totalEl.textContent = formatCurrency(total);
    if (monthlyEl) monthlyEl.textContent = formatCurrency(monthly);
    if (averageEl) averageEl.textContent = formatCurrency(average);
}

// ===== SETTINGS TAB =====
function initSettingsTab() {
    const backupBtn = document.getElementById('backupBtn');
    const restoreBtn = document.getElementById('restoreBtn');
    
    if (backupBtn) {
        backupBtn.addEventListener('click', backupData);
    }
    
    if (restoreBtn) {
        restoreBtn.addEventListener('click', restoreData);
    }
    
    // Load current settings
    loadSettings();
}

function backupData() {
    // Collect all data
    const data = {
        events: JSON.parse(localStorage.getItem('churchEvents')) || [],
        media: JSON.parse(localStorage.getItem('churchMedia')) || [],
        donations: JSON.parse(localStorage.getItem('churchDonations')) || [],
        subscriptions: JSON.parse(localStorage.getItem('eventSubscriptions')) || [],
        contacts: JSON.parse(localStorage.getItem('contactMessages')) || [],
        timestamp: new Date().toISOString()
    };
    
    // Create and download backup file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `church-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Backup created successfully!');
}

function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // Restore data
                if (data.events) localStorage.setItem('churchEvents', JSON.stringify(data.events));
                if (data.media) localStorage.setItem('churchMedia', JSON.stringify(data.media));
                if (data.donations) localStorage.setItem('churchDonations', JSON.stringify(data.donations));
                if (data.subscriptions) localStorage.setItem('eventSubscriptions', JSON.stringify(data.subscriptions));
                if (data.contacts) localStorage.setItem('contactMessages', JSON.stringify(data.contacts));
                
                alert('Data restored successfully!');
                loadAdminData();
            } catch (error) {
                alert('Error restoring backup: Invalid file format');
            }
        };
        
        reader.readAsText(file);
    });
    
    input.click();
}

function loadSettings() {
    // Load church name
    const churchNameInput = document.getElementById('churchName');
    if (churchNameInput) {
        churchNameInput.value = localStorage.getItem('churchName') || 'Pure Word Apostolic Church';
    }
    
    // Load other settings as needed
}

// ===== ADMIN DATA LOADING =====
function loadAdminData() {
    loadEventsList();
    loadMediaList();
    updateAdminStats();
    loadDonationsTable();
}

function updateAdminStats() {
    const events = JSON.parse(localStorage.getItem('churchEvents')) || [];
    const media = JSON.parse(localStorage.getItem('churchMedia')) || [];
    const donations = JSON.parse(localStorage.getItem('churchDonations')) || [];
    const subscriptions = JSON.parse(localStorage.getItem('eventSubscriptions')) || [];
    
    const totalEvents = document.getElementById('totalEvents');
    const totalMedia = document.getElementById('totalMedia');
    const totalDonations = document.getElementById('totalDonations');
    const activeUsers = document.getElementById('activeUsers');
    
    if (totalEvents) totalEvents.textContent = events.length;
    if (totalMedia) totalMedia.textContent = media.length;
    if (totalDonations) totalDonations.textContent = donations.length;
    if (activeUsers) activeUsers.textContent = subscriptions.length;
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}