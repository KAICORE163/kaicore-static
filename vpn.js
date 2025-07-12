let sessionDuration = 2 * 60 * 60; // 2 hours in seconds
let rotationInterval = 15 * 60; // 15 mins in seconds
let sessionTimer, rotationTimer;
let connected = false;

document.getElementById("connect-btn").onclick = async () => {
  const res = await fetch("/api/start-session");
  const data = await res.json();

  document.getElementById("ghost-id").innerText = data.ghost_id;
  document.getElementById("ip-address").innerText = data.ip;
  document.getElementById("location").innerText = data.location;

  document.getElementById("connect-btn").disabled = true;
  document.getElementById("rotate-btn").disabled = false;
  document.getElementById("disconnect-btn").disabled = false;
  connected = true;

  // 🔍 GA4 Event: Connect
  gtag('event', 'vpn_connect', { method: 'KAICORE VPN' });

  startTimers();
};

document.getElementById("rotate-btn").onclick = async () => {
  const res = await fetch("/api/rotate-ip");
  const data = await res.json();

  document.getElementById("ip-address").innerText = data.ip;
  document.getElementById("location").innerText = data.location;

  // 🔍 GA4 Event: Rotate
  gtag('event', 'vpn_rotate_ip', { step: 'rotation' });

  rotationTimer = rotationInterval;
};

document.getElementById("disconnect-btn").onclick = () => {
  connected = false;
  clearInterval(sessionTimer);
  clearInterval(rotationTimer);
  window.location.reload();

  // 🔍 GA4 Event: Disconnect
  gtag('event', 'vpn_disconnect', { reason: 'manual_or_expired' });
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
    document.getElementById("session-timer").innerText =
      `${mins}:${secs.toString().padStart(2, '0')}`;

    const rmin = Math.floor(rotate / 60);
    const rsec = rotate % 60;
    document.getElementById("rotation-timer").innerText =
      `${rmin}:${rsec.toString().padStart(2, '0')}`;

    if (rotate <= 0) {
      document.getElementById("rotate-btn").click();
      rotate = rotationInterval;
    }

    if (total <= 0) {
      document.getElementById("disconnect-btn").click();
    }
  }, 1000);
}function switchSkin() {
  const theme = document.getElementById("skin-select").value;
  const root = document.documentElement;
  const body = document.body;

  if (theme === "dark") {
    body.style.backgroundColor = "#0d1117";
    body.style.color = "#c9d1d9";
  } else if (theme === "neon") {
    body.style.backgroundColor = "#000";
    body.style.color = "#39ff14";
  } else if (theme === "hacker") {
    body.style.backgroundColor = "#001f00";
    body.style.color = "#00ff88";
  }
}

