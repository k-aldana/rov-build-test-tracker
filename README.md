# ROV Build & Test Tracker

The ROV Build & Test Tracker is a simple web application for organizing components, prototypes, and tests for my senior design ROV project.
The app allows users to add, view, edit, delete, and filter project items based on category and status. Project data is stored in a Supabase database.


## Live Application
https://rov-build-test-tracker.netlify.app/


## Features

- Add new project items
- View project items
- Edit existing items
- Delete items
- Filter by category
- Filter by project status
- Display creation dates
- Store project data using Supabase


## Technologies Used

- HTML
- CSS
- JavaScript
- Supabase
- Netlify
- GitHub
- ChatGPT / AI development tools


## Database

The application uses a Supabase database with a `project_items` table.

The table stores:

- Title
- Category
- Status
- Description
- Creation date


## Project Structure

```text
rov-build-test-tracker/
├── index.html
├── styles.css
├── script.js
└── README.md
```


## Setup Instructions

1. Clone the GitHub repository.
2. Open the project folder.
3. Make sure the following files are present:
   - `index.html`
   - `styles.css`
   - `script.js`
4. Open `index.html` in a browser or run the project using a local development server such as Live Server.
5. The application connects to Supabase for database storage.
6. An internet connection is required for Supabase and the Supabase JavaScript library.


## Using the Application

1. Click **Add Project Item**.
2. Enter a title, category, status, and optional description.
3. Click **Save Item**.
4. Use **Edit** to modify an existing item.
5. Use **Delete** to remove an item.
6. Use the category and status dropdowns to filter the displayed project items.


## Demo Video
https://youtu.be/hPOTZA1AutA
