# Raising Children of Jannah | জান্নাতের সন্তান গড়ে তোলা

A comprehensive Islamic Parenting Platform and PWA (Progressive Web App) providing a Prophetic blueprint for character development, prayer training, and digital resilience.

## 🌟 Modules

The platform is designed as a modular hub, currently featuring:

1.  **Parenting Blueprint**: An 8-pillar guide to nurturing honest and resilient children using Prophetic psychology.
2.  **Prayer Training (Salat)**: A child-centric toolkit designed to help 7-10 year olds build a loving connection with Allah through Salat.
3.  **Fasting & Siyam**: A comprehensive 10-module guide for children and parents to experience the spiritual beauty of Ramadan, including interactive trackers and quick-action toolkits.

## ✨ Features

-   **Multi-Module Platform**: A card-based "Main Hub" for selecting different toolkits.
-   **Dual Language Support**: Full content available in English (`en/`) and Bengali (`bn/`).
-   **PWA Ready**: Offline-first experience; installable on mobile and desktop.
-   **Child-Centric UI**: Interactive Tajwid guides, "Fun Facts" for kids, and "Pro-Tips" for parents.
-   **Smart Redirection**: Remembers language preferences and defaults to Bengali for first-time visitors.
-   **Dark Mode**: Eye-friendly reading with specialized themes for each module (Emerald for Siyam, Navy for Salat).

## 📂 Project Structure

```text
├── index.html              # Language Redirector
├── manifest.webmanifest    # PWA Configuration
├── sw.js                   # Service Worker (Offline Caching)
├── sitemap.xml             # Search Engine Optimization
├── bn/                     # Bengali Module Hub
│   ├── index.html          # Hub Page (Cards)
│   ├── assets/             # Bengali-specific assets (CSS, JS, Icons)
│   ├── parenting/          # Parenting Blueprint Module
│   ├── salat/              # Salat Training Toolkit Module
│   └── siyam/              # Siyam & Ramadan Module
├── en/                     # English Module Hub
│   ├── index.html          # Hub Page (Cards)
│   ├── assets/             # English-specific assets (CSS, JS, Icons)
│   ├── parenting/          # Parenting Blueprint Module
│   ├── salat/              # Salat Training Toolkit Module
│   └── siyam/              # Siyam & Ramadan Module
└── version.json            # PWA Version Tracking
```

## 🛠️ Maintenance

### Adding a New Module (e.g., Siyam)
1.  Create `en/siyam/` and `bn/siyam/` directories.
2.  Add a new Card link to the Hub pages (`en/index.html` and `bn/index.html`).
3.  Update the `sw.js` with the new file paths for offline caching.
4.  Update the `sitemap.xml` with the new module URLs.
5.  Follow the established HTML template (Sidebar + Main Content) for consistency.

### Triggering Content Synchronization
To ensure users receive the latest content updates, follow these steps after making changes:

1.  **Run the Update Script**:
    Open your terminal in the root directory and run this exact command:
    ```powershell
    powershell -ExecutionPolicy Bypass -File ./update-version.ps1
    ```
    *Note: If you just type the filename, Windows might open it in Notepad instead of running it.*
    
    This script automatically:
    - Increments the version in `version.json`.
    - Updates the `last_updated` timestamp.
    - Increments the `CACHE_NAME` in `sw.js`.
2.  **Commit and Push**:
    Commit the changes to `version.json`, `sw.js`, and your content files, then push to GitHub.
3.  **Automatic Detection**:
    The PWA will detect the new version (either on page load, via the 1-hour poll, or when coming back online) and prompt the user with a "Refresh Now" notification.

### Technical Implementation Details
- **Stale-While-Revalidate**: Assets are served from cache immediately while being updated in the background.
- **version.json**: Acts as the remote source of truth; specifically excluded from Service Worker caching.
- **Immediate Activation**: New Service Workers take control immediately upon installation using `skipWaiting` and `clients.claim`.

## 🚀 Deployment
Hosted on GitHub Pages at [https://rafayethossain.github.io/islamic-parenting](https://rafayethossain.github.io/islamic-parenting).

---
*May Allah make our children the coolness of our eyes and leaders of the righteous.*
