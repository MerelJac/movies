# Prereqs

- Ensure correct versions. I am using macOS
  - `brew install composer`
    - Composer version 2.10.1
    - PHP version 8.4.5
  - **Node.js 20 or newer** (Tailwind v4's build engine requires it; on Node 18
    `npm run dev` fails with a `@tailwindcss/oxide` "Cannot find native binding"
    error). The frontend pins this in `frontend/.nvmrc`, so with nvm:
    - `cd frontend && nvm use` (uses Node 22 per `.nvmrc`)
  - `cd frontend && npm install`

- Add env files to backend
  - `cd backend && cat .env` (from what was shared separately)

### Open questions


- light and dark mode

- ai insights
- watched vs time watched
- create playlists
- mobile
- popular this week / trending
- done: Rate limiting?
- done: Caching?
- done:filtering
- done:click into movie -> modal?
- done:sorting
- done: list vs grid view

# To Run

```bash
cd backend && php artisan serve
cd frontend && npm run dev
```

then open: http://localhost:5173/

# Assignment Instructions

**The Movie DB Prototype**

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


## AI Models
Claude 
- Example prompt:
MovieStats.jsx
update this so that if you click a genre, it filters 'owned movies' to display only owned movies of that genre 

movie-stats__genres

- make a movieCaousel that accepts movieCardSimple and has the option to horizonal scroll but by defaut does not. use current naming conventions and styling.

- i want to cache this api request but waht are my optiosn since I don't have persistance in the DB?