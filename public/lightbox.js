// Lightbox Gallery for Project Images
class Lightbox {
  constructor() {
    this.init()
    // Slideshow settings
    this.slideshowInterval = null
    this.slideshowDelay = 3000 // 3 seconds between slides
    this.isPlaying = false
  }

  init() {
    // Create lightbox elements
    this.lightbox = document.createElement("div")
    this.lightbox.id = "lightbox"
    this.lightbox.className = "lightbox"

    this.content = document.createElement("div")
    this.content.className = "lightbox-content"

    this.img = document.createElement("img")
    this.img.className = "lightbox-image"

    this.caption = document.createElement("div")
    this.caption.className = "lightbox-caption"

    this.close = document.createElement("span")
    this.close.className = "lightbox-close"
    this.close.innerHTML = "&times;"

    this.prev = document.createElement("span")
    this.prev.className = "lightbox-nav lightbox-prev"
    this.prev.innerHTML = "&#10094;"

    this.next = document.createElement("span")
    this.next.className = "lightbox-nav lightbox-next"
    this.next.innerHTML = "&#10095;"

    // Add swipe instruction for mobile
    this.swipeInstruction = document.createElement("div")
    this.swipeInstruction.className = "swipe-instruction"
    this.swipeInstruction.innerHTML = "Swipe to navigate"

    // Add slideshow play/pause button
    this.slideshow = document.createElement("span")
    this.slideshow.className = "lightbox-slideshow"
    this.slideshow.innerHTML = "&#9658;" // Play icon
    this.slideshow.title = "Start Slideshow"

    // Add slideshow controls container
    this.controls = document.createElement("div")
    this.controls.className = "lightbox-controls"

    // Add counter to show current image position
    this.counter = document.createElement("div")
    this.counter.className = "lightbox-counter"

    // Append elements
    this.controls.appendChild(this.slideshow)
    this.controls.appendChild(this.counter)

    this.content.appendChild(this.img)
    this.content.appendChild(this.caption)
    this.content.appendChild(this.close)
    this.content.appendChild(this.prev)
    this.content.appendChild(this.next)
    this.content.appendChild(this.swipeInstruction)
    this.content.appendChild(this.controls)
    this.lightbox.appendChild(this.content)

    // Add to document
    document.body.appendChild(this.lightbox)

    // Setup event listeners
    this.setupEventListeners()

    // Initialize gallery items
    this.initGalleryItems()

    // Touch variables
    this.touchStartX = 0
    this.touchEndX = 0
    this.minSwipeDistance = 50 // Minimum distance to register as a swipe
  }

  setupEventListeners() {
    // Close lightbox when clicking the close button
    this.close.addEventListener("click", () => this.closeLightbox())

    // Close lightbox when clicking outside the image
    this.lightbox.addEventListener("click", (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox()
      }
    })

    // Navigate with arrow keys
    document.addEventListener("keydown", (e) => {
      if (!this.lightbox.classList.contains("active")) return

      if (e.key === "Escape") {
        this.closeLightbox()
      } else if (e.key === "ArrowLeft") {
        this.navigateGallery(-1)
      } else if (e.key === "ArrowRight") {
        this.navigateGallery(1)
      } else if (e.key === " ") {
        // Space bar toggles slideshow
        this.toggleSlideshow()
        e.preventDefault() // Prevent page scrolling
      }
    })

    // Navigate with buttons
    this.prev.addEventListener("click", () => this.navigateGallery(-1))
    this.next.addEventListener("click", () => this.navigateGallery(1))

    // Toggle slideshow
    this.slideshow.addEventListener("click", () => this.toggleSlideshow())

    // Touch events for swipe navigation
    this.content.addEventListener("touchstart", (e) => this.handleTouchStart(e), { passive: true })
    this.content.addEventListener("touchend", (e) => this.handleTouchEnd(e), { passive: true })
    this.content.addEventListener("touchmove", (e) => this.handleTouchMove(e), { passive: true })
  }

  // Touch event handlers
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX
    this.touchStartY = e.changedTouches[0].screenY

    // Pause slideshow on touch
    if (this.isPlaying) {
      this.pauseSlideshow(false) // Pause without updating button
    }
  }

  handleTouchMove(e) {
    // Prevent default only if it's a horizontal swipe to avoid interfering with vertical scrolling
    const touchX = e.changedTouches[0].screenX
    const touchY = e.changedTouches[0].screenY

    const xDiff = this.touchStartX - touchX
    const yDiff = this.touchStartY - touchY

    // If horizontal swipe is more significant than vertical
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // Add a visual indicator of the swipe direction
      if (xDiff > 0) {
        this.content.classList.add("swiping-left")
        this.content.classList.remove("swiping-right")
      } else {
        this.content.classList.add("swiping-right")
        this.content.classList.remove("swiping-left")
      }
    }
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX
    this.touchEndY = e.changedTouches[0].screenY

    // Remove swiping classes
    this.content.classList.remove("swiping-left", "swiping-right")

    // Calculate horizontal and vertical differences
    const xDiff = this.touchStartX - this.touchEndX
    const yDiff = this.touchStartY - this.touchEndY

    // Only process as a swipe if the horizontal movement is greater than vertical
    // This prevents accidental swipes when trying to scroll vertically
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (Math.abs(xDiff) > this.minSwipeDistance) {
        if (xDiff > 0) {
          // Swiped left - go to next
          this.navigateGallery(1)
        } else {
          // Swiped right - go to previous
          this.navigateGallery(-1)
        }
      }
    }
  }

  initGalleryItems() {
    // Get all project images
    this.galleryItems = document.querySelectorAll(".project-img img")
    this.galleryItems.forEach((item, index) => {
      // Make the image container clickable
      item.parentElement.classList.add("lightbox-trigger")

      // Add click event to open lightbox
      item.parentElement.addEventListener("click", (e) => {
        e.preventDefault()
        this.openLightbox(index)
      })
    })
  }

  openLightbox(index) {
    this.currentIndex = index
    const currentItem = this.galleryItems[index]

    // Get project title and description
    const projectInfo = currentItem.closest(".project-item").querySelector(".project-info")
    const title = projectInfo.querySelector("h2").textContent

    // Set image source and caption
    this.img.src = currentItem.src
    this.caption.textContent = title

    // Update counter
    this.updateCounter()

    // Show lightbox with animation
    this.lightbox.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent scrolling

    // Check if navigation should be visible
    this.updateNavigation()

    // Show swipe instruction on mobile devices
    if (this.isMobileDevice()) {
      this.swipeInstruction.classList.add("visible")
      // Hide instruction after 3 seconds
      setTimeout(() => {
        this.swipeInstruction.classList.remove("visible")
      }, 3000)
    } else {
      this.swipeInstruction.classList.remove("visible")
    }

    // Reset slideshow state
    this.isPlaying = false
    this.updateSlideshowButton()
    this.stopSlideshow()
  }

  closeLightbox() {
    this.lightbox.classList.remove("active")
    document.body.style.overflow = "" // Restore scrolling

    // Stop slideshow if it's running
    this.stopSlideshow()
  }

  navigateGallery(direction) {
    // Stop slideshow if user manually navigates
    if (this.isPlaying) {
      this.pauseSlideshow()
    }

    this.currentIndex += direction

    // Ensure index is within bounds
    if (this.currentIndex < 0) {
      this.currentIndex = 0
      // Add a bounce effect when trying to go past the first image
      this.content.classList.add("bounce-left")
      setTimeout(() => {
        this.content.classList.remove("bounce-left")
      }, 300)
      return
    } else if (this.currentIndex >= this.galleryItems.length) {
      this.currentIndex = this.galleryItems.length - 1
      // Add a bounce effect when trying to go past the last image
      this.content.classList.add("bounce-right")
      setTimeout(() => {
        this.content.classList.remove("bounce-right")
      }, 300)
      return
    }

    // Update lightbox content
    const currentItem = this.galleryItems[this.currentIndex]

    // Get project title
    const projectInfo = currentItem.closest(".project-item").querySelector(".project-info")
    const title = projectInfo.querySelector("h2").textContent

    // Update image with fade effect
    this.img.classList.add("fade")
    setTimeout(() => {
      this.img.src = currentItem.src
      this.caption.textContent = title
      this.img.classList.remove("fade")
    }, 300)

    // Update counter
    this.updateCounter()

    // Update navigation visibility
    this.updateNavigation()
  }

  updateNavigation() {
    // Hide prev button if at first image
    if (this.currentIndex === 0) {
      this.prev.classList.add("hidden")
    } else {
      this.prev.classList.remove("hidden")
    }

    // Hide next button if at last image
    if (this.currentIndex === this.galleryItems.length - 1) {
      this.next.classList.add("hidden")
    } else {
      this.next.classList.remove("hidden")
    }
  }

  updateCounter() {
    // Update the counter text
    this.counter.textContent = `${this.currentIndex + 1} / ${this.galleryItems.length}`
  }

  // Slideshow methods
  startSlideshow() {
    this.isPlaying = true
    this.updateSlideshowButton()

    // Clear any existing interval
    this.stopSlideshow()

    // Start new interval
    this.slideshowInterval = setInterval(() => {
      // If we're at the last image, loop back to the first
      if (this.currentIndex >= this.galleryItems.length - 1) {
        this.currentIndex = -1 // Will be incremented to 0 in navigateGallery
      }
      this.navigateGallery(1)
    }, this.slideshowDelay)

    // Show notification
    this.showNotification("Slideshow started")
  }

  pauseSlideshow(updateButton = true) {
    this.isPlaying = false
    if (updateButton) {
      this.updateSlideshowButton()
      this.showNotification("Slideshow paused")
    }
    this.stopSlideshow()
  }

  stopSlideshow() {
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval)
      this.slideshowInterval = null
    }
  }

  toggleSlideshow() {
    if (this.isPlaying) {
      this.pauseSlideshow()
    } else {
      this.startSlideshow()
    }
  }

  updateSlideshowButton() {
    if (this.isPlaying) {
      this.slideshow.innerHTML = "&#10074;&#10074;" // Pause icon
      this.slideshow.title = "Pause Slideshow"
      this.slideshow.classList.add("playing")
    } else {
      this.slideshow.innerHTML = "&#9658;" // Play icon
      this.slideshow.title = "Start Slideshow"
      this.slideshow.classList.remove("playing")
    }
  }

  showNotification(message) {
    // Create notification element if it doesn't exist
    if (!this.notification) {
      this.notification = document.createElement("div")
      this.notification.className = "lightbox-notification"
      this.content.appendChild(this.notification)
    }

    // Set message and show notification
    this.notification.textContent = message
    this.notification.classList.add("visible")

    // Hide after 2 seconds
    clearTimeout(this.notificationTimeout)
    this.notificationTimeout = setTimeout(() => {
      this.notification.classList.remove("visible")
    }, 2000)
  }

  // Helper method to detect mobile devices
  isMobileDevice() {
    return (
      window.innerWidth <= 768 ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    )
  }
}

// Initialize lightbox when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Lightbox()
})
