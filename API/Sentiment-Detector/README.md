# Sentiment Detector for Audio

Detects 4 classes of audio sentiment: Background noise, Normal, Stressed, and Whisper.

## Setup
1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Prepare dataset:
- Create folders for each class under `data/`
- Place audio files in respective folders

## Training
```bash
python train.py
```

## Inference
```bash
python infer.py --audio path/to/audio.wav
```

## API Integration
```python
from infer import SentimentDetector

detector = SentimentDetector()
prediction, confidence = detector.predict('audio.wav')
```

## Model Architecture
- CNN-based classifier
- Input: MFCC features
- Output: 4-class probability distribution