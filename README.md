# Watchlist Maker

A full-stack web application for keeping track of movies and shows through personal watchlists, ratings, and watch statuses.

## Features

- Create an account and log in to a personal watchlist
- Add movies and shows to a watchlist
- Set titles as Watched, Watching, or Want to Watch
- Rate saved titles
- Remove items from a watchlist
- Change account passwords
- Standard accounts can save up to five items
- Subscription option allows users to add more items
- User sessions are stored with Redis
- Passwords are securely hashed with bcrypt
- End-to-end user workflow testing with Playwright

## Built With

- React
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- Handlebars.js
- Playwright
- bcrypt

## Testing

Playwright is used to test the application's main user workflow, including:

- Creating an account
- Changing subscription status
- Adding a watchlist item
- Deleting a watchlist item
- Changing the account password
- Logging in with the new password
- Logging out

## Credits

- [Popcorn Image](https://www.flaticon.com/free-icon/popcorn_705062?term=movie&related_id=705062)
- [Error Image](https://www.pinterest.com/pin/894809019698232820/)
- Speech Bubble Image - Taken from a class example
- [Itim Font](https://fonts.google.com/specimen/Itim)
- [Fredoka Font](https://fonts.google.com/specimen/Fredoka)
