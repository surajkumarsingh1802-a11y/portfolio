// Mobile navigation, theme switching, scroll effects, and contact form validation.
const body = document.body;
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const scrollTopButton = document.getElementById("scrollTop");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-link");

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
  themeToggle.textContent = "☀";
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "☀" : "☾";
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
});

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  scrollTopButton.classList.toggle("show", currentScroll > 500);

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 110;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
      navItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${sectionId}`);
      });
    }
  });
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".progress span").forEach((bar) => {
          bar.style.width = bar.dataset.width;
        });
      }
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll(".skills-grid").forEach((element) => skillObserver.observe(element));

function setError(field, message) {
  const errorElement = field.nextElementSibling;
  errorElement.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  let isValid = true;

  setError(name, "");
  setError(email, "");
  setError(message, "");
  formStatus.textContent = "";

  if (name.value.trim().length < 2) {
    setError(name, "Please enter your name.");
    isValid = false;
  }

  if (!isValidEmail(email.value.trim())) {
    setError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    setError(message, "Please write a message of at least 10 characters.");
    isValid = false;
  }

  if (isValid) {
    formStatus.textContent = "Thank you! Your message has been checked successfully.";
    contactForm.reset();
  }
});
