import torch
import torchaudio
import torch.nn as nn
import torch.nn.functional as F

# ==== Model definition (MUST match AudioCNN from training) ====
class AudioCNN(nn.Module):
    def __init__(self, num_classes):
        super(AudioCNN, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1))
        )
        self.fc = nn.Linear(64, num_classes)

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)

# ==== Audio preprocessing ====
def preprocess_audio(filepath, target_sample_rate=16000, target_duration=2.0):
    waveform, sr = torchaudio.load(filepath)

    # Resample
    if sr != target_sample_rate:
        waveform = torchaudio.functional.resample(waveform, sr, target_sample_rate)

    # Mono
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)

    # Pad/trim to fixed length
    num_samples = int(target_sample_rate * target_duration)
    if waveform.shape[1] > num_samples:
        waveform = waveform[:, :num_samples]
    elif waveform.shape[1] < num_samples:
        pad_size = num_samples - waveform.shape[1]
        waveform = F.pad(waveform, (0, pad_size))

    # Mel spectrogram + normalization
    mel_spec = torchaudio.transforms.MelSpectrogram(
        sample_rate=target_sample_rate,
        n_mels=64,
        n_fft=1024,
        hop_length=512
    )(waveform)
    mel_spec_db = torchaudio.transforms.AmplitudeToDB()(mel_spec)
    mel_spec_db = (mel_spec_db - mel_spec_db.mean()) / (mel_spec_db.std() + 1e-6)

    return mel_spec_db.unsqueeze(0)  # [1, 1, 64, time]

# ==== Load model ====
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Must match the number of classes from training
classes = ["False_wav", "True_wav"]  # Keep the same label order as training
model = AudioCNN(num_classes=len(classes)).to(device)

model.load_state_dict(torch.load("keyword_model.pth", map_location=device, weights_only=True))
model.eval()

# ==== Prediction ====
def predict(filepath, threshold=0.7):
    mel_spec = preprocess_audio(filepath).to(device)
    with torch.no_grad():
        outputs = model(mel_spec)
        probs = torch.softmax(outputs, dim=1)
        
        # Get confidence for True_wav class
        true_wav_idx = classes.index("True_wav")
        confidence = probs[0][true_wav_idx].item()
        
        # Apply threshold
        prediction = "True_wav" if confidence >= threshold else "False_wav"
        
    print(f"Prediction: {prediction} (confidence: {confidence*100:.2f}%)")
    return prediction, confidence

# ==== Example ====
if __name__ == "__main__":
    test_file = "untitled.wav"  # Replace with path to your file
    predict(test_file)
