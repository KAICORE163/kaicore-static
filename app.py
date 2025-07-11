from flask import Flask, jsonify
import random
import json
import uuid

app = Flask(__name__)

# Load simulated real IPs (replace with real source later if needed)
with open('fake_ip_pool.json') as f:
    ip_pool = json.load(f)

# Active sessions stored temporarily
current_session = {
    "ip": None,
    "location": None,
    "ghost_id": None
}

@app.route('/')
def home():
    return "✅ KAICORE VPN Backend is Live"

@app.route('/api/start-session')
def start_session():
    selected = random.choice(ip_pool)
    current_session['ip'] = selected['ip']
    current_session['location'] = selected['location']
    current_session['ghost_id'] = f"Ghost-{str(uuid.uuid4())[:4]}"
    return jsonify(current_session)

@app.route('/api/rotate-ip')
def rotate_ip():
    selected = random.choice(ip_pool)
    current_session['ip'] = selected['ip']
    current_session['location'] = selected['location']
    return jsonify({
        "ip": current_session['ip'],
        "location": current_session['location']
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
