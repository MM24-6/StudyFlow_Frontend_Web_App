/**
 * StudyFlow — Storage & Data Management
 * Handles localStorage persistence and default demo data
 */

const STORAGE_KEYS = {
  ASSIGNMENTS: 'studyflow_assignments',
  NOTES: 'studyflow_notes',
  SESSIONS: 'studyflow_sessions',
  THEME: 'studyflow_theme',
  PREFERENCES: 'studyflow_preferences',
  INITIALIZED: 'studyflow_initialized'
};

const StudyFlowStorage = {
  get(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
};

const defaultAssignments = [
  {
    id: 'a1',
    title: 'React Component Library',
    subject: 'Web Development',
    description: 'Build a reusable component library with Storybook documentation.',
    dueDate: '2026-08-24',
    priority: 'high',
    status: 'in-progress',
    completed: false,
    createdAt: '2026-08-01'
  },
  {
    id: 'a2',
    title: 'SQL Query Optimization Report',
    subject: 'Database Systems',
    description: 'Analyze and optimize complex SQL queries with execution plans.',
    dueDate: '2026-08-28',
    priority: 'medium',
    status: 'pending',
    completed: false,
    createdAt: '2026-08-03'
  },
  {
    id: 'a3',
    title: 'Neural Network Implementation',
    subject: 'Machine Learning',
    description: 'Implement a feedforward neural network from scratch in Python.',
    dueDate: '2026-08-23',
    priority: 'high',
    status: 'in-progress',
    completed: false,
    createdAt: '2026-07-28'
  },
  {
    id: 'a4',
    title: 'Network Protocol Analysis',
    subject: 'Computer Networks',
    description: 'Capture and analyze TCP/IP packets using Wireshark.',
    dueDate: '2026-08-26',
    priority: 'low',
    status: 'pending',
    completed: false,
    createdAt: '2026-08-05'
  },
  {
    id: 'a5',
    title: 'Agile Sprint Retrospective',
    subject: 'Software Engineering',
    description: 'Document team retrospective findings and action items.',
    dueDate: '2026-08-22',
    priority: 'medium',
    status: 'completed',
    completed: true,
    createdAt: '2026-08-06'
  },
  {
    id: 'a6',
    title: 'REST API Documentation',
    subject: 'Web Development',
    description: 'Create comprehensive OpenAPI documentation for the project API.',
    dueDate: '2026-08-28',
    priority: 'medium',
    status: 'pending',
    completed: false,
    createdAt: '2026-08-07'
  }
];

const defaultNotes = [
  {
    id: 'n1',
    title: 'CSS Grid vs Flexbox',
    content: 'Use Grid for two-dimensional layouts (rows and columns). Use Flexbox for one-dimensional layouts (either row or column). Grid is better for page layouts, Flexbox for component alignment.',
    category: 'Web Development',
    tags: ['css', 'layout'],
    pinned: true,
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10'
  },
  {
    id: 'n2',
    title: 'Normalization Forms',
    content: '1NF: Atomic values, no repeating groups. 2NF: 1NF + no partial dependencies. 3NF: 2NF + no transitive dependencies. BCNF: Every determinant is a candidate key.',
    category: 'Database Systems',
    tags: ['database', 'normalization'],
    pinned: true,
    createdAt: '2026-08-08',
    updatedAt: '2026-08-09'
  },
  {
    id: 'n3',
    title: 'Gradient Descent Notes',
    content: 'Learning rate controls step size. Too high = overshooting. Too low = slow convergence. Use Adam optimizer for adaptive learning rates. Always normalize features before training.',
    category: 'Machine Learning',
    tags: ['ml', 'optimization'],
    pinned: false,
    createdAt: '2026-08-07',
    updatedAt: '2026-08-07'
  },
  {
    id: 'n4',
    title: 'OSI Model Layers',
    content: '7. Application - HTTP, DNS. 6. Presentation - SSL, JPEG. 5. Session - NetBIOS. 4. Transport - TCP, UDP. 3. Network - IP, ICMP. 2. Data Link - Ethernet. 1. Physical - Cables.',
    category: 'Computer Networks',
    tags: ['networking', 'osi'],
    pinned: false,
    createdAt: '2026-08-05',
    updatedAt: '2026-08-05'
  },
  {
    id: 'n5',
    title: 'Design Patterns Summary',
    content: 'Creational: Singleton, Factory, Builder. Structural: Adapter, Decorator, Facade. Behavioral: Observer, Strategy, Command. Choose based on problem context, not popularity.',
    category: 'Software Engineering',
    tags: ['patterns', 'oop'],
    pinned: false,
    createdAt: '2026-08-04',
    updatedAt: '2026-08-04'
  }
];

const defaultSessions = [
  { id: 's1', subject: 'Web Development', date: '2026-08-18', startTime: '09:00', duration: 90, type: 'coding', day: 'Tuesday' },
  { id: 's2', subject: 'Machine Learning', date: '2026-08-18', startTime: '14:00', duration: 120, type: 'lecture', day: 'Tuesday' },
  { id: 's3', subject: 'Database Systems', date: '2026-08-19', startTime: '10:00', duration: 60, type: 'review', day: 'Wednesday' },
  { id: 's4', subject: 'Computer Networks', date: '2026-08-19', startTime: '16:00', duration: 90, type: 'lab', day: 'Wednesday' },
  { id: 's5', subject: 'Software Engineering', date: '2026-08-20', startTime: '11:00', duration: 60, type: 'group', day: 'Thursday' },
  { id: 's6', subject: 'Web Development', date: '2026-08-21', startTime: '09:00', duration: 120, type: 'coding', day: 'Friday' },
  { id: 's7', subject: 'Machine Learning', date: '2026-08-22', startTime: '10:00', duration: 180, type: 'project', day: 'Saturday' }
];

const defaultCourses = [
  {
    id: 'c1',
    name: 'Web Development',
    instructor: 'Dr. Sarah Chen',
    progress: 72,
    totalModules: 12,
    completedModules: 9,
    nextLesson: 'React State Management',
    icon: 'web',
    color: '#6366f1'
  },
  {
    id: 'c2',
    name: 'Database Systems',
    instructor: 'Prof. James Wilson',
    progress: 58,
    totalModules: 10,
    completedModules: 6,
    nextLesson: 'Transaction Management',
    icon: 'db',
    color: '#22d3ee'
  },
  {
    id: 'c3',
    name: 'Machine Learning',
    instructor: 'Dr. Aisha Patel',
    progress: 45,
    totalModules: 14,
    completedModules: 6,
    nextLesson: 'Support Vector Machines',
    icon: 'ml',
    color: '#8b5cf6'
  },
  {
    id: 'c4',
    name: 'Computer Networks',
    instructor: 'Prof. Michael Torres',
    progress: 65,
    totalModules: 11,
    completedModules: 7,
    nextLesson: 'Routing Protocols',
    icon: 'net',
    color: '#22c55e'
  },
  {
    id: 'c5',
    name: 'Software Engineering',
    instructor: 'Dr. Emily Rodriguez',
    progress: 80,
    totalModules: 10,
    completedModules: 8,
    nextLesson: 'DevOps & CI/CD',
    icon: 'se',
    color: '#f59e0b'
  }
];

const defaultPreferences = {
  name: 'Madiha',
  email: 'madiha.manzoor@student.edu',
  program: 'Computer Science',
  avatar: 'MM',
  notifications: true,
  emailReminders: false,
  weeklyGoal: 25
};

function initializeStorage() {
  if (!StudyFlowStorage.get(STORAGE_KEYS.INITIALIZED)) {
    StudyFlowStorage.set(STORAGE_KEYS.ASSIGNMENTS, defaultAssignments);
    StudyFlowStorage.set(STORAGE_KEYS.NOTES, defaultNotes);
    StudyFlowStorage.set(STORAGE_KEYS.SESSIONS, defaultSessions);
    StudyFlowStorage.set(STORAGE_KEYS.THEME, 'dark');
    StudyFlowStorage.set(STORAGE_KEYS.PREFERENCES, defaultPreferences);
    StudyFlowStorage.set(STORAGE_KEYS.INITIALIZED, true);
  }
}

function getAssignments() {
  return StudyFlowStorage.get(STORAGE_KEYS.ASSIGNMENTS, defaultAssignments);
}

function saveAssignments(assignments) {
  return StudyFlowStorage.set(STORAGE_KEYS.ASSIGNMENTS, assignments);
}

function getNotes() {
  return StudyFlowStorage.get(STORAGE_KEYS.NOTES, defaultNotes);
}

function saveNotes(notes) {
  return StudyFlowStorage.set(STORAGE_KEYS.NOTES, notes);
}

function getSessions() {
  return StudyFlowStorage.get(STORAGE_KEYS.SESSIONS, defaultSessions);
}

function saveSessions(sessions) {
  return StudyFlowStorage.set(STORAGE_KEYS.SESSIONS, sessions);
}

function getPreferences() {
  return StudyFlowStorage.get(STORAGE_KEYS.PREFERENCES, defaultPreferences);
}

function savePreferences(prefs) {
  return StudyFlowStorage.set(STORAGE_KEYS.PREFERENCES, prefs);
}

function getTheme() {
  return StudyFlowStorage.get(STORAGE_KEYS.THEME, 'dark');
}

function saveTheme(theme) {
  return StudyFlowStorage.set(STORAGE_KEYS.THEME, theme);
}

function getCourses() {
  return defaultCourses;
}

function getDashboardStats() {
  const assignments = getAssignments();
  const sessions = getSessions();
  const courses = getCourses();

  const completed = assignments.filter(a => a.completed).length;
  const pending = assignments.filter(a => !a.completed).length;
  const totalStudyHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  const avgProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length);

  return {
    tasksCompleted: completed,
    pendingAssignments: pending,
    studyHours: totalStudyHours.toFixed(1),
    overallProgress: avgProgress
  };
}

function getWeeklyStudyData() {
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [2.5, 3.5, 2, 4, 3, 5, 1.5]
  };
}

function getActivityFeed() {
  return [
    { type: 'complete', text: 'Completed <strong>Agile Sprint Retrospective</strong>', time: '2 hours ago', icon: 'check-circle', color: 'green' },
    { type: 'note', text: 'Added note <strong>CSS Grid vs Flexbox</strong>', time: '5 hours ago', icon: 'file-text', color: 'purple' },
    { type: 'session', text: 'Planned study session for <strong>Machine Learning</strong>', time: 'Yesterday', icon: 'calendar', color: 'cyan' },
    { type: 'progress', text: 'Reached 72% in <strong>Web Development</strong>', time: '2 days ago', icon: 'trending-up', color: 'orange' },
    { type: 'assignment', text: 'Started <strong>Neural Network Implementation</strong>', time: '3 days ago', icon: 'book-open', color: 'blue' }
  ];
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr) {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDayName(dateStr) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(dateStr + 'T00:00:00').getDay()];
}

function isToday(dateStr) {
  const today = new Date();
  const date = new Date(dateStr + 'T00:00:00');
  return today.toDateString() === date.toDateString();
}

function getDaysOfWeek() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  const days = [];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      name: dayNames[i],
      date: d.toISOString().split('T')[0],
      isToday: isToday(d.toISOString().split('T')[0])
    });
  }
  return days;
}

initializeStorage();
