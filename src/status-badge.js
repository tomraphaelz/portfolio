/**
 * Discarded WebGL status orb in favor of Airbnb minimalism.
 * This script provides a premium Apple-style Spring Physics magnetic pull for the badge container.
 */

(function () {
  function initMagneticBadge() {
    const badge = document.getElementById('status-badge');
    if (!badge) return;

    // --- Interactive Spring Dynamics (Apple Style) ---
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let velX = 0;
    let velY = 0;

    const springStiffness = 180.0;
    const springDamping = 18.0;

    badge.addEventListener('mousemove', (e) => {
      const rect = badge.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Elastic magnetic snap towards mouse
      const maxDisplacement = 35;
      const rawTargetX = mouseX * 0.65;
      const rawTargetY = mouseY * 0.65;
      
      const dist = Math.sqrt(rawTargetX * rawTargetX + rawTargetY * rawTargetY);
      if (dist > maxDisplacement) {
        targetX = (rawTargetX / dist) * maxDisplacement;
        targetY = (rawTargetY / dist) * maxDisplacement;
      } else {
        targetX = rawTargetX;
        targetY = rawTargetY;
      }
    });

    badge.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    // --- Render/Animation Loop ---
    let lastTime = performance.now();
    
    function render() {
      requestAnimationFrame(render);

      // Solve Spring Physics
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const clampedDt = Math.min(dt, 0.1);

      // X Spring
      const forceX = (targetX - currentX) * springStiffness;
      const dampingX = -velX * springDamping;
      const accelX = forceX + dampingX;
      velX += accelX * clampedDt;
      currentX += velX * clampedDt;

      // Y Spring
      const forceY = (targetY - currentY) * springStiffness;
      const dampingY = -velY * springDamping;
      const accelY = forceY + dampingY;
      velY += accelY * clampedDt;
      currentY += velY * clampedDt;

      badge.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    render();
  }

  // Initialize once DOM is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initMagneticBadge();
  } else {
    document.addEventListener('DOMContentLoaded', initMagneticBadge);
  }
})();
