// Smooth scrolling for navigation links
function scrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Handle navigation link clicks
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const elementId = href.substring(1);
    scrollTo(elementId);
  });
});

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    company: document.getElementById('company').value,
    message: document.getElementById('message').value
  };

  // Log form data (in a real app, this would send to a backend)
  console.log('Form submitted:', formData);

  // Show success message
  showFormSuccess();

  // Reset form
  document.getElementById('contactForm').reset();
});

function showFormSuccess() {
  const form = document.getElementById('contactForm');
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.textContent = '✓ Thank you! We\'ll get back to you soon.';
  successMsg.style.cssText = `
    background-color: #10b981;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    animation: slideIn 0.3s ease-in;
  `;

  form.parentNode.insertBefore(successMsg, form);

  // Remove success message after 5 seconds
  setTimeout(() => {
    successMsg.remove();
  }, 5000);
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Highlight active navigation link based on scroll position
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      const sectionId = section.getAttribute('id');
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
});

// Add active link styling
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .nav-link.active {
    color: var(--primary-color) !important;
    border-bottom: 2px solid var(--primary-color);
  }
`;
document.head.appendChild(activeStyle);
