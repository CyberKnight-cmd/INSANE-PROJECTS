import os
import torch
import torchaudio
from torch.utils.data import Dataset
from torchaudio.transforms import MelSpectrogram, AmplitudeToDB

class KeywordDataset(Dataset):
    def __init__(self, root_dir, n_mels=64, sample_rate=16000):
        self.samples = []
        self.labels = []
        self.sample_rate = sample_rate

        # Detect all class folders dynamically
        class_names = sorted([d for d in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, d))])
        self.label_map = {name: idx for idx, name in enumerate(class_names)}
        print(f"[INFO] Classes found: {self.label_map}")

        # Walk through dataset
        for label_name in class_names:
            folder = os.path.join(root_dir, label_name)
            for file in os.listdir(folder):
                if file.lower().endswith(".wav"):
                    self.samples.append(os.path.join(folder, file))
                    self.labels.append(self.label_map[label_name])

        # Mel spectrogram + dB conversion
        self.mel_transform = MelSpectrogram(
            sample_rate=sample_rate,
            n_mels=n_mels,
            n_fft=1024,
            hop_length=512
        )
        self.db_transform = AmplitudeToDB()

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        file_path = self.samples[idx]
        label = self.labels[idx]

        waveform, sr = torchaudio.load(file_path)
        if sr != 16000:
            waveform = torchaudio.functional.resample(waveform, sr, 16000)

        # Truncate or pad waveform to exactly 2 seconds (32000 samples)
        target_num_samples = 32000
        num_samples = waveform.shape[1]
        if num_samples < target_num_samples:
            pad_amount = target_num_samples - num_samples
            waveform = torch.nn.functional.pad(waveform, (0, pad_amount))
        else:
            waveform = waveform[:, :target_num_samples]

        mel_spec = self.mel_transform(waveform)
        mel_spec_db = self.db_transform(mel_spec)
        mel_spec_db = (mel_spec_db - mel_spec_db.mean()) / (mel_spec_db.std() + 1e-6)

        return mel_spec_db, torch.tensor(label, dtype=torch.long)

