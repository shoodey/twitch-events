# Disclaimer

This is not production ready and stores a few hardcoded values, and some really not optimised in-memory data.

**Please only use it as a base for your own project.**

# Motivations

This is a POC done for fun in a few hours to help a streamer I enjoy setup a dynamic reward system based on stream category.

# How to use

1. Clone the repo
2. Install dependencies with `npm install` or ideally `pnpm install` (faster)
3. Copy `.env.example` to `.env` and fill the values
4. Run the server with `npm run dev` or `pnpm run dev`
5. Ideally use postman to test the endpoints. _I will try to add a postman collection in the future to help with that_

# Todo

- [ ] Validate environment variables
- [ ] Set the intial category (on stream start or on bot start through a list of channels/subscriptions)
