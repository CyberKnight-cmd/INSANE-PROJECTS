# AI Guardian Setup Guide

## Overview

AI Guardian is a personal safety application that includes features like emergency alerts, crime summaries, and risk assessment. This guide will help you set up and run the application.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install frontend dependencies:
   ```
   cd AI-Guardian
   npm install
   ```

2. Install backend dependencies:
   ```
   cd src/api
   npm install
   ```

## Configuration

1. Create a `.env` file in the `src/api` directory based on the `.env.example` file if you want to use Twilio for SMS notifications.

## Running the Application

### Option 1: Run Frontend and Backend Together

Use the following command to start both the frontend and backend servers:

```
npm run start
```

This will:
- Start the backend API server on port 3002
- Start the frontend development server on the default Vite port (usually 5173)

### Option 2: Run Servers Separately

1. Start the backend API server:
   ```
   npm run start:api
   ```

2. In a separate terminal, start the frontend development server:
   ```
   npm run dev
   ```

## Accessing the Application

- Frontend: http://localhost:5173 (or the port shown in your terminal)
- Backend API: http://localhost:3002

## Features

- **Emergency Button**: Sends SOS alerts to emergency contacts
- **Crime Summarizer**: Displays recent crime reports in your area
- **Risk Assessment**: Evaluates route safety based on various factors

## Troubleshooting

If you encounter connection issues between the frontend and backend:

1. Ensure both servers are running
2. Check that the backend is running on port 3002
3. Verify that the frontend is making API requests to http://localhost:3002
4. Check browser console for any CORS-related errors