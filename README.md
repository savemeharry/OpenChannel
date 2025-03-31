# OpenChannel - Telegram Subscription Management System

A system built on Telegram for managing access to closed groups through subscriptions, using Telegram Stars for payments.

## Project Structure

- `bot/` - Python backend for the Telegram bot and API
  - `src/` - Source code for the bot
  - `database/` - Database models and migrations

- `webapp/` - React frontend for the Telegram Mini App
  - `src/` - Source code for the Mini App
  - `public/` - Static assets

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 13+
- Telegram Bot Token

### Bot Setup
1. Navigate to the bot directory:
   ```
   cd bot
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Copy the `.env.example` file to `.env` and fill in your configuration:
   ```
   cp .env.example .env
   ```

6. Run the bot:
   ```
   python src/main.py
   ```

### WebApp Setup
1. Navigate to the webapp directory:
   ```
   cd webapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Features
- Manage access to closed Telegram groups
- Process payments via Telegram Stars
- Check and manage subscriptions
- Modern, minimalist UI/UX design 