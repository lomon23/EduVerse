#!/bin/bash

# Make script executable
chmod +x start_all.sh

# Frontend React Project
echo "Starting Frontend React Project..."
cd ./frontend/myreactproject
npm install
npm run dev &
cd ../..

# Express Service
echo "Starting Express Service..."
cd ./frontend/express_service
npm install
npm start &
cd ../..

# Backend Django
echo "Starting Backend Django..."
source /Users/bosco2/Desktop/ВСІ\ ПАПКИ/DyplomTRUE/.venv/Scripts/activate
echo 'python activated'
cd ./backend/myproject/
# pip install -r requirements.txt
python3 manage.py runserver &

# Keep script running
wait