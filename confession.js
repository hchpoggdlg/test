/**
 * Cinematic Love Confession Animation
 * Heart pulses around the message with beautiful effects
 */

class ConfessionAnimation {
  constructor() {
    this.canvas = document.getElementById('heartCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.time = 0;
    this.heartPulse = 1;
    this.heartPoints = [];
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.generateHeartCurve();
    this.createFloatingParticles();
    this.createStars();
    this.setupAudio();
    this.animate();
  }

  resizeCanvas() {
    // Handle high-DPI screens (mobile) so the heart looks the same on phone & PC
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Keep CSS size in CSS pixels
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

    // Set backing store size in device pixels
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);

    // Draw using CSS-pixel coordinates
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * Setup background music
   */
  setupAudio() {
    const bgMusic = document.getElementById('bgMusic');
    const audioControl = document.getElementById('audioControl');
    
    // Set volume lower for background music
    bgMusic.volume = 0.3;

    const tryAutoPlay = () => {
      if (!bgMusic.paused) return;
      bgMusic.play().catch(() => {
        // Autoplay policy might block it, user can click button
      });
    };

    // Try to start immediately on load
    tryAutoPlay();

    // Fallback: start on first user interaction
    const kickstart = () => {
      tryAutoPlay();
      document.removeEventListener('click', kickstart);
      document.removeEventListener('touchstart', kickstart);
    };
    document.addEventListener('click', kickstart);
    document.addEventListener('touchstart', kickstart);
    
    // Audio control button
    audioControl.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          audioControl.classList.remove('muted');
          audioControl.classList.add('playing');
        }).catch(() => {});
      } else {
        bgMusic.pause();
        audioControl.classList.remove('playing');
        audioControl.classList.add('muted');
      }
    });
    
    // Update button state
    bgMusic.addEventListener('play', () => {
      audioControl.classList.remove('muted');
      audioControl.classList.add('playing');
    });
    
    bgMusic.addEventListener('pause', () => {
      audioControl.classList.remove('playing');
      audioControl.classList.add('muted');
    });
  }

  /**
   * Generate heart curve points
   */
  generateHeartCurve() {
    this.heartPoints = [];
    const numPoints = 2000;
    
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      
      // Heart parametric equations
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      this.heartPoints.push({ x, y, t });
    }
  }

  /**
   * Create floating particles effect
   */
  createFloatingParticles() {
    const container = document.getElementById('particles');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const randomX = Math.random() * window.innerWidth;
      const randomDelay = Math.random() * 2;
      const randomDuration = 4 + Math.random() * 3;
      
      particle.style.left = randomX + 'px';
      particle.style.bottom = '-10px';
      particle.style.animationDuration = randomDuration + 's';
      particle.style.animationDelay = randomDelay + 's';
      
      container.appendChild(particle);
      
      // Recreate particle after animation ends
      particle.addEventListener('animationend', () => {
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDelay = '0s';
      });
    }
  }

  /**
   * Create twinkling stars
   */
  createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      star.style.left = Math.random() * window.innerWidth + 'px';
      star.style.top = Math.random() * window.innerHeight + 'px';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (2 + Math.random() * 2) + 's';
      
      starsContainer.appendChild(star);
    }
  }

  /**
   * Update animation
   */
  update() {
    this.time += 0.016; // 60fps
    
    // Pulsing heart effect
    this.heartPulse = 1 + Math.sin(this.time * 1.5) * 0.15;
  }

  /**
   * Draw the heart
   */
  drawHeart() {
    const centerX = (this.width || this.canvas.width) / 2;
    const centerY = (this.height || this.canvas.height) / 2 - 40;
    const baseScale = Math.min((this.width || this.canvas.width), (this.height || this.canvas.height)) / 450;
    const scale = baseScale * this.heartPulse;
    
    // Draw heart stroke with gradient
    const strokeWidth = Math.max(1.5, 2.2 * baseScale);
    
    for (let i = 0; i < this.heartPoints.length - 1; i++) {
      const p1 = this.heartPoints[i];
      const p2 = this.heartPoints[i + 1];
      
      const x1 = centerX + p1.x * scale;
      const y1 = centerY + p1.y * scale;
      const x2 = centerX + p2.x * scale;
      const y2 = centerY + p2.y * scale;
      
      // Gradient for beautiful effect
      const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
      
      // Color variation based on position
      const hueShift = (i / this.heartPoints.length) * 60;
      gradient.addColorStop(0, `hsl(${340 + hueShift * 0.1}, 100%, ${50 + Math.sin(this.time + i * 0.01) * 10}%)`);
      gradient.addColorStop(1, `hsl(${340 + hueShift * 0.1}, 100%, ${50 + Math.sin(this.time + i * 0.01) * 10}%)`);
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = strokeWidth;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
    
    // Draw glowing particles along heart
    const glowIntensity = (6 * baseScale) + Math.sin(this.time * 2) * (2 * baseScale);
    
    for (let i = 0; i < this.heartPoints.length; i += 3) {
      const p = this.heartPoints[i];
      const x = centerX + p.x * scale;
      const y = centerY + p.y * scale;
      
      // Draw glow
      const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowIntensity);
      glowGradient.addColorStop(0, `rgba(255, 51, 102, ${0.6 + Math.sin(this.time + i * 0.02) * 0.3})`);
      glowGradient.addColorStop(1, `rgba(255, 51, 102, 0)`);
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, glowIntensity, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw core
      this.ctx.fillStyle = `rgba(255, 51, 102, ${0.8 + Math.sin(this.time + i * 0.02) * 0.2})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, Math.max(1.2, 1.6 * baseScale), 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Draw inner glow effect
   */
  drawInnerGlow() {
    const centerX = (this.width || this.canvas.width) / 2;
    const centerY = (this.height || this.canvas.height) / 2 - 40;
    
        const glowRadius = Math.min((this.width || this.canvas.width), (this.height || this.canvas.height)) * 0.65;
    
// Soft vignette
    const radialGradient = this.ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, glowRadius
    );
    
    radialGradient.addColorStop(0, `rgba(255, 51, 102, ${0.1 + Math.sin(this.time * 2) * 0.05})`);
    radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.fillStyle = radialGradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Main animation loop
   */
  animate() {
    // Clear canvas with fade
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, (this.width || this.canvas.width), (this.height || this.canvas.height));
    
    this.update();
    this.drawInnerGlow();
    this.drawHeart();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ConfessionAnimation();
});
