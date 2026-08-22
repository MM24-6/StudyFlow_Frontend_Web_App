# StudyFlow

**Plan smarter. Learn better. Achieve more.**

StudyFlow is a polished, responsive student productivity web application developed as the **SoftGrowTech Frontend Development Internship Final Project**. It demonstrates multi-page navigation, responsive UI design, interactive forms, dynamic data, CRUD workflows, localStorage persistence, charts, and reusable interface components.

## Features

- Premium responsive landing page
- Student dashboard with live statistics and weekly study chart
- Course progress cards with search, sort, filter, and detail modal
- Assignment manager with add/edit/delete, status, priority, sorting, and completion controls
- Weekly study planner with add/delete sessions
- Notes manager with add/edit/delete, search, categories, tags, and pinning
- Analytics dashboard with charts, course progress, and study insights
- Settings for profile, theme, weekly goal, and notification preferences
- Contact & feedback form with validation, rating, and success state
- Dark/light theme preference
- Toast notifications and accessible modals
- localStorage persistence for assignments, notes, sessions, theme, and preferences
- Mobile navigation and responsive layouts

## Pages

- `index.html` — Landing page
- `dashboard.html` — Student overview
- `courses.html` — Course management
- `assignments.html` — Assignment management
- `planner.html` — Weekly study planner
- `notes.html` — Notes workspace
- `analytics.html` — Progress analytics
- `settings.html` — Profile and preferences
- `contact.html` — Contact and feedback

## Technologies

- HTML5
- CSS3 with CSS variables and responsive media queries
- Vanilla JavaScript
- localStorage Web API
- Chart.js for analytics visualizations
- Lucide Icons via CDN

## Project Structure

```text
StudyFlow/
├── index.html
├── dashboard.html
├── courses.html
├── assignments.html
├── planner.html
├── notes.html
├── analytics.html
├── settings.html
├── contact.html
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── dashboard.js
│   ├── courses.js
│   ├── assignments.js
│   ├── planner.js
│   ├── notes.js
│   ├── analytics.js
│   ├── settings.js
│   └── contact.js
├── assets/
│   ├── icons/
│   └── images/
└── README.md
```

## How to Run

1. Download or clone the repository.
2. Open the `StudyFlow` folder.
3. Open `index.html` in a modern browser.
4. Use the navigation to explore the full application.

For the most reliable local development experience, you can also serve the folder with a simple local HTTP server. No build step or package installation is required.

## Deployment

The project is static HTML/CSS/JavaScript, so it can be deployed using GitHub Pages. Upload the complete project to a GitHub repository and enable Pages from the repository's settings.

## Data & Privacy

StudyFlow is a frontend demonstration. User-created assignments, notes, sessions, theme settings, and preferences are stored locally in the browser using localStorage. The contact form demonstrates validation and a success state but does not send data to a real backend.

## Author

**Madiha Manzoor**

## Internship

**SoftGrowTech — Frontend Development Internship Final Project**

## Submission

The repository is intended to demonstrate the internship requirements: a complete multi-page responsive web application with navigation, forms, interactive features, and dynamic UI elements.
