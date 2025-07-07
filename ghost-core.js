// ghost-core.js – KAICORE Ghost Protocol v1 (Safe Mode)
(function ghostInit() {
  const startTime = performance.now();
  let moved = false, clicked = false, copyTry = false;
  const agent = navigator.userAgent.toLowerCase();

  const suspiciousAgents = [
    /headless/, /bot/, /crawl/, /spider/, /scanner/, /python/, /phantomjs/, /curl/
  ];

  function redirectBlackhole(reason) {
    console.warn("🛑 Ghost Protocol: Blocked –", reason);
    window.location.replace("blackhole.html");
  }

  // Step 1: Check User-Agent string
  if (suspiciousAgents.some(rx => rx.test(agent))) {
    redirectBlackhole("Suspicious user agent");
    return;
  }

  // Step 2: Track basic behavior
  window.addEventListener("mousemove", () => moved = true);
  window.addEventListener("click", () => clicked = true);
  window.addEventListener("copy", () => copyTry = true);

  // Step 3: After delay, evaluate risk
  setTimeout(() => {
    const loadTime = performance.now() - startTime;
    if (!moved && !clicked && copyTry && loadTime < 150) {
      redirectBlackhole("No interaction + copy attempt");
    } else {
      console.log("✅ Ghost Protocol passed: Human user detected.");
    }
  }, 3500);

  // Step 4: Cleanup script from DOM
  const thisScript = document.currentScript;
  if (thisScript && thisScript.parentNode) {
    setTimeout(() => thisScript.parentNode.removeChild(thisScript), 1000);
  }
})();

