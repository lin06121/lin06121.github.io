/**
 * Sakura Petal Effect — 樱花飘落
 * Canvas-based, lightweight, auto-cleaned on page unload
 */
(function () {
  'use strict';

  const CONFIG = {
    maxParticles: 25,
    colors: ['#f8bbd0', '#f48fb1', '#f06292', '#e91e63', '#fce4ec'],
    minSize: 8,
    maxSize: 18,
    minSpeed: 0.4,
    maxSpeed: 1.2,
    minSwing: 0.3,
    maxSwing: 1.5,
  };

  let canvas, ctx, particles = [], animId;
  let width, height;

  class Petal {
    constructor() {
      this.reset(true);
    }
    reset(initial) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
      this.speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
      this.swing = CONFIG.minSwing + Math.random() * (CONFIG.maxSwing - CONFIG.minSwing);
      this.swingPhase = Math.random() * Math.PI * 2;
      this.opacity = 0.3 + Math.random() * 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    }
    update() {
      this.y += this.speed;
      this.x += Math.sin(this.swingPhase) * this.swing * 0.5;
      this.swingPhase += 0.02;
      this.rotation += this.rotSpeed;
      if (this.y > height + this.size) this.reset(false);
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function resize() {
    width = window.innerWidth;
    height = document.documentElement.scrollHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'sakura-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;pointer-events:none;z-index:99999;';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    particles = Array.from({ length: CONFIG.maxParticles }, function () { return new Petal(); });
    window.addEventListener('resize', resize);
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx);
    }
    animId = requestAnimationFrame(loop);
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    window.removeEventListener('resize', resize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('pjax:send', destroy);
  if (window.addEventListener) {
    window.addEventListener('beforeunload', destroy);
  }
})();
