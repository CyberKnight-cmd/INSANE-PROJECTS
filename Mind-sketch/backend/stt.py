import whisper
import torch

def transcribe_and_translate(file_path):
    # Load the large model
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = whisper.load_model("large", device=device)

    # Transcribe with auto language detection and translation
    result = model.transcribe(file_path, task="translate")

    # Print detected language and translated text
    print(f"🔍 Detected Language: {result['language']}")
    print("📝 Translated Text:", result["text"])
    return result["text"]

if __name__ == "__main__":
    audio_file = "untitled.wav"
    transcribe_and_translate(audio_file)
