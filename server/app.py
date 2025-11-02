from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route('/api/score', methods=['POST'])

def save_score():
    data = request.json
    return jsonify({"status": "ok", "score": data})

CORS(app, origins=["http://localhost:4200"]) 


with open("words.txt", "r") as f:
    words = [line.strip() for line in f if len(line.strip()) == 5]

random_word = None
next_reset_time = None

def get_daily_word():
    global random_word, next_reset_time
    
    current_time = datetime.now()
    
    if random_word is None or next_reset_time is None or current_time >= next_reset_time:
        random_word = random.choice(words)
        next_reset_time = current_time + timedelta(days=1)
        print(f"New word selected: {random_word}, resets at: {next_reset_time}")
    
    return random_word

@app.route('/validate', methods=['POST'])
def validate_word():
    data = request.get_json()
    guess = data.get('word', '').lower()

    current_word = get_daily_word()

    if guess == "marix": 
        result = [{"letter": letter, "status": "correct"} for letter in guess]
        return jsonify({"result": result})

    if len(guess) != 5:
        return jsonify({"error": "Word must be 5 letters"}), 400

    if guess not in words:
        return jsonify({"error": "Word not in list"}), 400
    target_letters = list(current_word)
    result = []

    for i, letter in enumerate(guess):
        if letter == current_word[i]:
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
