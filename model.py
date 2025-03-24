import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import sys
import json

# ✅ Load Fine-Tuned Model and Tokenizer
model_name = "NikolaML/NewsAnalizer"  # Replace with the directory where your fine-tuned model is saved
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()  # Set to evaluation mode

# ✅ Define Class Weights (same as the ones you used for training)
class_weights = torch.tensor([38.0000,  1.0000, 95.0000], dtype=torch.float).to(device)


def classify_text(text):
    """
    Classifies the input text with adjusted class weights for inference.
    """
    # Tokenize input text
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512).to(device)

    # Get model output
    with torch.no_grad():
        outputs = model(**inputs)

    # Extract logits
    logits = outputs.logits

    # Convert logits to probabilities using softmax
    probs = F.softmax(logits, dim=1)

    # Apply class weights: Adjust the logits based on class weights
    weighted_probs = probs * class_weights  # This emulates class weighting in inference
    weighted_probs /= weighted_probs.sum(dim=1, keepdim=True)  # Normalize to ensure they sum to 1

    # Get predicted label and confidence score
    predicted_label = torch.argmax(weighted_probs, dim=1).item()
    confidence = weighted_probs[0, predicted_label].item()

    # Map labels to human-readable
    label_map = {0: "Negative", 1: "Neutral", 2: "Positive"}

    return {"prediction": label_map[predicted_label], "confidence": round(confidence, 2)}

if __name__ == "__main__":
    # Read text from stdin (input from Node.js)
    input_text = json.loads(sys.stdin.read())["text"]
    
    # Get classification result
    result = classify_text(input_text)
    
    # Print result as JSON (Node.js will read this)
    print(json.dumps(result))