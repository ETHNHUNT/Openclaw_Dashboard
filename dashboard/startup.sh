#!/bin/bash
set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Initializing ETHNHUNT Mission Control Dashboard..."

# Start backend
echo "Setting up backend..."
cd server
npm install
npx prisma generate
npx prisma db push
nohup npm run start > ../server.log 2>&1 &
SERVER_PID=$!
echo "Backend started (PID: $SERVER_PID)"

# Start frontend
echo "Setting up frontend..."
cd "$SCRIPT_DIR"
npm install
npm run build
# Using vite preview for production-like test
nohup npm run preview -- --port 4173 --host > client.log 2>&1 &
CLIENT_PID=$!
echo "Frontend started (PID: $CLIENT_PID)"

echo "------------------------------------------"
echo "Mission Control is LIVE!"
echo "API Server: http://localhost:3001"
echo "Dashboard UI: http://localhost:4173"
echo "------------------------------------------"
echo "To stop: kill $SERVER_PID $CLIENT_PID"
