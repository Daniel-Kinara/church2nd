// ===== GLOBAL VARIABLES =====
let currentUser = null;
let events = [];
let media = [];
let darkMode = false;

// ===== DOM ELEMENTS =====
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

// ===== SAMPLE DATA =====
const sampleEvents = [
    {
        id: 1,
        title: "Sunday Worship Service",
        date: "2025-06-02",
        time: "09:00",
        type: "service",
        location: "Church Sanctuary",
        description: "Join us for our weekly Sunday worship service with inspiring music and biblical teaching.",
        featured: true,
        image: "https://images.unsplash.com/photo-1518834103329-0d6c95f1e6b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Youth Group Meeting",
        date: "2025-06-05",
        time: "19:00",
        type: "meeting",
        location: "Youth Center",
        description: "Weekly youth group meeting for teenagers. Games, worship, and relevant Bible study.",
        featured: false,
        image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Community Outreach Day",
        date: "2025-06-08",
        time: "10:00",
        type: "outreach",
        location: "City Park",
        description: "Join us as we serve our community through various outreach activities.",
        featured: true,
        image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Marriage Conference",
        date: "2025-06-15",
        time: "09:00",
        type: "conference",
        location: "Main Auditorium",
        description: "A special conference for married couples to strengthen their relationships.",
        featured: true,
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const sampleMedia = [
    {
        id: 1,
        title: "The Power of Grace",
        type: "sunday",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Sunday sermon on understanding God's grace in our lives.",
        speaker: "Reverend Samuel Kirochi",
        date: "2025-12-12",
        thumbnail: "images/image1.png"
    },
    {
        id: 2,
        title: "Finding Hope in Difficult Times",
        type: "sunday",
        url: "https://www.youtube.com/embed/9bZkp7q19f0",
        description: "Biblical teaching on maintaining hope during challenging seasons.",
        speaker: "Reverend Samuel Kirochi",
        date: "2025-12-20",
        thumbnail: "images/image1.png"
    },
    {
        id: 3,
        title: "The Book of Romans Study",
        type: "bible-study",
        url: "https://www.youtube.com/embed/7NOSDKb0HlU",
        description: "Deep dive into the Book of Romans - Part 1",
        speaker: "Apostle Samson",
        date: "2025-12-19",
        thumbnail: "images/image1.png"
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavigation();
    loadData();
    
    // Page-specific initializations
    if (document.getElementById('eventsPreview')) {
        initEventsPreview();
    }
    
    if (document.getElementById('sermonsContainer')) {
        initSermonsPage();
    }
    
    if (document.getElementById('eventsGrid')) {
        initEventsPage();
    }
    
    if (document.getElementById('givingForm')) {
        initGivingPage();
    }
    
    if (document.getElementById('contactForm')) {
        initContactPage();
    }
});

// ===== THEME MANAGEMENT =====
function initTheme() {
    if (!themeToggle) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('churchTheme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    darkMode = true;
    localStorage.setItem('churchTheme', 'dark');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    darkMode = false;
    localStorage.setItem('churchTheme', 'light');
}

// ===== NAVIGATION =====
function initNavigation() {
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// ===== DATA MANAGEMENT =====
function loadData() {
    // Load events
    const savedEvents = localStorage.getItem('churchEvents');
    events = savedEvents ? JSON.parse(savedEvents) : sampleEvents;
    
    // Load media
    const savedMedia = localStorage.getItem('churchMedia');
    media = savedMedia ? JSON.parse(savedMedia) : sampleMedia;
    
    // Load user
    const savedUser = localStorage.getItem('churchUser');
    currentUser = savedUser ? JSON.parse(savedUser) : null;
}

function saveEvents() {
    localStorage.setItem('churchEvents', JSON.stringify(events));
}

function saveMedia() {
    localStorage.setItem('churchMedia', JSON.stringify(media));
}

// ===== HOME PAGE FUNCTIONS =====
function initEventsPreview() {
    const eventsPreview = document.getElementById('eventsPreview');
    if (!eventsPreview) return;
    
    // Get featured events (up to 3)
    const featuredEvents = events
        .filter(event => event.featured)
        .slice(0, 3);
    
    if (featuredEvents.length === 0) {
        eventsPreview.innerHTML = '<p class="text-center">No upcoming events scheduled.</p>';
        return;
    }
    
    eventsPreview.innerHTML = featuredEvents.map(event => `
        <div class="event-card">
            <div class="event-image">
                <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="event-content">
                <span class="event-date">${formatDate(event.date)}</span>
                <h3>${event.title}</h3>
                <p>${event.description.substring(0, 100)}...</p>
                <div class="countdown" id="countdown-${event.id}">
                    ${createCountdownHTML(event.date)}
                </div>
                <button class="btn-small view-event-btn" data-id="${event.id}">View Details</button>
            </div>
        </div>
    `).join('');
    
    // Initialize countdowns
    featuredEvents.forEach(event => {
        initializeCountdown(event.id, event.date);
    });
    
    // Add event listeners
    document.querySelectorAll('.view-event-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = parseInt(this.dataset.id);
            const event = events.find(e => e.id === eventId);
            if (event) {
                showEventModal(event);
            }
        });
    });
}

// ===== COUNTDOWN FUNCTIONS =====
function createCountdownHTML(dateString) {
    return `
        <div class="countdown-item">
            <div class="countdown-number days">00</div>
            <div class="countdown-label">Days</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-number hours">00</div>
            <div class="countdown-label">Hours</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-number minutes">00</div>
            <div class="countdown-label">Minutes</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-number seconds">00</div>
            <div class="countdown-label">Seconds</div>
        </div>
    `;
}

function initializeCountdown(eventId, dateString) {
    const countdownElement = document.getElementById(`countdown-${eventId}`);
    if (!countdownElement) return;
    
    function updateCountdown() {
        const eventDate = new Date(dateString + 'T00:00:00');
        const now = new Date();
        const diff = eventDate - now;
        
        if (diff < 0) {
            countdownElement.innerHTML = '<p>Event has passed</p>';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysEl = countdownElement.querySelector('.days');
        const hoursEl = countdownElement.querySelector('.hours');
        const minutesEl = countdownElement.querySelector('.minutes');
        const secondsEl = countdownElement.querySelector('.seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== SERMONS PAGE FUNCTIONS =====
function initSermonsPage() {
    renderMediaGrid();
    initSocialFeeds();
    initVideoModal();
    
    // Filter functionality
    const categoryFilter = document.getElementById('categoryFilter');
    const speakerFilter = document.getElementById('speakerFilter');
    const searchInput = document.getElementById('sermonSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterMedia);
    }
    
    if (speakerFilter) {
        speakerFilter.addEventListener('change', filterMedia);
    }
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            searchMedia(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchMedia(this.value);
            }
        });
    }
    
    // Live stream button
    const watchLiveBtn = document.getElementById('watchLiveBtn');
    if (watchLiveBtn) {
        watchLiveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Live stream will begin at service time. Please check back later.');
        });
    }
    
    // Initialize upcoming streams
    initUpcomingStreams();
}

function renderMediaGrid(filteredMedia = media) {
    const container = document.getElementById('sermonsContainer');
    if (!container) return;
    
    if (filteredMedia.length === 0) {
        container.innerHTML = '<p class="text-center">No media found. Check back later for new content.</p>';
        return;
    }
    
    container.innerHTML = filteredMedia.map(item => `
        <div class="sermon-card">
            <div class="sermon-thumbnail">
                <img src="${item.thumbnail || 'https://images.unsplash.com/photo-1518834103329-0d6c95f1e6b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${item.title}">
                <div class="play-btn" data-video="${item.url}">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="sermon-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p class="sermon-meta">
                    ${item.speaker ? item.speaker + ' • ' : ''}
                    ${formatDate(item.date)}
                </p>
                <button class="btn-small watch-btn" data-video="${item.url}">
                    <i class="fas fa-play-circle"></i> Watch Now
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to watch buttons
    document.querySelectorAll('.play-btn, .watch-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const videoUrl = this.dataset.video;
            openVideoModal(videoUrl);
        });
    });
}

function filterMedia() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const speaker = document.getElementById('speakerFilter')?.value || 'all';
    
    let filtered = [...media];
    
    if (category !== 'all') {
        filtered = filtered.filter(item => item.type === category);
    }
    
    if (speaker !== 'all') {
        // Create a mapping of dropdown values to actual speaker names
        const speakerMapping = {
            'samson': 'Apostle Samson',
            'sammy': 'Reverend Sammy',
            'guest': 'Guest'
        };
        
        // Get the speaker name to search for
        const speakerToFind = speakerMapping[speaker] || speaker;
        
        // Filter by speaker
        filtered = filtered.filter(item => {
            if (!item.speaker) return false;
            
            // For guest speakers, check if "guest" is in the speaker name
            if (speaker === 'guest') {
                return item.speaker.toLowerCase().includes('guest');
            }
            
            // For specific speakers, check for exact match
            return item.speaker.toLowerCase().includes(speakerToFind.toLowerCase());
        });
    }
    
    renderMediaGrid(filtered);
}

function searchMedia(query) {
    if (!query || !query.trim()) {
        renderMediaGrid();
        return;
    }
    
    const filtered = media.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        (item.speaker && item.speaker.toLowerCase().includes(query.toLowerCase()))
    );
    
    renderMediaGrid(filtered);
}

function initSocialFeeds() {
    const feedTabs = document.querySelectorAll('.feed-tab');
    const feedContents = document.querySelectorAll('.feed-content');
    
    feedTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const feedType = this.dataset.feed;
            
            // Update active tab
            feedTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            feedContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === feedType + 'Feed') {
                    content.classList.add('active');
                }
            });
            
            // Load feed content
            loadFeedContent(feedType);
        });
    });
    
    // Load initial feed
    loadFeedContent('youtube');
}

function loadFeedContent(feedType) {
    if (feedType === 'youtube') {
        loadYouTubeFeed();
    } else if (feedType === 'instagram') {
        loadInstagramFeed();
    }
}

function loadYouTubeFeed() {
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) return;
    
    // Simulated YouTube videos
    const videos = [
        { id: 'dQw4w9WgXcQ', title: 'Sunday Service Highlights' },
        { id: '9bZkp7q19f0', title: 'Worship Night Recording' },
        { id: '7NOSDKb0HlU', title: 'Bible Study Session' },
        { id: 'JGwWNGJdvx8', title: 'Youth Ministry Update' }
    ];
    
    videoGrid.innerHTML = videos.map(video => `
        <div class="video-item" style="position: relative;">
            <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}">
            <div class="video-overlay">
                <button class="play-btn-small" data-video="https://www.youtube.com/embed/${video.id}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <p style="padding: 1rem;">${video.title}</p>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.play-btn-small').forEach(btn => {
        btn.addEventListener('click', function() {
            const videoUrl = this.dataset.video;
            openVideoModal(videoUrl);
        });
    });
}

function loadInstagramFeed() {
    const instagramGrid = document.querySelector('.instagram-grid');
    if (!instagramGrid) return;
    
    // Simulated Instagram posts
    const posts = [
        { image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', caption: 'Sunday Service Moments' },
        { image: 'https://images.unsplash.com/photo-1518834103329-0d6c95f1e6b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', caption: 'Community Outreach' },
        { image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', caption: 'Youth Group Activities' },
        { image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', caption: 'Worship Team Rehearsal' }
    ];
    
    instagramGrid.innerHTML = posts.map(post => `
        <div class="instagram-item">
            <img src="${post.image}" alt="${post.caption}">
            <p style="padding: 1rem;">${post.caption}</p>
        </div>
    `).join('');
}

function initUpcomingStreams() {
    const upcomingStreams = document.getElementById('upcomingStreams');
    if (!upcomingStreams) return;
    
    // Get upcoming events for streaming
    const upcomingEvents = events
        .filter(event => {
            const eventDate = new Date(event.date);
            const now = new Date();
            return eventDate >= now;
        })
        .slice(0, 3);
    
    if (upcomingEvents.length === 0) {
        upcomingStreams.innerHTML = '<li>No upcoming live streams scheduled</li>';
        return;
    }
    
    upcomingStreams.innerHTML = upcomingEvents.map(event => `
        <li>
            <strong>${formatDate(event.date)}</strong> - ${event.title}
        </li>
    `).join('');
}

// ===== EVENTS PAGE FUNCTIONS =====
function initEventsPage() {
    renderEventsGrid();
    initEventFilters();
    initCalendar();
    initEventModal();
    
    // Notification subscription
    const subscribeBtn = document.getElementById('subscribeBtn');
    const emailInput = document.getElementById('notificationEmail');
    
    if (subscribeBtn && emailInput) {
        subscribeBtn.addEventListener('click', function() {
            const email = emailInput.value.trim();
            if (validateEmail(email)) {
                subscribeToNotifications(email);
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
        
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                subscribeBtn.click();
            }
        });
    }
}

function renderEventsGrid(filter = 'upcoming') {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;
    
    let filteredEvents = [...events];
    const now = new Date();
    
    if (filter === 'upcoming') {
        filteredEvents = filteredEvents.filter(event => new Date(event.date) >= now);
    } else if (filter === 'past') {
        filteredEvents = filteredEvents.filter(event => new Date(event.date) < now);
    }
    
    // Sort by date
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = '<p class="text-center">No events found.</p>';
        return;
    }
    
    eventsGrid.innerHTML = filteredEvents.map(event => `
        <div class="event-card">
            <div class="event-image">
                <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="event-content">
                <span class="event-date">${formatDate(event.date)}</span>
                <h3>${event.title}</h3>
                <p><i class="fas fa-clock"></i> ${event.time} • <i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p>${event.description.substring(0, 100)}...</p>
                <div class="countdown" id="event-countdown-${event.id}">
                    ${createCountdownHTML(event.date)}
                </div>
                <button class="btn-small view-event-btn" data-id="${event.id}">View Details</button>
            </div>
        </div>
    `).join('');
    
    // Initialize countdowns
    filteredEvents.forEach(event => {
        if (new Date(event.date) >= now) {
            initializeCountdown(event.id, event.date);
        } else {
            const countdownEl = document.getElementById(`event-countdown-${event.id}`);
            if (countdownEl) {
                countdownEl.innerHTML = '<p>Event has passed</p>';
            }
        }
    });
    
    // Add event listeners
    document.querySelectorAll('.view-event-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = parseInt(this.dataset.id);
            const event = events.find(e => e.id === eventId);
            if (event) {
                showEventModal(event);
            }
        });
    });
}

function initEventFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const eventSearch = document.getElementById('eventSearch');
    const eventSearchBtn = document.getElementById('eventSearchBtn');
    
    // Tab filters
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Render events with filter
            renderEventsGrid(filter);
        });
    });
    
    // Search functionality
    if (eventSearchBtn && eventSearch) {
        eventSearchBtn.addEventListener('click', function() {
            searchEvents(eventSearch.value);
        });
        
        eventSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchEvents(this.value);
            }
        });
    }
}

function searchEvents(query) {
    if (!query || !query.trim()) {
        const activeTab = document.querySelector('.filter-tab.active');
        const filter = activeTab ? activeTab.dataset.filter : 'upcoming';
        renderEventsGrid(filter);
        return;
    }
    
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
    );
    
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;
    
    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = '<p class="text-center">No events found matching your search.</p>';
        return;
    }
    
    eventsGrid.innerHTML = filteredEvents.map(event => `
        <div class="event-card">
            <div class="event-image">
                <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="event-content">
                <span class="event-date">${formatDate(event.date)}</span>
                <h3>${event.title}</h3>
                <p><i class="fas fa-clock"></i> ${event.time} • <i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p>${event.description.substring(0, 100)}...</p>
                <button class="btn-small view-event-btn" data-id="${event.id}">View Details</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.view-event-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = parseInt(this.dataset.id);
            const event = events.find(e => e.id === eventId);
            if (event) {
                showEventModal(event);
            }
        });
    });
}

function initCalendar() {
    const currentMonthEl = document.getElementById('currentMonth');
    const calendarEl = document.getElementById('calendar');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    if (!currentMonthEl || !calendarEl || !prevMonthBtn || !nextMonthBtn) return;
    
    let currentDate = new Date();
    
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Update month header
        currentMonthEl.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        
        // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
        const firstDayIndex = firstDay.getDay();
        
        // Clear calendar
        calendarEl.innerHTML = '';
        
        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            calendarEl.appendChild(dayEl);
        });
        
        // Add empty cells for days before first day
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'calendar-date';
            calendarEl.appendChild(emptyEl);
        }
        
        // Add days
        for (let day = 1; day <= totalDays; day++) {
            const dateEl = document.createElement('div');
            dateEl.className = 'calendar-date';
            dateEl.textContent = day;
            
            // Check if this date has events
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const hasEvent = events.some(event => event.date === dateStr);
            
            if (hasEvent) {
                dateEl.classList.add('has-event');
                dateEl.title = 'Has events';
            }
            
            calendarEl.appendChild(dateEl);
        }
    }
    
    // Event listeners for navigation
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(new Date(currentDate));
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(new Date(currentDate));
    });
    
    // Initial render
    renderCalendar(currentDate);
}

function subscribeToNotifications(email) {
    // Get existing subscriptions
    const subscriptions = JSON.parse(localStorage.getItem('eventSubscriptions')) || [];
    
    // Check if already subscribed
    if (subscriptions.includes(email)) {
        alert('You are already subscribed to event notifications.');
        return;
    }
    
    // Add new subscription
    subscriptions.push(email);
    localStorage.setItem('eventSubscriptions', JSON.stringify(subscriptions));
    
    alert('Thank you for subscribing! You will receive notifications about upcoming events.');
}

// ===== GIVING PAGE FUNCTIONS =====
function initGivingPage() {
    const givingForm = document.getElementById('givingForm');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const successModal = document.getElementById('successModal');
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const giveButtons = document.querySelectorAll('.give-btn');
    
    if (!givingForm) return;
    
    // Amount button selection
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            customAmountInput.value = this.dataset.amount;
        });
    });
    
    // Custom amount input
    customAmountInput.addEventListener('input', function() {
        amountButtons.forEach(btn => btn.classList.remove('active'));
    });
    
    // Give buttons from option cards
    giveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            const givingType = document.getElementById('givingType');
            if (givingType) {
                givingType.value = type;
            }
        });
    });
    
    // Payment method toggle
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            const cardDetails = document.getElementById('cardDetails');
            if (cardDetails) {
                cardDetails.style.display = this.value === 'card' ? 'block' : 'none';
            }
        });
    });
    
    // Initialize card details visibility
    const cardDetails = document.getElementById('cardDetails');
    const defaultPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (cardDetails && defaultPaymentMethod) {
        cardDetails.style.display = defaultPaymentMethod.value === 'card' ? 'block' : 'none';
    }
    
    // Form submission
    givingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateGivingForm()) {
            return;
        }
        
        // Process donation (simulated)
        const donationData = {
            amount: parseFloat(customAmountInput.value) || 0,
            type: document.getElementById('givingType').value,
            frequency: document.getElementById('frequency').value,
            name: document.getElementById('donorName').value,
            email: document.getElementById('donorEmail').value,
            phone: document.getElementById('donorPhone').value || '',
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
            anonymous: document.getElementById('anonymous').checked,
            receipt: document.getElementById('receipt').checked,
            timestamp: new Date().toISOString()
        };
        
        // Save donation
        saveDonation(donationData);
        
        // Show success modal
        if (successModal) {
            successModal.style.display = 'flex';
        }
        
        // Reset form
        this.reset();
        amountButtons.forEach(btn => btn.classList.remove('active'));
        if (cardDetails) {
            cardDetails.style.display = 'block';
        }
    });
    
    // Close success modal
    if (closeSuccessModal && successModal) {
        closeSuccessModal.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }
    
    // Initialize verse slider
    initVerseSlider();
}

function validateGivingForm() {
    const amountInput = document.getElementById('customAmount');
    const amount = parseFloat(amountInput?.value || 0);
    const name = document.getElementById('donorName')?.value.trim() || '';
    const email = document.getElementById('donorEmail')?.value.trim() || '';
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid donation amount.');
        return false;
    }
    
    if (!name) {
        alert('Please enter your full name.');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

function saveDonation(donation) {
    // Get existing donations
    const donations = JSON.parse(localStorage.getItem('churchDonations')) || [];
    
    // Add new donation
    donations.push(donation);
    localStorage.setItem('churchDonations', JSON.stringify(donations));
    
    // Update statistics
    updateGivingStats();
}

function updateGivingStats() {
    const donations = JSON.parse(localStorage.getItem('churchDonations')) || [];
    
    // Calculate totals
    const total = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
    const now = new Date();
    const thisMonth = donations
        .filter(d => {
            try {
                const donationDate = new Date(d.timestamp);
                return donationDate.getMonth() === now.getMonth() &&
                       donationDate.getFullYear() === now.getFullYear();
            } catch (e) {
                return false;
            }
        })
        .reduce((sum, donation) => sum + (donation.amount || 0), 0);
    
    const average = donations.length > 0 ? total / donations.length : 0;
    
    // Update UI elements if they exist
    const totalEl = document.getElementById('totalDonationsSum');
    const monthlyEl = document.getElementById('monthlyDonations');
    const averageEl = document.getElementById('averageDonation');
    
    if (totalEl) totalEl.textContent = `Ksh${total.toFixed(2)}`;
    if (monthlyEl) monthlyEl.textContent = `Ksh${thisMonth.toFixed(2)}`;
    if (averageEl) averageEl.textContent = `Ksh${average.toFixed(2)}`;
}

function initVerseSlider() {
    const slides = document.querySelectorAll('.verse-slide');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
}

// ===== CONTACT PAGE FUNCTIONS =====
function initContactPage() {
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('contactSuccessModal');
    const closeModalBtn = document.getElementById('closeContactModal');
    const openMapBtn = document.getElementById('openMapBtn');
    
    if (!contactForm) return;
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateContactForm()) {
            return;
        }
        
        const formData = {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            phone: document.getElementById('contactPhone').value.trim() || 'Not provided',
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value.trim(),
            newsletter: document.getElementById('newsletterOptIn').checked,
            prayerTeam: document.getElementById('prayerTeam').checked,
            timestamp: new Date().toISOString()
        };
        
        // Save contact message
        saveContactMessage(formData);
        
        // Show success modal
        if (successModal) {
            successModal.style.display = 'flex';
        }
        
        // Reset form
        this.reset();
    });
    
    // Close success modal
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
        
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }
    
    // Map button
    if (openMapBtn) {
        openMapBtn.addEventListener('click', function() {
            alert('Opening directions in Google Maps... (This would link to actual map in production)');
        });
    }
}

function validateContactForm() {
    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const subject = document.getElementById('contactSubject')?.value || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';
    
    if (!name) {
        alert('Please enter your name.');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    if (!subject) {
        alert('Please select a subject.');
        return false;
    }
    
    if (!message) {
        alert('Please enter your message.');
        return false;
    }
    
    return true;
}

function saveContactMessage(message) {
    try {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(message);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    } catch (e) {
        console.error('Error saving contact message:', e);
    }
}

// ===== MODAL FUNCTIONS =====
function initVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!videoModal || !closeModal) return;
    
    // Close modal
    closeModal.addEventListener('click', function() {
        videoModal.style.display = 'none';
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            videoPlayer.src = '';
        }
    });
    
    // Close when clicking outside
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            const videoPlayer = document.getElementById('videoPlayer');
            if (videoPlayer) {
                videoPlayer.src = '';
            }
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.style.display === 'flex') {
            videoModal.style.display = 'none';
            const videoPlayer = document.getElementById('videoPlayer');
            if (videoPlayer) {
                videoPlayer.src = '';
            }
        }
    });
}

function openVideoModal(videoUrl) {
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    
    if (!videoModal || !videoPlayer) return;
    
    videoPlayer.src = videoUrl;
    videoModal.style.display = 'flex';
}

function initEventModal() {
    const eventModal = document.getElementById('eventModal');
    const closeModal = eventModal?.querySelector('.close-modal');
    
    if (!eventModal || !closeModal) return;
    
    // Close modal
    closeModal.addEventListener('click', function() {
        eventModal.style.display = 'none';
    });
    
    // Close when clicking outside
    eventModal.addEventListener('click', function(e) {
        if (e.target === eventModal) {
            eventModal.style.display = 'none';
        }
    });
}

function showEventModal(event) {
    const eventModal = document.getElementById('eventModal');
    const modalContent = document.getElementById('eventModalContent');
    
    if (!eventModal || !modalContent) return;
    
    modalContent.innerHTML = `
        <h2>${event.title}</h2>
        <div class="event-meta">
            <p><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
            <p><i class="fas fa-clock"></i> ${event.time}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p><i class="fas fa-tag"></i> ${event.type}</p>
        </div>
        <div class="event-description">
            <h3>Description</h3>
            <p>${event.description}</p>
        </div>
        <div class="event-actions">
            <button class="btn-primary" id="rsvpBtn">
                <i class="fas fa-user-plus"></i> RSVP to Event
            </button>
            <button class="btn-secondary" id="addToCalendarBtn">
                <i class="fas fa-calendar-plus"></i> Add to Calendar
            </button>
        </div>
    `;
    
    eventModal.style.display = 'flex';
    
    // Add event listeners to buttons
    setTimeout(() => {
        const rsvpBtn = document.getElementById('rsvpBtn');
        const calendarBtn = document.getElementById('addToCalendarBtn');
        
        if (rsvpBtn) {
            rsvpBtn.addEventListener('click', function() {
                alert('Thank you for your RSVP! We look forward to seeing you.');
            });
        }
        
        if (calendarBtn) {
            calendarBtn.addEventListener('click', function() {
                alert('Event added to your calendar.');
            });
        }
    }, 100);
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (e) {
        return dateString;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.toggleTheme = toggleTheme;
window.openVideoModal = openVideoModal;
window.showEventModal = showEventModal;