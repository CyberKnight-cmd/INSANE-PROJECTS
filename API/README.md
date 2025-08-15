# 🛡️ AI Guardian — Women’s Safety Edition (GenAI Enhanced)

> A GenAI-powered personal safety companion for women — predictive risk alerts, discreet SOS, and AI-driven situational awareness.

---

## 📌 Overview
**AI Guardian** is a mobile app that leverages **location data, computer vision, voice sentiment analysis, and generative AI** to **predict risk, prevent incidents, and rapidly notify trusted contacts or authorities** when a user is unsafe.

Designed for **48-hour hackathon MVP**, the app focuses on **speed, discretion, and actionable intelligence** during emergencies — while maintaining **privacy and user control**.

---

## 🎯 Key Features (MVP Scope)
- **Real-time Risk Prediction** — Route risk score + safer alternatives with GenAI explanations.
- **SafeTimer & Auto Check-ins** — Missed check-in → auto SOS escalation.
- **Discreet SOS Triggers** — Voice code phrase, shake, button, lock-screen widget.
- **GenAI “Safety Cam”** — Short video/audio clip analysis → concise natural-language summary to responders.
- **SmartVoice Shield** — On-device sentiment detection to preemptively prepare SOS.
- **SafeRide Mode** — Verify driver & route deviation alerts.
- **GenAI CrimeSummarizer** — Convert raw incident feeds into plain-language safety briefs.
- **Training Mode** — Threat simulations to teach preparedness and discreet alerts.

---

## 🛠 Tech Stack (MVP)
| Layer            | Technology |
|------------------|------------|
| Frontend (App)   | React Native / Thunkable |
| Maps & Routing   | Google Maps API |
| Messaging / Calls| Twilio SMS & Voice API |
| Auth & Database  | Firebase Auth + Firestore |
| GenAI Services   | OpenAI API (LLM for summarization & chat) |
| CV & Voice       | TensorFlow Lite (on-device), mocked for MVP |
| Hosting          | Firebase Functions / Vercel |

---

## ⚙️ Architecture (Simplified)
1. **User Device** — UI, GPS, camera, on-device ML for voice sentiment.
2. **Backend API** — User auth, incident data storage, SOS dispatch orchestration.
3. **GenAI Layer** — Summarization of incident reports, SOS context building, safety tips.
4. **Third-party APIs** — Google Maps, Twilio, optional crime-data sources.
5. **Storage** — Encrypted Firestore for minimal incident data retention (default 30 days).

---

## 🔒 Privacy & Safety
- **Opt-in** for continuous monitoring.
- **On-device** processing for sensitive voice/vision tasks where possible.
- **End-to-end encryption** for SOS messages & media.
- **Minimal data retention** — auto-delete unless flagged for reporting.
- **Clear legal compliance** with recording & reporting laws.

---

## 🚀 Quick Start (Dev Setup)
```bash
# 1️⃣ Clone the repo
git clone https://github.com/cyberknight-cmd/INSANE-PROJECTS/tree/ai-guaridan.git
cd ai-guardian

# 2️⃣ Install dependencies
npm install

# 3️⃣ Create .env and add:
# GOOGLE_MAPS_API_KEY=
# TWILIO_SID=
# TWILIO_AUTH_TOKEN=
# OPENAI_API_KEY=
# FIREBASE_CONFIG=

# 4️⃣ Start the dev server
npm start
```

---

## 🧪 Hackathon MVP Demo Flow

1. **Set Trip** → See route risk score & GenAI safety tips.
2. **Trigger SOS** (e.g., whisper code phrase) → GPS, short clip, and GenAI summary sent to trusted contacts.
3. **SafeRide Mode** → Scan driver ID → detect route deviation.
4. **View Incident Feed** → Read AI-generated summaries of nearby incidents.

---

## 📊 Success Metrics

* **SOS trigger → contact alert** in **<15s**.
* **GenAI summaries** rated useful by users.
* **False-positive rate** for voice sentiment <5%.

---

## 📅 Hackathon Build Plan

* **Day 1:** Core flows — Login, Map View, SafeTimer, basic SOS via Twilio.
* **Day 2:** GenAI summaries, mocked Safety Cam & voice trigger, UI polish.

---

## 📜 License

MIT — Free to use, modify, and distribute with attribution.

---

## 🙌 Acknowledgements

* OpenAI for LLM APIs
* Google Maps API
* Twilio SMS/Voice
* TensorFlow Lite