# Prerequisites

## System requirements

- **PHP 8.4+** — install via Homebrew: `brew install php` - install via windows: `winget install --id PHP.PHP.8.4 -e` - check version with `php -v`
- **Composer 2** — install via Homebrew: `brew install composer` - install via windows: `winget install Composer.Composer`- check version with `composer --version`
- **Node.js 22** — the frontend requires Node 20+ (Tailwind v4 drops Node 18). Use nvm to match the pinned version:
```bash
  cd frontend && nvm use
```
  > **Note:** If you see `You need to run 'nvm install' to install and use the node version specified in '.nvmrc'`, run `nvm install` first (this installs the version pinned in `.nvmrc`), then run `nvm use` again.

  If you don't have nvm: https://github.com/nvm-sh/nvm
  Or install via windows: `winget install --id OpenJS.NodeJS.22 -e`
  If you have issues with `npm install`, try clearing npm cache with `npm cache clean --force`
## Setup

1. **Install frontend dependencies**
Note: start in the root directory
```bash
   cd frontend && npm install
```

2. **Add backend environment file**
Note: start in the root directory
```bash
   cd backend && cp .env.example .env
```
   Then fill in the required values (ask a teammate for credentials).

3 **Install backend dependencies**
Note: start in the root directory
```bash
   cd backend && composer install
```
   Then fill in the required values (ask a teammate for credentials).

## Running the app

```bash
# Terminal 1 — backend
cd backend && php artisan serve

# Terminal 2 — frontend
cd frontend && npm run dev
```
then open: http://localhost:5173/

## Debugging
Check backend/storage/logs/laravel.log

# Assignment Instructions

**The Movie Database**

We need to prototype an application that searches movies by name which makes use of The Movie DB's API (https://www.themoviedb.org/). You do not need to build out an entire registration/login feature

You can use any libraries, frameworks and technologies that are freely available. Use your best judgement keeping in mind that other Developers may be expanding on your code.

If you use any AI models, please list the model and describe the prompts used.

If you have any questions, feel free to contact us.

## Requirements

When you have completed and submitted your code it should meet the following requirements.

- Have proper setup guide so that another developer can follow and run the app in their local environment.
- Successfully retrieve movie information from the movie database API.
- User can mark/unmark that they own the movie that was searched for. Persisting the marking between searches is not required.
- User can view list of all marked movies.
- The search result page should display: movie title, release date, and overview. This should be for all movies found in a list, but you only need to display the first 10 results at most.
- The bottom of the page should return the total number of search results.
- Pagination is not required, but it's nice to have.

Please return your completed project within 4 days.

## Additional Features
- Mobile Friendly media queries
- Popular & Upcoming movie carousel
- Rate Limiting on API calls
- Caching on frequent API calls
- Filtering and Sorting on Search list. 
- Click a movie to open modal with more details
- List vs Grid View
- Watchlist tab
- "My Movies" Summary Tab for user insights

# AI Models

## Claude Sonnet 4.6 and Claude Code

### Prompts used

**Filter owned movies by genre**
> `MovieStats.jsx` — update this so that if you click a genre it filters the owned movies list to show only movies of that genre.
> Relevant class: `movie-stats__genres`

**Movie carousel component**
> Create a `MovieCarousel` component that wraps `MovieCardSimple`. It should support horizontal scrolling as an opt-in prop but render as a normal flow list by default. Follow existing naming conventions and styling.

**Caching API requests without a database**
> I want to cache this API request but I have no database — what are my options?

**Extend instructions for windows**
> I work on a mac and these are instructions for another developer to spin up the app. Expand these instructions to be compatible with windows.