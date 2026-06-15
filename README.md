# Prereqs

- Ensure correct versions. I am using macOS
  - `brew install composer`
    - Composer version 2.10.1
    - PHP version 8.4.5
  - `npm install`

- Add env files to backend
  - `cd backend && cat .env` (from what was shared separately)

### Open questions
- Rate limiting?
- Caching?

# To Run

```bash
cd backend && php artisan serve
cd frontend && npm run dev
```

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