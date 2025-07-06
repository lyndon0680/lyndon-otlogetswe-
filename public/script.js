document.getElementById("current-year").textContent = new Date().getFullYear()

// Mobile menu fuctionality
document.addEventListener("DOMContentLoaded", () => {
  const smallMenu = document.querySelector(".small_menu")
  const navList = document.querySelector(".nav-list ul")
  const navLinks = document.querySelectorAll(".nav-list ul li a")

  smallMenu.addEventListener("click", function () {
    this.classList.toggle("active")
    navList.classList.toggle("active")
  })

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      smallMenu.classList.remove("active")
      navList.classList.remove("active")
    })
  })

  window.addEventListener("scroll", () => {
    const header = document.querySelector("#header .header")
    if (window.scrollY > 100) {
      header.style.backgroundColor = "rgba(31, 30, 30, 1)"
    } else {
      header.style.backgroundColor = "rgba(31, 30, 30, 0.24)"
    }
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendMessageBtn');
  
  if (form && sendBtn) {
    // Store original button text
    const originalBtnText = sendBtn.textContent;
    
    // Add visual feedback class
    form.addEventListener('submit', function (e) {
      // Disable the button
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending...';
      sendBtn.classList.add('sending');
      
      // For Formspree, the page will redirect on success
      // But we can add a success message before redirect
      setTimeout(() => {
        sendBtn.textContent = 'Sent!';
        sendBtn.classList.remove('sending');
        sendBtn.classList.add('sent');
      }, 1000);
      
      // Reset button if submission takes too long (optional fallback)
      setTimeout(() => {
        if (sendBtn.disabled) {
          sendBtn.disabled = false;
          sendBtn.textContent = originalBtnText;
          sendBtn.classList.remove('sending', 'sent');
        }
      }, 8000);
    });
  }
  
  // Add this to your existing DOMContentLoaded event handler
  const inputs = form.querySelectorAll('.form-input');
  
  inputs.forEach(input => {
    // Show validation message when input loses focus
    input.addEventListener('blur', function() {
      if (!this.validity.valid) {
        this.classList.add('invalid');
      } else {
        this.classList.remove('invalid');
      }
    });
    
    // Remove invalid class when user starts typing again
    input.addEventListener('input', function() {
      if (this.classList.contains('invalid')) {
        this.classList.remove('invalid');
      }
    });
  });
});
