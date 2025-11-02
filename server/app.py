from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from datetime import datetime, timedelta
from functools import wraps
import time
app = Flask(__name__)
import json  
import os 

@app.route('/api/score', methods=['POST'])

def save_score():
    data = request.json
    return jsonify({"status": "ok", "score": data})

last_request_time = {}
CORS(app, origins=["https://worlde-like.vercel.app"]) 
def throttle(seconds=0.5):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):

            client_ip = request.remote_addr
            current_time = time.time()
            
            if client_ip in last_request_time:
                time_since_last = current_time - last_request_time[client_ip]
                if time_since_last < seconds:
                    return jsonify({"error": "Too many requests, slow down"}), 429
            
            last_request_time[client_ip] = current_time
            return f(*args, **kwargs)
        return wrapper
    return decorator

with open("words.txt", "r") as f:
    words = [line.strip() for line in f if len(line.strip()) == 5]

WORD_STATE_FILE = 'word_state.json'

def get_daily_word():
    current_time = datetime.now()
    
    if os.path.exists(WORD_STATE_FILE):
        with open(WORD_STATE_FILE, 'r') as f:
            state = json.load(f)
            saved_word = state.get('word')
            saved_reset = datetime.fromisoformat(state.get('reset_time'))
            
            if current_time < saved_reset:
                return saved_word
    
    new_word = random.choice(words)
    next_reset = current_time + timedelta(days=1)
    
    with open(WORD_STATE_FILE, 'w') as f:
        json.dump({
            'word': new_word,
            'reset_time': next_reset.isoformat()
        }, f)
    
    print(f"New word selected: {new_word}, resets at: {next_reset}")
    return new_word

@app.route('/validate', methods=['POST'])
@throttle(0.5)
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
