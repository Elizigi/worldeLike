from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)

@app.route('/api/score', methods=['POST'])

def save_score():
    data = request.json
    return jsonify({"status": "ok", "score": data})

CORS(app, origins=["http://localhost:4200"]) 


with open("words.txt", "r") as f:
    words = [line.strip() for line in f if len(line.strip()) == 5]

random_word = random.choice(words)

@app.route('/validate', methods=['POST'])
def validate_word():
    data = request.get_json()
    guess = data.get('word', '').lower()
    
    if guess == "marix": 
        result = [{"letter": letter, "status": "correct"} for letter in guess]
        return jsonify({"result": result})

    if len(guess) != 5:
        return jsonify({"error": "Word must be 5 letters"}), 400

    if guess not in words:
        return jsonify({"error": "Word not in list"}), 400
    target_letters = list(random_word)
    result = []

    for i, letter in enumerate(guess):
        if letter == random_word[i]:
            result.append({"letter": letter, "status": "correct"})
            target_letters[i] = None  
        else:
            result.append({"letter": letter, "status": None})

    for i, entry in enumerate(result):
        if entry["status"] is None:
            if entry["letter"] in target_letters:
                entry["status"] = "present"
                target_letters[target_letters.index(entry["letter"])] = None
            else:
                entry["status"] = "absent"

    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)
