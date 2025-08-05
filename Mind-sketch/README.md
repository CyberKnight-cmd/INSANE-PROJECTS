## 🧠🖊️ MindSketch – Brain-Controlled Smart Whiteboard for Classrooms

### 📌 Overview

**MindSketch** is a brain-computer interface (BCI)-driven smart whiteboard system that enables teachers to **control and populate a digital whiteboard using brain signals and speech** — allowing **hands-free, intelligent teaching**.

Designed for accessibility, speed, and interactivity, it integrates **EEG triggers** with **natural language processing** to auto-generate relevant diagrams, labels, equations, and images — all in real time.

---

### 🎯 Problem Statement

Modern classrooms lack intuitive, hands-free tools that let educators **focus on teaching rather than board work**. Teachers often repeat content on boards, slowing class momentum. Meanwhile, individuals with motor limitations are unable to use whiteboards altogether.

> **MindSketch empowers educators to teach using their thoughts and speech — not their hands.**

---

### 🚀 Key Features

* 🧠 **EEG-triggered input control** (e.g., blink or focus to switch board modes)
* 🎙️ **Speech-to-Concept Mapping** – NLP interprets commands like:

  > "Draw a labeled neuron" → renders neuron diagram with labels
* 🧾 **Auto-rendered diagrams, equations, keywords**
* 🖼️ **Intelligent image retrieval** from internal or online sources
* 🖥️ **Interactive digital whiteboard** (React-based)
* 📄 **Export to PDF/PNG** for class notes

---

### 🔧 Tech Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Frontend      | React.js, Canvas API / Konva.js      |
| Backend       | Python (Flask or FastAPI)            |
| NLP           | OpenAI / spaCy / GPT APIs            |
| Voice Input   | Whisper API / Vosk (offline STT)     |
| EEG Input     | Muse / OpenBCI / Simulated EEG       |
| Visualization | MathJax, LaTeX, D3.js (for diagrams) |

---

### 🧱 System Architecture

```
EEG Device ──► EEG Signal Interpreter
                   │
            [Trigger Input Mode]
                   ▼
       Microphone → Speech → Whisper
                   ▼
           NLP → Intent Extraction
                   ▼
         Diagram/Image/Text Fetcher
                   ▼
           Smart Whiteboard Renderer
```

---

### ⚙️ MVP Scope

* Simulated EEG triggers (e.g., keystroke-based)
* Whisper-based speech input
* NLP parsing for diagram/image lookup
* Real-time rendering on web whiteboard
* Export board to file

---

### 🛡️ Stretch Goals

* Live EEG input using Muse/OpenBCI
* Eye gaze cursor control
* Student-side mirrored whiteboard
* Multilingual command support

---

### 👨‍🏫 Use Case Example

1. EEG signal triggers "listening mode"
2. Teacher says: *“Draw Ohm’s Law and show a resistor circuit”*
3. Board displays:

   * Equation: $V = IR$
   * Resistor circuit diagram
   * Keywords: Voltage, Current, Resistance

---

### 🤝 Team

* Arya (Team Lead, NLP + System Design)
  *Add other members as needed*

---

### 📂 Project Setup (WIP)

```bash
# Clone repo
git clone https://github.com/your-team/MindSketch.git
cd MindSketch

# Backend setup
cd backend
python3 -m venv venv
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
npm start
```

