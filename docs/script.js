// ==========================================
// PRAPTEE'S CINEMATIC ANIME PORTFOLIO
// UPGRADED CHARACTER ANIMATIONS
// ==========================================

const character = document.getElementById("character");
const characterStage = document.querySelector(".character-stage");
const cursorGlow = document.querySelector(".cursor-glow");
const sections = document.querySelectorAll(".scene");
const currentSection = document.getElementById("current-section");

const characterPoses = {
  home: "assets/pose-home.png",
  about: "assets/pose-about-look.png",
  projects: "assets/pose-projects-work.png",
  skills: "assets/pose-skills-float.png",
  contact: "assets/pose-about.png"
};

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let currentPose = "home";
let currentImageVersion = 0;

// Preload character poses to make transitions smoother
Object.values(characterPoses).forEach((src) => {
  const image = new Image();
  image.src = src;
});

// ------------------------------------------
// CINEMATIC CHARACTER POSE TRANSITIONS
// ------------------------------------------

function changeCharacterPose(sectionName) {
  const newImage = characterPoses[sectionName];

  if (!newImage || currentPose === sectionName) return;

  currentPose = sectionName;
  const version = ++currentImageVersion;

  if (!window.gsap || reducedMotion) {
    character.src = newImage;
    return;
  }

  gsap.to(character, {
    opacity: 0,
    scale: 0.94,
    rotationY: -8,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      if (version !== currentImageVersion) return;

      const image = new Image();

      image.onload = () => {
        if (version !== currentImageVersion) return;

        character.src = newImage;

        gsap.fromTo(
          character,
          {
            opacity: 0,
            scale: 1.06,
            rotationY: 8
          },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 0.75,
            ease: "power3.out"
          }
        );
      };

      image.onerror = () => {
        character.style.opacity = "1";
      };

      image.src = newImage;
    }
  });
}

// ------------------------------------------
// SECTION DETECTION
// ------------------------------------------

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const sectionName = entry.target.dataset.pose;
      const sectionIndex = [...sections].indexOf(entry.target);

      sections.forEach((section) => {
        section.classList.remove("active");
      });

      entry.target.classList.add("active");

      changeCharacterPose(sectionName);

      currentSection.textContent = String(
        sectionIndex + 1
      ).padStart(2, "0");
    });
  },
  {
    threshold: 0.45
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

// ------------------------------------------
// CURSOR GLOW
// ------------------------------------------

if (!reducedMotion && window.innerWidth > 600) {
  window.addEventListener("mousemove", (event) => {
    gsap.to(cursorGlow, {
      left: event.clientX,
      top: event.clientY,
      duration: 0.45,
      ease: "power2.out"
    });
  });
}

// ------------------------------------------
// CHARACTER FLOATING ANIMATION
// ------------------------------------------

if (window.gsap && !reducedMotion) {
  gsap.to(characterStage, {
    y: -13,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

// ------------------------------------------
// CHARACTER CURSOR PARALLAX
// ------------------------------------------

if (window.gsap && !reducedMotion) {
  const moveX = gsap.quickTo(character, "x", {
    duration: 0.8,
    ease: "power3.out"
  });

  const moveY = gsap.quickTo(character, "y", {
    duration: 0.8,
    ease: "power3.out"
  });

  const rotateY = gsap.quickTo(character, "rotationY", {
    duration: 0.8,
    ease: "power3.out"
  });

  window.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 600) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 30;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;

    moveX(x);
    moveY(y);
    rotateY(x * 0.25);
  });

  window.addEventListener("mouseleave", () => {
    moveX(0);
    moveY(0);
    rotateY(0);
  });
}

// ------------------------------------------
// CINEMATIC SCROLL ANIMATIONS
// ------------------------------------------

if (window.gsap && window.ScrollTrigger && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  sections.forEach((section) => {
    const content = section.querySelector(".scene-content");

    gsap.fromTo(
      content,
      {
        opacity: 0,
        y: 45
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true
        }
      }
    );

    // Gentle background movement while scrolling
    gsap.fromTo(
      section,
      {
        backgroundPosition: "center 0%"
      },
      {
        backgroundPosition: "center 12%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      }
    );
  });

  // Project cards appear one after another
  gsap.from(".project-card", {
    opacity: 0,
    y: 45,
    scale: 0.96,
    duration: 0.9,
    stagger: 0.18,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".projects",
      start: "top 65%",
      once: true
    }
  });

  // Skill tags reveal individually
  gsap.from(".skill-list span", {
    opacity: 0,
    y: 20,
    scale: 0.9,
    duration: 0.55,
    stagger: 0.09,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: ".skills",
      start: "top 65%",
      once: true
    }
  });
}

// ------------------------------------------
// INITIAL STATE
// ------------------------------------------

sections[0].classList.add("active");

console.log("Cinematic character animations activated!");
// ==========================================
// UPGRADE 2 - MAGICAL PARTICLE ENGINE
// ==========================================

(() => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = [];

  const particleCount = width < 600 ? 24 : 65;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.35 + 0.12,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.55 + 0.15,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.y -= particle.speedY;
      particle.x += particle.speedX;
      particle.pulse += 0.025;

      if (particle.y < -5) {
        particle.y = height + 5;
        particle.x = Math.random() * width;
      }

      if (particle.x < -5) particle.x = width + 5;
      if (particle.x > width + 5) particle.x = -5;

      const glow =
        particle.opacity *
        (0.65 + Math.sin(particle.pulse) * 0.35);

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(194, 151, 255, ${glow})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(162, 99, 255, 0.8)";
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
})();

// ==========================================
// CURSOR-RESPONSIVE BACKGROUND PARALLAX
// ==========================================

(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const scenes = document.querySelectorAll(".scene");

  let pointerX = 0;
  let pointerY = 0;

  window.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 600) return;

    pointerX = (event.clientX / window.innerWidth - 0.5) * 18;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 12;

    scenes.forEach((scene) => {
      scene.style.setProperty("--bg-x", `${pointerX}px`);
      scene.style.setProperty("--bg-y", `${pointerY}px`);
    });
  });

  window.addEventListener("mouseleave", () => {
    scenes.forEach((scene) => {
      scene.style.setProperty("--bg-x", "0px");
      scene.style.setProperty("--bg-y", "0px");
    });
  });
})();

console.log("Magical background effects activated!");