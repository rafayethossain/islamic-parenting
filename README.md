# Raising Children of Jannah | জান্নাতের সন্তান গড়ে তোলা

A comprehensive Islamic Parenting Platform and PWA (Progressive Web App) providing a Prophetic blueprint for character development, prayer training, and digital resilience.

## 🌟 Modules

The platform is designed as a modular hub, currently featuring:

1.  **Parenting Blueprint**: An 8-pillar guide to nurturing honest and resilient children using Prophetic psychology.
2.  **Prayer Training (Salat)**: A child-centric, 8-module toolkit designed to help 7-10 year olds build a loving connection with Allah through Salat.
3.  **Future Modules**: Expandable architecture to support upcoming toolkits like *Fasting & Siyam*.

## ✨ Features

-   **Multi-Module Platform**: A card-based "Main Hub" for selecting different toolkits.
-   **Dual Language Support**: Full content available in English (`en/`) and Bengali (`bn/`).
-   **PWA Ready**: Offline-first experience; installable on mobile and desktop.
-   **Child-Centric UI**: Interactive Tajwid guides, "Fun Facts" for kids, and "Pro-Tips" for parents.
-   **Smart Redirection**: Remembers language preferences and defaults to Bengali for first-time visitors.
-   **Dark Mode**: Eye-friendly reading with specialized themes for each module.

## 📂 Project Structure

```text
├── index.html              # Language Redirector
├── manifest.webmanifest    # PWA Configuration
├── sw.js                   # Service Worker (Offline Caching v5)
├── bn/                     # Bengali Module Hub
│   ├── index.html          # Hub Page (Cards)
│   ├── parenting/          # Parenting Blueprint Module
│   └── salat/              # Salat Training Toolkit Module
├── en/                     # English Module Hub
│   ├── index.html          # Hub Page (Cards)
│   ├── parenting/          # Parenting Blueprint Module
│   └── salat/              # Salat Training Toolkit Module
└── assets/                 # Shared Assets (CSS, JS, Icons)
```

## 🛠️ Maintenance

### Adding a New Module (e.g., Siyam)
1.  Create `en/siyam/` and `bn/siyam/` directories.
2.  Add a new Card link to the Hub pages (`en/index.html` and `bn/index.html`).
3.  Update the `sw.js` with the new file paths for offline caching.
4.  Follow the established HTML template (Sidebar + Main Content) for consistency.

### Updating the Service Worker
When making changes to CSS, JS, or adding new pages, increment the `CACHE_NAME` version in `sw.js` (e.g., `v5` to `v6`) to force an update for all users.

## 🚀 Deployment
Hosted on GitHub Pages at [https://rafayethossain.github.io/islamic-parenting](https://rafayethossain.github.io/islamic-parenting).

---
*May Allah make our children the coolness of our eyes and leaders of the righteous.*
