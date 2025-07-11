let sessionDuration = 2 * 60 * 60; // 2 hours in seconds
let rotationInterval = 15 * 60; // 15 minutes in seconds
let sessionTimer, rotationTimer;
let connected = false;

// Replace this with your real API URL when ready
const BASE_URL = "https://kaicore-vpn-api.onrender.com";

document.getElementById("connect-btn").onclick = async () => {
  const res = await fetch(`${BASE_URL}/api/start-session`);
  const data = await res.json();

  document.getElementById("ghost-id").innerText = data.ghost_id;
  document.getElementById("ip-address").innerText = data.ip;
  document.getElementById("location").innerText = data.location;
  document.getElementById("connect-btn").disabled = true;
  document.getElementById("rotate-btn").disabled = false;
  document.getElementById("disconnect-btn").disabled = false;
  connected = true;

  startTimers();
};

document.getElementById("rotate-btn").onclick = async () => {
  const res = await fetch(`${BASE_URL}/api/rotate-ip`);
  const data = await res.json();
  document.getElementById("ip-address").innerText = data.ip;
  document.getElementById("location").innerText = data.location;
  rotationTimer = rotationInterval;
};

document.getElementById("disconnect-btn").onclick = () => {
  connected = false;
  clearInterval(sessionTimer);
  window.location.reload();
};

function startTimers() {
  let total = sessionDuration;
  let rotate = rotationInterval;

  sessionTimer = setInterval(() => {
    if (!connected) return;
    total--;
    rotate--;

    const mins = Math.floor(total / 60);
    const secs = total % 60;
    document.getElementById("session-timer").innerText = `${mins}:${secs.toString().padStart(2, '0')}`;

    const rmin = Math.floor(rotate / 60);
    const rsec = rotate % 60;
    document.getElementById("rotation-timer").innerText = `${rmin}:${rsec.toString().padStart(2, '0')}`;

    if (rotate <= 0) {
      document.getElementById("rotate-btn").click();
      rotate = rotationInterval;
    }

    if (total <= 0) {
      document.getElementById("disconnect-btn").click();
    }
  }, 1000);
}
