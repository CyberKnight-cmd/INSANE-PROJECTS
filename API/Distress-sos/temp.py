from torch.utils.data import DataLoader
import dataset

from torch.utils.data import random_split, DataLoader

# Load dataset
dataset = dataset.KeywordDataset(
    root_dir=r"D:\ProgrammingLanguages\INSANE-PROJECTS\AI-GUARDIAN\Distress-sos\dataset", 
    n_mels=64
)

# Split sizes
val_ratio = 0.2  # 20% validation
val_size = int(len(dataset) * val_ratio)
train_size = len(dataset) - val_size

# Split datasets
train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

# Dataloaders
train_loader = DataLoader(train_dataset, batch_size=4, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=4, shuffle=False)

print(f"[INFO] Training samples: {len(train_dataset)}, Validation samples: {len(val_dataset)}")

