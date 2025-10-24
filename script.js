// Health tips database
const healthTips = [
    "💧 Drink plenty of water throughout the day to support digestion and prevent constipation.",
    "🥗 Include fiber-rich foods like vegetables, fruits, and whole grains in your diet for better digestive health.",
    "🚶 Regular physical activity helps improve blood circulation and promotes healing.",
    "🧘 Practice stress-reducing activities like meditation or yoga to support overall wellness.",
    "🌰 Eat foods rich in vitamins A, C, and E to promote tissue repair and healing.",
    "⏰ Maintain a regular eating schedule to keep your digestive system functioning smoothly.",
    "🥑 Include healthy fats from nuts, seeds, and avocados for better nutrient absorption.",
    "😴 Get 7-8 hours of quality sleep each night to support your body's natural healing processes.",
    "🌿 Try natural remedies like aloe vera juice or probiotic-rich foods for gut health.",
    "🚫 Avoid spicy, processed, and fried foods that can irritate the digestive system."
];

// Initialize data storage
let trackerData = {
    tasks: {},
    water: 0,
    progress: {
        weight: null,
        steps: null,
        exercise: null,
        sleep: null
    },
    classes: [
        { day: 1, name: 'Mathematics', time: '9:00 AM', duration: '2 hours' },
        { day: 1, name: 'Physics', time: '2:00 PM', duration: '1.5 hours' },
        { day: 3, name: 'Chemistry', time: '10:00 AM', duration: '2 hours' },
        { day: 3, name: 'Biology', time: '3:00 PM', duration: '1.5 hours' },
        { day: 4, name: 'Computer Science', time: '9:00 AM', duration: '2 hours' },
        { day: 4, name: 'English', time: '1:00 PM', duration: '1 hour' }
    ],
    challengeDays: Array(90).fill(false),
    currentStreak: 0,
    longestStreak: 0,
    lastReset: new Date().toDateString()
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('healthTrackerData');
    if (saved) {
        const loadedData = JSON.parse(saved);
        trackerData = {
            tasks: loadedData.tasks || {},
            water: loadedData.water || 0,
            progress: loadedData.progress || {
                weight: null,
                steps: null,
                exercise: null,
                sleep: null
            },
            classes: loadedData.classes || trackerData.classes,
            challengeDays: loadedData.challengeDays || Array(90).fill(false),
            currentStreak: loadedData.currentStreak || 0,
            longestStreak: loadedData.longestStreak || 0,
            lastReset: loadedData.lastReset || new Date().toDateString()
        };
        
        if (trackerData.lastReset !== new Date().toDateString()) {
            trackerData.tasks = {};
            trackerData.water = 0;
            trackerData.lastReset = new Date().toDateString();
        }
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('healthTrackerData', JSON.stringify(trackerData));
}

// Check if it's a new day and reset data
function checkAndResetDay() {
    const today = new Date().toDateString();
    
    if (trackerData.lastReset !== today) {
        saveToHistory();
        trackerData.tasks = {};
        trackerData.water = 0;
        trackerData.progress = {
            weight: trackerData.progress.weight,
            steps: null,
            exercise: null,
            sleep: null
        };
        trackerData.lastReset = today;
        saveData();
        location.reload();
    }
}

// Save progress to history
function saveToHistory() {
    let history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
    
    const todayData = {
        date: trackerData.lastReset,
        tasksCompleted: Object.values(trackerData.tasks).filter(Boolean).length,
        totalTasks: document.querySelectorAll('.task-item').length,
        water: trackerData.water,
        progress: { ...trackerData.progress }
    };
    
    history.push(todayData);
    
    if (history.length > 30) {
        history = history.slice(-30);
    }
    
    localStorage.setItem('healthHistory', JSON.stringify(history));
}

// Update date display
function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('en-US', options);
}

// Display random health tip
function displayHealthTip() {
    const tip = healthTips[Math.floor(Math.random() * healthTips.length)];
    document.getElementById('healthTip').textContent = tip;
}

// Toggle task completion
function toggleTask(e) {
    const taskItem = e.currentTarget;
    const taskId = taskItem.dataset.task;
    const checkbox = taskItem.querySelector('.checkbox');
    
    checkbox.checked = !checkbox.checked;
    taskItem.classList.toggle('completed');
    
    trackerData.tasks[taskId] = checkbox.checked;
    saveData();
    updateStats();
}

// Load task states
function loadTaskStates() {
    document.querySelectorAll('.task-item').forEach(task => {
        const taskId = task.dataset.task;
        if (trackerData.tasks[taskId]) {
            task.classList.add('completed');
            task.querySelector('.checkbox').checked = true;
        }
    });
}

// Create water tracker
function createWaterTracker() {
    const container = document.getElementById('waterTracker');
    container.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        const glass = document.createElement('div');
        glass.className = 'water-glass';
        if (i < trackerData.water) {
            glass.classList.add('filled');
        }
        glass.addEventListener('click', () => toggleWaterGlass(i));
        container.appendChild(glass);
    }
    
    document.getElementById('waterCount').textContent = trackerData.water;
}

// Toggle water glass
function toggleWaterGlass(index) {
    trackerData.water = index + 1;
    saveData();
    createWaterTracker();
}

// Update progress
function updateProgress(field, value) {
    trackerData.progress[field] = parseFloat(value) || null;
    document.getElementById(field + 'Display').textContent = value || '--';
    saveData();
}

// Load progress values
function loadProgressValues() {
    ['weight', 'steps', 'exercise', 'sleep'].forEach(field => {
        const value = trackerData.progress[field];
        if (value !== null) {
            document.getElementById(field + 'Input').value = value;
            document.getElementById(field + 'Display').textContent = value;
        }
    });
}

// Update statistics
function updateStats() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = Object.values(trackerData.tasks).filter(Boolean).length;
    const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('tasksCompleted').textContent = completedTasks;
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completionRate').textContent = rate + '%';
}

// Challenge tracker functions
function createChallengeGrid() {
    const grid = document.getElementById('challengeGrid');
    grid.innerHTML = '';
    
    trackerData.challengeDays.forEach((completed, index) => {
        const dayBox = document.createElement('div');
        dayBox.className = `day-box ${completed ? 'completed' : ''}`;
        dayBox.textContent = index + 1;
        dayBox.onclick = () => toggleDay(index);
        grid.appendChild(dayBox);
    });

    updateChallengeProgress();
}

function toggleDay(index) {
    trackerData.challengeDays[index] = !trackerData.challengeDays[index];
    saveData();
    createChallengeGrid();
    updateStreaks();
}

function updateChallengeProgress() {
    const completed = trackerData.challengeDays.filter(day => day).length;
    const progress = (completed / 90) * 100;
    
    document.getElementById('challengeProgress').style.width = `${progress}%`;
    document.getElementById('challengeProgressText').textContent = `${completed}/90 days`;
}

function updateStreaks() {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    trackerData.challengeDays.forEach((day, index) => {
        if (day) {
            tempStreak++;
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
            if (index === trackerData.challengeDays.length - 1) {
                currentStreak = tempStreak;
            }
        } else {
            tempStreak = 0;
        }
    });

    trackerData.currentStreak = currentStreak;
    trackerData.longestStreak = longestStreak;

    document.getElementById('currentStreak').textContent = currentStreak;
    document.getElementById('longestStreak').textContent = longestStreak;
    
    saveData();
}

// Display class schedule
function displayClassSchedule() {
    const today = new Date().getDay();
    const container = document.getElementById('classSchedule');
    const taskContainer = document.getElementById('classTasks');
    
    if (!trackerData.classes || !Array.isArray(trackerData.classes)) {
        trackerData.classes = [
            { day: 1, name: 'Mathematics', time: '9:00 AM', duration: '2 hours' },
            { day: 1, name: 'Physics', time: '2:00 PM', duration: '1.5 hours' },
            { day: 3, name: 'Chemistry', time: '10:00 AM', duration: '2 hours' },
            { day: 3, name: 'Biology', time: '3:00 PM', duration: '1.5 hours' },
            { day: 4, name: 'Computer Science', time: '9:00 AM', duration: '2 hours' },
            { day: 4, name: 'English', time: '1:00 PM', duration: '1 hour' }
        ];
        saveData();
    }
    
    const hasClassToday = [1, 3, 4].includes(today);
    
    if (!hasClassToday) {
        container.innerHTML = '<div class="no-class-message">🎉 No classes today! Enjoy your free day.</div>';
        taskContainer.innerHTML = '';
        return;
    }
    
    const todayClasses = trackerData.classes.filter(c => c.day === today);
    
    if (todayClasses.length === 0) {
        container.innerHTML = '<div class="no-class-message">🎉 No classes today! Enjoy your free day.</div>';
        taskContainer.innerHTML = '';
        return;
    }
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    container.innerHTML = `
        <div style="background: #2d3756; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
            <strong>📅 ${dayNames[today]} - Class Day</strong>
            <div style="font-size: 0.9em; margin-top: 5px; color: #9fa6fb;">
                You have ${todayClasses.length} class${todayClasses.length > 1 ? 'es' : ''} today
            </div>
        </div>
    `;
    
    let tasksHtml = '';
    todayClasses.forEach((cls, index) => {
        const taskId = `class-${today}-${index}`;
        const isCompleted = trackerData.tasks[taskId] || false;
        
        tasksHtml += `
            <li class="task-item ${isCompleted ? 'completed' : ''}" data-task="${taskId}">
                <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''}>
                <span>${cls.name}</span>
                <span class="task-time">${cls.time}</span>
            </li>
            <div class="meal-suggestion">⏱️ Duration: ${cls.duration}</div>
        `;
    });
    
    taskContainer.innerHTML = tasksHtml;
    
    taskContainer.querySelectorAll('.task-item').forEach(task => {
        task.addEventListener('click', toggleTask);
    });
}

// Settings functions
function showSettings() {
    document.getElementById('settingsPanel').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    
    const tasks = document.querySelectorAll('.task-item');
    let html = '';
    
    tasks.forEach(task => {
        const taskName = task.querySelector('span:not(.task-time)').textContent;
        const taskTime = task.querySelector('.task-time').textContent;
        const taskId = task.dataset.task;
        
        html += `
            <div class="setting-item">
                <label>${taskName}</label>
                <input type="time" id="setting-${taskId}" value="${convertTo24Hour(taskTime)}">
            </div>
        `;
    });
    
    document.getElementById('settingsContent').innerHTML = html;
}

function closeSettings() {
    document.getElementById('settingsPanel').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function saveSettings() {
    const tasks = document.querySelectorAll('.task-item');
    
    tasks.forEach(task => {
        const taskId = task.dataset.task;
        const timeInput = document.getElementById('setting-' + taskId);
        if (timeInput) {
            const time = convertTo12Hour(timeInput.value);
            task.querySelector('.task-time').textContent = time;
        }
    });
    
    closeSettings();
    alert('✅ Settings saved successfully!');
}

function convertTo24Hour(time12) {
    const [time, period] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function convertTo12Hour(time24) {
    let [hours, minutes] = time24.split(':');
    hours = parseInt(hours);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes} ${period}`;
}

// Class settings functions
function showClassSettings() {
    if (!trackerData.classes || !Array.isArray(trackerData.classes)) {
        trackerData.classes = [];
    }
    
    document.getElementById('settingsPanel').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let html = '<h3 style="color: #667eea; margin-bottom: 15px;">Your Classes</h3>';
    
    if (trackerData.classes.length === 0) {
        html += '<p style="text-align: center; color: #9fa6fb; margin: 20px 0;">No classes added yet. Click "Add New Class" to get started!</p>';
    } else {
        const classByDay = {};
        trackerData.classes.forEach((cls, index) => {
            if (!classByDay[cls.day]) classByDay[cls.day] = [];
            classByDay[cls.day].push({ ...cls, index });
        });
        
        Object.keys(classByDay).sort().forEach(day => {
            html += `<div style="margin-bottom: 20px; padding: 15px; background: #2a2d3e; border-radius: 8px;">`;
            html += `<h4 style="color: #9fa6fb; margin-bottom: 10px;">${dayNames[day]}</h4>`;
            
            classByDay[day].forEach(cls => {
                html += `
                    <div class="setting-item" style="background: #1e2030; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                        <label>Class Name</label>
                        <input type="text" class="class-name" data-index="${cls.index}" value="${cls.name}" style="margin-bottom: 8px;">
                        <label>Time</label>
                        <input type="time" class="class-time" data-index="${cls.index}" value="${convertTo24Hour(cls.time)}" style="margin-bottom: 8px;">
                        <label>Duration</label>
                        <input type="text" class="class-duration" data-index="${cls.index}" value="${cls.duration}" placeholder="e.g., 2 hours">
                        <button onclick="deleteClass(${cls.index})" class="btn" style="background: #dc3545; margin-top: 8px; padding: 8px 15px;">Delete</button>
                    </div>
                `;
            });
            html += '</div>';
        });
    }
    
    html += `
        <button class="btn" id="addNewClassBtn" style="width: 100%; margin-bottom: 10px;">+ Add New Class</button>
        <button class="btn" id="saveClassSettingsBtn">Save Changes</button>
    `;
    
    document.getElementById('settingsContent').innerHTML = html;
    
    document.getElementById('addNewClassBtn').addEventListener('click', addNewClass);
    document.getElementById('saveClassSettingsBtn').addEventListener('click', saveClassSettings);
}

function deleteClass(index) {
    if (confirm('Are you sure you want to delete this class?')) {
        trackerData.classes = trackerData.classes.filter((_, i) => i !== index);
        saveData();
        showClassSettings();
        displayClassSchedule();
    }
}

function addNewClass() {
    const name = prompt('Enter class name:');
    if (!name) return;
    
    const dayInput = prompt('Enter day (1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 0=Sunday):');
    const day = parseInt(dayInput);
    
    if (isNaN(day) || day < 0 || day > 6) {
        alert('Invalid day! Please enter 0-6.');
        return;
    }
    
    const time = prompt('Enter time (e.g., 9:00 AM):');
    if (!time) return;
    
    const duration = prompt('Enter duration (e.g., 2 hours):');
    if (!duration) return;
    
    trackerData.classes.push({ day, name, time, duration });
    saveData();
    showClassSettings();
    displayClassSchedule();
}

function saveClassSettings() {
    document.querySelectorAll('.class-name').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (trackerData.classes[index]) {
            trackerData.classes[index].name = input.value;
        }
    });
    
    document.querySelectorAll('.class-time').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (trackerData.classes[index]) {
            trackerData.classes[index].time = convertTo12Hour(input.value);
        }
    });
    
    document.querySelectorAll('.class-duration').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (trackerData.classes[index]) {
            trackerData.classes[index].duration = input.value;
        }
    });
    
    saveData();
    displayClassSchedule();
    closeSettings();
    alert('✅ Class settings saved successfully!');
}

// ====================
// NOTIFICATION SYSTEM
// ====================

// Generate notification sound using Web Audio API
function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.frequency.value = 800;
        oscillator1.type = 'sine';
        
        oscillator2.frequency.value = 1000;
        oscillator2.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.5);
        oscillator2.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio playback failed:', error);
    }
}

// Setup notification system
function setupNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                scheduleNotifications();
                showNotificationStatus('✅ Notifications enabled! You will receive reminders.');
            } else {
                showNotificationStatus('⚠️ Notifications blocked. Enable them in your browser settings.');
            }
        });
    } else {
        showNotificationStatus('⚠️ Notifications not supported in this browser.');
    }
}

function showNotificationStatus(message) {
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2a2d3e;
        color: #e4e6f1;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    statusDiv.textContent = message;
    document.body.appendChild(statusDiv);
    
    setTimeout(() => {
        statusDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => statusDiv.remove(), 300);
    }, 3000);
}

// Schedule notifications
function scheduleNotifications() {
    if (window.notificationInterval) {
        clearInterval(window.notificationInterval);
    }

    const notifiedTasks = new Set();

    window.notificationInterval = setInterval(() => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        const tasks = getAllTasks();
        
        tasks.forEach(task => {
            const taskTime = parseTaskTime(task.time);
            if (!taskTime) return;

            const taskMinutes = taskTime.getHours() * 60 + taskTime.getMinutes();
            const timeDiff = taskMinutes - currentMinutes;
            
            const taskKey = `${task.name}-${task.time}`;
            
            if (timeDiff === 10 && !notifiedTasks.has(taskKey + '-10')) {
                sendNotification(task.name, task.time, task.type, '10 minutes');
                notifiedTasks.add(taskKey + '-10');
            }
            
            if (timeDiff === 0 && !notifiedTasks.has(taskKey + '-0')) {
                sendNotification(task.name, task.time, task.type, 'now');
                notifiedTasks.add(taskKey + '-0');
            }
            
            if (timeDiff < -120) {
                notifiedTasks.delete(taskKey + '-10');
                notifiedTasks.delete(taskKey + '-0');
            }
        });
    }, 30000);
    
    console.log('✅ Notification system activated');
}

// Get all tasks for notifications
function getAllTasks() {
    const tasks = [];
    
    tasks.push(
        { name: "Wake-up & Stretch", time: "6:00 AM", type: "morning" },
        { name: "Water + Lemon", time: "6:15 AM", type: "morning" },
        { name: "Meditation", time: "6:30 AM", type: "morning" },
        { name: "Morning Exercise", time: "7:00 AM", type: "exercise" }
    );

    tasks.push(
        { name: "Morning Yoga", time: "7:00 AM", type: "exercise" },
        { name: "Gym / Home Workout", time: "6:00 PM", type: "exercise" },
        { name: "Evening Walk", time: "7:00 PM", type: "exercise" }
    );

    const today = new Date().getDay();
    if (trackerData.classes && Array.isArray(trackerData.classes)) {
        const todayClasses = trackerData.classes.filter(c => c.day === today);
        todayClasses.forEach(cls => {
            tasks.push({
                name: `📚 ${cls.name} Class`,
                time: cls.time,
                type: "class"
            });
        });
    }

    const meals = [
        { name: "🍳 Breakfast", time: "8:00 AM", type: "meal" },
        { name: "🍎 Mid-Morning Snack", time: "11:00 AM", type: "meal" },
        { name: "🍱 Lunch", time: "1:00 PM", type: "meal" },
        { name: "🥜 Evening Snack", time: "5:00 PM", type: "meal" },
        { name: "🍲 Dinner", time: "7:30 PM", type: "meal" }
    ];
    tasks.push(...meals);

    return tasks;
}

// Parse task time
function parseTaskTime(timeStr) {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    const now = new Date();
    const taskTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
        period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : 
        period === 'AM' && hours === '12' ? 0 : parseInt(hours),
        parseInt(minutes));
    return taskTime;
}

// Send notification
function sendNotification(taskName, taskTime, taskType, timing) {
    playNotificationSound();
    
    let icon = '⏰';
    let message = '';
    
    switch(taskType) {
        case 'exercise':
        case 'workout':
            icon = '💪';
            message = timing === 'now' 
                ? `Time for ${taskName}! Let's get moving!` 
                : `${taskName} starts in ${timing}. Get ready!`;
            break;
        case 'meal':
            icon = '🍽️';
            message = timing === 'now'
                ? `${taskName} time! Don't skip your meal.`
                : `${taskName} in ${timing}. Start preparing!`;
            break;
        case 'class':
            icon = '📚';
            message = timing === 'now'
                ? `${taskName} is starting now!`
                : `${taskName} starts in ${timing}`;
            break;
        case 'morning':
            icon = '🌅';
            message = timing === 'now'
                ? `Time for ${taskName}!`
                : `${taskName} in ${timing}`;
            break;
        default:
            message = timing === 'now'
                ? `Time for ${taskName}!`
                : `${taskName} starts in ${timing}`;
    }
    
    if (Notification.permission === 'granted') {
        const notification = new Notification(`${icon} ${taskName}`, {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23667eea"/><text x="50" y="65" font-size="50" text-anchor="middle" fill="white">' + icon + '</text></svg>',
            vibrate: [200, 100, 200],
            requireInteraction: false,
            silent: false,
            tag: `task-${taskName}-${timing}`
        });

        notification.onclick = function() {
            window.focus();
            this.close();
        };
        
        setTimeout(() => notification.close(), 10000);
    }
    
    showInAppNotification(icon, taskName, message, taskType);
}

// Show in-app notification
function showInAppNotification(icon, title, message, type) {
    const notification = document.createElement('div');
    const colors = {
        exercise: '#667eea',
        workout: '#667eea',
        meal: '#f59e0b',
        class: '#10b981',
        morning: '#ec4899'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, ${colors[type] || '#667eea'} 0%, ${colors[type] || '#764ba2'} 100%);
        color: white;
        padding: 20px 25px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        z-index: 10000;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.4s ease, pulse 0.5s ease 0.2s;
        cursor: pointer;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 2.5em;">${icon}</div>
            <div style="flex: 1;">
                <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 5px;">${title}</div>
                <div style="font-size: 0.95em; opacity: 0.95;">${message}</div>
            </div>
            <div style="font-size: 1.5em; opacity: 0.7; cursor: pointer;" onclick="this.parentElement.parentElement.remove()">×</div>
        </div>
    `;
    
    notification.onclick = function(e) {
        if (e.target.tagName !== 'DIV' || !e.target.textContent.includes('×')) {
            this.remove();
        }
    };
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }
    }, 10000);
}

// Initialize app
function init() {
    loadData();
    checkAndResetDay();
    updateDateDisplay();
    displayHealthTip();
    createWaterTracker();
    loadTaskStates();
    loadProgressValues();
    displayClassSchedule();
    updateStats();
    createChallengeGrid();
    updateStreaks();
    
    document.querySelectorAll('.task-item').forEach(task => {
        task.addEventListener('click', toggleTask);
    });
    
    ['weight', 'steps', 'exercise', 'sleep'].forEach(field => {
        const input = document.getElementById(field + 'Input');
        input.addEventListener('change', () => updateProgress(field, input.value));
    });
    
    setInterval(checkAndResetDay, 60000);
    setInterval(updateDateDisplay, 60000);
    
    if ('Notification' in window && Notification.permission === 'granted') {
        scheduleNotifications();
        console.log('✅ Notifications auto-enabled');
    }
}

// Initialize on page load
window.addEventListener('load', init);



// 🔊 Global Audio Context for notifications
let audioContext;

function initAudioContext() {
    try {
        if (!audioContext || audioContext.state === "closed") {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
        console.log("✅ Audio context initialized");
    } catch (err) {
        console.error("⚠️ Failed to initialize audio context:", err);
    }
}

// Notification system with sound
let notifiedTasks = new Set();

function setupNotifications() {
    initAudioContext(); // ✅ Unlock audio on user click

    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        alert('⚠️ Your browser does not support notifications. Please use Chrome, Firefox, or Safari for the best experience.');
        return;
    }

    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                alert('✅ Notifications enabled! You will receive reminders for classes, meals, and workouts.');
                scheduleNotifications();
            } else {
                alert('❌ Notifications blocked. Please enable notifications in your browser settings to receive reminders.');
            }
        });
    } else if (Notification.permission === 'granted') {
        scheduleNotifications();
    } else {
        alert('❌ Notifications are blocked. Please enable notifications in your browser settings.');
    }
}

function scheduleNotifications() {
    if (window.notificationInterval) clearInterval(window.notificationInterval);
    window.notificationInterval = setInterval(checkUpcomingTasks, 30000);
    checkUpcomingTasks();
}

// (rest of notification code remains same as user version)
// (rest of notification code remains same as user version)
