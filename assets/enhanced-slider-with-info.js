;(function () {
  const enhancedSliderWithInfo = () => {
    const sections = document.querySelectorAll(
      '.section-enhanced-slider-with-info'
    )

    sections.forEach(section => {
      if (section.classList.contains('enhanced_slider_initialized')) return

      section.classList.add('enhanced_slider_initialized')

      const sliderContainer = section.querySelector(
        '.enhanced-slider-with-info'
      )
      if (!sliderContainer) return

      const swiperElement = section.querySelector('.enhanced-image-swiper')
      if (!swiperElement) return

      // Get settings from data attributes
      const autoplay = sliderContainer.dataset.autoplay === 'true'
      const stopAutoplay = sliderContainer.dataset.stopAutoplay === 'true'
      const delay = parseInt(sliderContainer.dataset.delay) * 1000 || 3000
      const speed = parseInt(sliderContainer.dataset.speed) * 1000 || 1100
      const animation = sliderContainer.dataset.animation || 'slide'

      // Progress bar functionality
      const progressBar = section.querySelector('.progress-fill')
      let progressInterval

      const updateProgressBar = swiper => {
        if (!progressBar || !autoplay) return

        let progress = 0
        clearInterval(progressInterval)

        progressInterval = setInterval(() => {
          progress += 100 / (delay / 100)
          progressBar.style.width = `${Math.min(progress, 100)}%`

          if (progress >= 100) {
            clearInterval(progressInterval)
            progress = 0
          }
        }, 100)
      }

      const resetProgressBar = () => {
        if (progressBar) {
          progressBar.style.width = '0%'
          clearInterval(progressInterval)
        }
      }

      // Animation effects configuration
      const getAnimationConfig = animationType => {
        switch (animationType) {
          case 'fade':
            return {
              effect: 'fade',
              fadeEffect: {
                crossFade: true
              }
            }
          case 'creative':
            return {
              effect: 'creative',
              creativeEffect: {
                prev: {
                  shadow: true,
                  translate: ['-20%', 0, -1]
                },
                next: {
                  translate: ['100%', 0, 0]
                }
              }
            }
          case 'coverflow':
            return {
              effect: 'coverflow',
              coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
              }
            }
          default:
            return { effect: 'slide' }
        }
      }

      // Autoplay configuration
      const autoplayConfig = autoplay
        ? {
            autoplay: {
              delay: delay,
              pauseOnMouseEnter: stopAutoplay,
              disableOnInteraction: false,
              reverseDirection: false
            }
          }
        : {}

      // Swiper configuration
      const swiperConfig = {
        ...getAnimationConfig(animation),
        speed: speed,
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        grabCursor: true,
        keyboard: {
          enabled: true,
          onlyInViewport: true
        },
        mousewheel: {
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true
        },
        navigation: {
          nextEl: section.querySelector('.swiper-button-next'),
          prevEl: section.querySelector('.swiper-button-prev')
        },
        pagination: {
          el: section.querySelector('.swiper-pagination'),
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3
        },
        ...autoplayConfig,

        // Event callbacks
        on: {
          init: function () {
            // Animate content on initialization
            animateContent()
            updateProgressBar(this)
          },
          slideChange: function () {
            resetProgressBar()
            updateProgressBar(this)
            animateContent()
          },
          autoplayStart: function () {
            updateProgressBar(this)
          },
          autoplayStop: function () {
            resetProgressBar()
          },
          autoplayPause: function () {
            clearInterval(progressInterval)
          },
          autoplayResume: function () {
            updateProgressBar(this)
          }
        }
      }

      // Initialize Swiper
      const swiper = new Swiper(swiperElement, swiperConfig)

      // Content animation function
      const animateContent = () => {
        const animatedElements = section.querySelectorAll('.animated-content')

        animatedElements.forEach((element, index) => {
          element.style.opacity = '0'
          element.style.transform = 'translateY(20px)'

          setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
            element.style.opacity = '1'
            element.style.transform = 'translateY(0)'
          }, index * 100 + 200)
        })
      }

      // Enhanced navigation with keyboard support
      const handleKeydown = e => {
        if (!section.querySelector(':hover')) return

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault()
            swiper.slidePrev()
            break
          case 'ArrowRight':
            e.preventDefault()
            swiper.slideNext()
            break
          case ' ':
            e.preventDefault()
            if (autoplay) {
              if (swiper.autoplay.running) {
                swiper.autoplay.stop()
              } else {
                swiper.autoplay.start()
              }
            }
            break
        }
      }

      document.addEventListener('keydown', handleKeydown)

      // Touch gesture enhancements for mobile
      let touchStartY = 0
      let touchEndY = 0

      const handleTouchStart = e => {
        touchStartY = e.changedTouches[0].screenY
      }

      const handleTouchEnd = e => {
        touchEndY = e.changedTouches[0].screenY
        handleSwipeGesture()
      }

      const handleSwipeGesture = () => {
        const swipeThreshold = 50
        const diff = touchStartY - touchEndY

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            // Swipe up - next slide
            swiper.slideNext()
          } else {
            // Swipe down - previous slide
            swiper.slidePrev()
          }
        }
      }

      // Add touch listeners only on mobile
      if (window.innerWidth <= 768) {
        swiperElement.addEventListener('touchstart', handleTouchStart, {
          passive: true
        })
        swiperElement.addEventListener('touchend', handleTouchEnd, {
          passive: true
        })
      }

      // Intersection Observer for performance
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (autoplay && swiper.autoplay) {
              swiper.autoplay.start()
            }
          } else {
            if (autoplay && swiper.autoplay) {
              swiper.autoplay.stop()
              resetProgressBar()
            }
          }
        })
      }, observerOptions)

      observer.observe(sliderContainer)

      // Cleanup function
      const cleanup = () => {
        clearInterval(progressInterval)
        observer.disconnect()
        document.removeEventListener('keydown', handleKeydown)
        if (swiper) swiper.destroy(true, true)
      }

      // Store cleanup function for potential later use
      section._cleanupEnhancedSlider = cleanup

      // Handle page visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (autoplay && swiper.autoplay) {
            swiper.autoplay.stop()
            resetProgressBar()
          }
        } else {
          if (autoplay && swiper.autoplay) {
            swiper.autoplay.start()
          }
        }
      })
    })
  }

  // Initialize on DOM content loaded
  document.addEventListener('DOMContentLoaded', enhancedSliderWithInfo)

  // Reinitialize on Shopify section events
  document.addEventListener('shopify:section:load', enhancedSliderWithInfo)

  // Cleanup on section unload
  document.addEventListener('shopify:section:unload', e => {
    const section = e.target
    if (section._cleanupEnhancedSlider) {
      section._cleanupEnhancedSlider()
    }
  })

  // Handle resize events
  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      // Reinitialize sliders on significant size changes
      if (window.innerWidth !== window._lastWidth) {
        window._lastWidth = window.innerWidth
        enhancedSliderWithInfo()
      }
    }, 250)
  })

  window._lastWidth = window.innerWidth
})()
