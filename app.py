from flask import Flask, request, jsonify
from collections import defaultdict
import random
import json
import uuid
import time

app = Flask(__name__)

# Track IP usage
ip_usage = defaultdict(list)
IP_BAN_THRESHOLD = 10       # max requests per hour
BAN_DURATION = 60 * 60      # 1 hour in seconds
banned_ips = {}

def is_ip_banned(ip):
    if ip in banned_ips:
        if time.time() - banned_ips[ip] < BAN_DURATION:
            return True
        else:
            del banned_ips[ip]
    return False

@app.before_request
def ghost_protocol():
    ip = request.remote_addr

    if is_ip_banned(ip):
        return jsonify({"error": "Access denied (Ghost Protocol Active)"}), 403

    now = time.time()
    ip_usage[ip] = [t for t in ip_usage[ip] if now - t < 3600]
    ip_usage[ip].append(now)

    if len(ip_usage[ip]) > IP_BAN_THRESHOLD:
        banned_ips[ip] = now
        print(f"🛑 IP {ip} auto-banned by Ghost Protocol.")

# Load simulated real IPs
with open('fake_ip_pool.json') as f:
    ip_pool = json.load(f)

# Active sessions
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
