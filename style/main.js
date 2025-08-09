    document.addEventListener('DOMContentLoaded', function () {
      // --- Neural Network Background Animation ---
      const canvas = document.getElementById('neural-network-bg');
      const ctx = canvas.getContext('2d');

      let particles = [];
      let mouse = { x: null, y: null, radius: 150 };

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(); // Re-initialize particles on resize
      }
      
      window.addEventListener('resize', resizeCanvas);

      window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
      });
      window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
      });

      class Particle {
        constructor(x, y, directionX, directionY, size, color) {
          this.x = x;
          this.y = y;
          this.directionX = directionX;
          this.directionY = directionY;
          this.size = size;
          this.color = color;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
        update() {
          if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
          }
          if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
          }
          
          // Mouse collision detection
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
              if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                  this.x += 3;
              }
              if (mouse.x > this.x && this.x > this.size * 10) {
                  this.x -= 3;
              }
              if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                  this.y += 3;
              }
              if (mouse.y > this.y && this.y > this.size * 10) {
                  this.y -= 3;
              }
          }
          
          this.x += this.directionX;
          this.y += this.directionY;
          this.draw();
        }
      }

      function init() {
        particles = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
          let size = (Math.random() * 2) + 1;
          let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
          let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
          let directionX = (Math.random() * .4) - .2;
          let directionY = (Math.random() * .4) - .2;
          let color = 'rgba(0, 242, 255, 0.5)';
          particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
      }

      function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
          for (let b = a; b < particles.length; b++) {
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                         + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
              opacityValue = 1 - (distance/20000);
              ctx.strokeStyle = `rgba(0, 242, 255, ${opacityValue})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
        }
      }

      function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,innerWidth, innerHeight);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
        }
        connect();
      }
      
      resizeCanvas(); // Initial call to set size and init particles
      animate();

      // --- Back to Top button functionality ---
      const backToTopBtn = document.getElementById("backToTopBtn");
      window.onscroll = function () {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
          backToTopBtn.style.display = "block";
        } else {
          backToTopBtn.style.display = "none";
        }
      };
      backToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // --- Intersection Observer for scroll animations ---
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.1
      });

      const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
      elementsToAnimate.forEach(el => observer.observe(el));
    });
