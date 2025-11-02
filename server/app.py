from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/score', methods=['POST'])
def save_score():
    data = request.json
    return jsonify({"status": "ok", "score": data})

if __name__ == '__main__':
    app.run(debug=True)
