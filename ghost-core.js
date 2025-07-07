// ghost-core.js – KAICORE Ghost Protocol v1 (Blackhole Defense Layer)
// Inspired by physics: black hole theory + human behavioral detection

(function ghostInit() {
  const startTime = performance.now();
  let moved = false, clicked = false, copyTry = false;
  const agent = navigator.userAgent.toLowerCase();

  const suspiciousAgents = [
    /headless/, /bot/, /crawl/, /spider/, /scanner/, /python/, /phantomjs/, /curl/
  ];

  function redirectBlackhole() {
    console.warn("Ghost Protocol: Suspicious behavior. Dragging to blackhole...");
    window.location.replace("blackhole.html");
  }

  // Check User Agent
  if (suspiciousAgents.some(rx => rx.test(agent))) {
    redirectBlackhole();
  }

  // No mouse movement = likely bot
  window.addEventListener("mousemove", () => moved = true);
  window.addEventListener("click", () => clicked = true);
  window.addEventListener("copy", () => copyTry = true);

  // Timed behavior check
  setTimeout(() => {
    const tooFast = performance.now() - startTime < 100;
    if (!moved || tooFast || copyTry || !clicked) {
      redirectBlackhole();
    }
  }, 3500);

  // Remove script from DOM after load (invisible)
  const thisScript = document.currentScript;
  if (thisScript && thisScript.parentNode) {
    setTimeout(() => thisScript.parentNode.removeChild(thisScript), 2000);
  }
})();
