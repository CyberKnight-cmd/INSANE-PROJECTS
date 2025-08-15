import os
import torch
import torchaudio
from torch.utils.data import Dataset, DataLoader, random_split
from torchaudio.transforms import MelSpectrogram, AmplitudeToDB
import torch.nn as nn
import torch.optim as optim

# ===== Dataset =====
class KeywordDataset(Dataset):
    def __init__(self, root_dir, n_mels=64, fixed_length=2):
        self.samples = []
        self.labels = []
        
        # Only take subfolders (class names)
        self.label_map = {
            name: idx for idx, name in enumerate(
                sorted(d for d in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, d)))
            )
        }

        for label_name in self.label_map:
            folder = os.path.join(root_dir, label_name)
            for file in os.listdir(folder):
                if file.lower().endswith(".wav"):
                    self.samples.append(os.path.join(folder, file))
                    self.labels.append(self.label_map[label_name])

        self.mel_transform = MelSpectrogram(sample_rate=16000, n_mels=n_mels, n_fft=1024, hop_length=512)
        self.db_transform = AmplitudeToDB()
        self.fixed_length = fixed_length


    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        file_path = self.samples[idx]
        label = self.labels[idx]

        waveform, sr = torchaudio.load(file_path)
        if sr != 16000:
            waveform = torchaudio.functional.resample(waveform, sr, 16000)

        target_len = int(self.fixed_length * 16000)
        if waveform.size(1) < target_len:
            pad_len = target_len - waveform.size(1)
            waveform = torch.nn.functional.pad(waveform, (0, pad_len))
        else:
            waveform = waveform[:, :target_len]

        mel_spec = self.mel_transform(waveform)
        mel_spec_db = self.db_transform(mel_spec)
        mel_spec_db = (mel_spec_db - mel_spec_db.mean()) / (mel_spec_db.std() + 1e-6)

        return mel_spec_db, torch.tensor(label, dtype=torch.long)

# ===== Model =====
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

# ===== Training =====
def train_model(model, train_loader, val_loader, criterion, optimizer, device, epochs=30):
    model.to(device)
    for epoch in range(epochs):
        model.train()
        train_loss = 0
        correct = 0
        total = 0
        for X, y in train_loader:
            X, y = X.to(device), y.to(device)
            optimizer.zero_grad()
            outputs = model(X)
            loss = criterion(outputs, y)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()
            _, predicted = outputs.max(1)
            total += y.size(0)
            correct += predicted.eq(y).sum().item()

        val_acc = evaluate(model, val_loader, device)
        print(f"Epoch [{epoch+1}/{epochs}] Loss: {train_loss/len(train_loader):.4f} Train Acc: {100*correct/total:.2f}% Val Acc: {val_acc:.2f}%")

    torch.save(model.state_dict(), "keyword_model.pth")
    print("[INFO] Model saved as keyword_model.pth")

def evaluate(model, loader, device):
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for X, y in loader:
            X, y = X.to(device), y.to(device)
            outputs = model(X)
            _, predicted = outputs.max(1)
            total += y.size(0)
            correct += predicted.eq(y).sum().item()
    return 100 * correct / total

# ===== Main =====
if __name__ == "__main__":
    dataset_path = r"D:\ProgrammingLanguages\INSANE-PROJECTS\AI-GUARDIAN\Distress-sos\dataset"
    dataset = KeywordDataset(dataset_path)

    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = AudioCNN(num_classes=len(dataset.label_map))
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    train_model(model, train_loader, val_loader, criterion, optimizer, device, epochs=30)
