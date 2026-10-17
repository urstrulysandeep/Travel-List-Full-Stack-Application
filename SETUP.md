# Travel With Me — setup

## Backend configuration
1. In `Backend`, copy `.env.example` to `.env`.
2. Fill in your own MongoDB connection string and a long random `JWT_SECRET`.
3. Open a terminal in `Backend` and run:
   ```bash
   npm install
   npm start
   ```
4. On the computer, visit `http://localhost:5000`. It should display `Travel Planner API Running`.

## Set your computer's IP
Open `config/api.js` and set `API_BASE_URL` to your computer's current IPv4 address, for example `http://192.168.29.57:5000`.
The phone and computer must be on the same Wi-Fi. Allow Node.js through Windows Firewall on private networks.
Do not use `localhost` in the phone app; on the phone, localhost means the phone itself.

## Frontend
From the project root:
```bash
npm install
npx expo start --tunnel
```
Open the project in Expo Go. Create an account, log in, and create a trip.

## Security notes
- The uploaded original project contained live-looking MongoDB credentials and third-party API keys. They were not copied into this repaired archive.
- If those credentials were real, rotate the MongoDB database user's password and revoke/regenerate exposed third-party API keys.
- Never commit `.env` to GitHub. Use `.env.example` only as a template.
- Weather and destination-image API calls were removed from the mobile detail screen to avoid shipping exposed API keys. They can be added safely through backend endpoints later.
