if (!customElements.get('countdown-timer-bar')) {
  class CountdownBar extends HTMLElement {
    constructor () {
      super()
      this.userDate = this.getAttribute('data-date')
      this.userTime = this.getAttribute('data-time')
      this.interval
      this.setInterval(this.userDate, this.userTime)
      this.calcHeight()
    }

    onInit (userDate, userTime) {
      this.completedCountdown = this.getAttribute('data-completed')
      this.dailyReset = this.getAttribute('data-daily-reset') === 'true'
      this.countdown = this.querySelector('.countdown-timer-bar__main')
      this.countdownHeading = this.querySelector('.countdown-timer-bar__end')
      this.daysEl = this.querySelector('.countdown-timer-bar__days')
      this.hoursEl = this.querySelector('.countdown-timer-bar__hours')
      this.minutesEl = this.querySelector('.countdown-timer-bar__minutes')
      this.secondsEl = this.querySelector('.countdown-timer-bar__seconds')
      this.section = this.closest('.section-countdown-timer-bar')
      // ----------------------------------------------------------------

      let countdownDate, distance, days, hours, minutes, seconds
      const now = new Date()

      if (this.dailyReset) {
        // For daily reset, calculate next occurrence of the time today or tomorrow
        const [timeHour, timeMinute] = userTime.split(':').map(Number)
        const todayTarget = new Date(now)
        todayTarget.setHours(timeHour, timeMinute, 0, 0)

        // If the target time has already passed today, set it for tomorrow
        if (todayTarget.getTime() <= now.getTime()) {
          todayTarget.setDate(todayTarget.getDate() + 1)
        }

        countdownDate = todayTarget
        distance = countdownDate.getTime() - now.getTime()
      } else {
        // Original logic for fixed end date
        countdownDate = new Date(`${userDate}T${userTime}`)
        distance = countdownDate.getTime() - now.getTime()
      }

      days = Math.floor(distance / (1000 * 60 * 60 * 24))
      hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      seconds = Math.floor((distance % (1000 * 60)) / 1000)
      // ----------------------------------------------------------------
      if (distance < 0) {
        if (this.dailyReset) {
          // For daily reset, the timer should automatically reset for the next day
          // The calculation above already handles this, so we just continue
          if (String(days).length === 1) {
            if (this.daysEl) this.daysEl.textContent = '0' + days
          } else {
            if (this.daysEl) this.daysEl.textContent = days
          }

          if (String(hours).length === 1) {
            if (this.hoursEl) this.hoursEl.textContent = '0' + hours
          } else {
            if (this.hoursEl) this.hoursEl.textContent = hours
          }

          if (String(minutes).length === 1) {
            if (this.minutesEl) this.minutesEl.textContent = '0' + minutes
          } else {
            if (this.minutesEl) this.minutesEl.textContent = minutes
          }

          if (String(seconds).length === 1) {
            if (this.secondsEl) this.secondsEl.textContent = '0' + seconds
          } else {
            if (this.secondsEl) this.secondsEl.textContent = seconds
          }
        } else if (this.completedCountdown === 'hide_section') {
          clearInterval(this.interval)
          this.section.style.display = 'none'
        } else if (this.completedCountdown === 'show_text') {
          if (this.countdown) this.countdown.style.display = 'none'
          if (this.countdownHeading)
            this.countdownHeading.style.display = 'flex'
        }
      } else {
        // Reset the show-text state if timer is running
        if (this.countdown && this.countdown.style.display === 'none') {
          this.countdown.style.display = 'flex'
          if (this.countdownHeading)
            this.countdownHeading.style.display = 'none'
        }
        if (String(days).length === 1) {
          if (this.daysEl) this.daysEl.textContent = '0' + days
        } else {
          if (this.daysEl) this.daysEl.textContent = days
        }

        if (String(hours).length === 1) {
          if (this.hoursEl) this.hoursEl.textContent = '0' + hours
        } else {
          if (this.hoursEl) this.hoursEl.textContent = hours
        }

        if (String(minutes).length === 1) {
          if (this.minutesEl) this.minutesEl.textContent = '0' + minutes
        } else {
          if (this.minutesEl) this.minutesEl.textContent = minutes
        }

        if (String(seconds).length === 1) {
          if (this.secondsEl) this.secondsEl.textContent = '0' + seconds
        } else {
          if (this.secondsEl) this.secondsEl.textContent = seconds
        }
      }
    }

    setInterval (userDate, userTime) {
      clearInterval(this.interval)
      this.interval = setInterval(
        this.onInit.bind(this, userDate, userTime),
        1000
      )
    }

    calcHeight () {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            document.documentElement.style.setProperty(
              '--countdown-bar-height',
              `${entry.boundingClientRect.height}px`
            )
          } else {
            document.documentElement.style.setProperty(
              '--countdown-bar-height',
              '0px'
            )
          }
        })
      })

      observer.observe(this)
    }
  }

  customElements.define('countdown-timer-bar', CountdownBar)
}
