# AI Guardian — Women's Safety Edition

A GenAI-powered personal safety companion for women — predictive risk alerts, discreet SOS, and AI-driven situational awareness.

## Overview

AI Guardian is a mobile app that uses location, computer-vision, voice-sentiment, and GenAI summarization to predict risk, prevent incidents, and rapidly notify trusted contacts and authorities when a user is unsafe.

## Primary Goals

- Prevent incidents by proactively warning users about risky routes/areas
- Provide fast, discreet help when danger occurs (multimodal SOS)
- Give concise, actionable intelligence to responders via GenAI summaries
- Empower users through training and realistic preparedness simulations

## Target Users

- Women commuting late nights / late-shift workers / students walking alone
- Guardians/parents, security volunteers, campus police
- Organizations (colleges, night-shift employers) for safer rosters

## Core Features

### Real-time Risk Prediction & Routing
- Continuous location tracking (opt-in)
- Risk score for current location & planned route (heatmap overlay)
- GenAI assistant that explains why a route is risky and suggests safer alternatives

### Automatic Check-ins & SafeTimer
- Set a trip with expected ETA and auto-check intervals
- Missed check-in escalates to SOS workflow

### Discreet SOS (Voice, Gesture, Shake, Shortcut)
- Trigger methods: code phrase, loud keyword, button, shake, long-press on lock-screen widget
- On trigger: share live GPS, audio, short video, and last-known route to contacts & authorities

### GenAI "Safety Cam" (Video + CV)
- When SOS starts, record short clips and run light CV inference to detect threatening body language or number of people
- GenAI produces a short natural-language summary for recipients: location + situation + immediate recommended action

### SmartVoice Shield (Voice Sentiment)
- Background low-power voice sentiment/urgency classifier (on-device if possible)
- If threshold crossed (stress / panic), prep SOS and alert user before sending

### SafeRide Mode
- Verify driver & vehicle details (OCR on license/plate)
- Monitor route deviation and send alerts on unusual detours

### Nearby Helpers Network & Crowd Assist
- Show verified volunteers/security guards within radius who can respond
- Option to ping nearest helpers with ETA and location

### Incident Reporting & GenAI CrimeSummarizer
- One-tap incident report that drafts a concise, shareable report using GenAI (for police/helplines)
- Summarize local incident trends (pull from public feeds / uploaded reports) in plain language

### Safe Companion Mode & Behavioral Tricks
- Conversational GenAI companion to "keep you company" when walking
- Option: play a simulated call / loud voice line if you want to deter a threat

### Training Mode (Threat Simulator)
- Simulated scenarios (audio + text) to teach de-escalation, discreet SOS triggers, and escape planning

## Technical Architecture

### Frontend (Mobile)
- React Native for cross-platform mobile development
- Handles UI, permissions, minor on-device ML (voice sentiment), camera capture, and secure local encryption

### Backend (Serverless)
- REST API (Node/Python) for user management, push notifications, GenAI orchestration, storing encrypted incident data

### GenAI Services
- Large language model for summarization, Q&A and generating alerts
- Lightweight vision model for object/person detection on saved clips (prefer on-device or edge inference for privacy)

### Third-party APIs
- Google Maps (routing, geocoding)
- Twilio (SMS/calls)
- SMS/voice provider for emergency calls
- Optional crime-data sources

## Privacy & Safety Considerations

- Explicit opt-in for all continuous monitoring features
- On-device processing preference for voice and vision to reduce raw data sent to servers
- End-to-end encryption for SOS messages & media to trusted contacts
- Short retention window (e.g., auto-delete recordings after 30 days) unless user chooses to keep/report
- Anonymized analytics only; no selling of safety/crime data
- Legal compliance: Follow local laws for recording/automated reporting; show clear consent screens

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI
- React Native development environment

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-guardian-app.git

# Navigate to the project directory
cd ai-guardian-app

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on a Device

- Install the Expo Go app on your iOS or Android device
- Scan the QR code from the Expo development server
- Or run on an emulator/simulator using `npm run android` or `npm run ios`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
