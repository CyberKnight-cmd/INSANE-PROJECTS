import librosa
import numpy as np
import tensorflow as tf
from pydub import AudioSegment
import soundfile as sf

# Constants
CLASSES = ['Background', 'Normal', 'Stressed', 'Whisper']
SAMPLE_RATE = 22050
DURATION = 4  # seconds

class SentimentDetector:
    def __init__(self, model_path='sentiment_detector.h5'):
        """Initialize with trained model"""
        self.model = tf.keras.models.load_model(model_path)
    
    def preprocess_audio(self, audio_path):
        """Load and preprocess audio file"""
        # Load audio
        audio, sr = librosa.load(audio_path, sr=SAMPLE_RATE, duration=DURATION)
        
        # Extract MFCC features
        mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
        mfccs = np.expand_dims(mfccs, axis=-1)  # Add channel dimension
        mfccs = np.expand_dims(mfccs, axis=0)   # Add batch dimension
        
        return mfccs
    
    def predict(self, audio_path):
        """Predict sentiment from audio file"""
        features = self.preprocess_audio(audio_path)
        predictions = self.model.predict(features)
        predicted_class = CLASSES[np.argmax(predictions)]
        confidence = np.max(predictions)
        
        return predicted_class, confidence

if __name__ == '__main__':
    detector = SentimentDetector()
    # Example usage:
    # class_pred, confidence = detector.predict('test_audio.wav')
    # print(f"Predicted class: {class_pred} with confidence {confidence:.2f}")