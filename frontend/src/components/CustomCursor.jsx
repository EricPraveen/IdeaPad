import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const canvasRef = useRef(null)
  const penRef = useRef(null)
  const ringRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if device is a touchscreen / coarse pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    document.body.classList.add('has-custom-cursor')

    const canvas = canvasRef.current
    const ctx = canvas ? canvas.getContext('2d') : null

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = window.devicePixelRatio || 1

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = window.devicePixelRatio || 1
      if (canvas) {
        canvas.width = width * dpr
        canvas.height = height * dpr
        if (ctx) {
          ctx.scale(dpr, dpr)
        }
      }
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let isFirstMove = true
    let rafId

    // Ink trail storage
    const trail = []
    let lastX = -100
    let lastY = -100

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (isFirstMove) {
        ringX = mouseX
        ringY = mouseY
        lastX = mouseX
        lastY = mouseY
        isFirstMove = false
        setIsVisible(true)
      }

      // Add point to blue ink trail if pen has moved at least 2px
      const dist = Math.hypot(mouseX - lastX, mouseY - lastY)
      if (dist > 2) {
        trail.push({
          x: mouseX,
          y: mouseY,
          age: 1.0 // opacity factor (1.0 down to 0)
        })
        lastX = mouseX
        lastY = mouseY
      }

      if (penRef.current) {
        // Pen tip is anchored directly at (mouseX, mouseY)
        penRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
    }

    const animate = () => {
      // 1. Smooth trailing ring physics (always lags behind cursor)
      const lag = 0.16
      ringX += (mouseX - ringX) * lag
      ringY += (mouseY - ringY) * lag

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      // 2. Draw Blue Ink Stripe / Trail on Canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, width, height)

        // Age points and remove decayed ones
        for (let i = 0; i < trail.length; i++) {
          trail[i].age -= 0.038 // fades out smoothly in ~26 frames (~450ms)
        }
        while (trail.length > 0 && trail[0].age <= 0) {
          trail.shift()
        }

        // Draw organic, tapered blue ink ribbon
        if (trail.length > 1) {
          for (let i = 0; i < trail.length - 1; i++) {
            const p1 = trail[i]
            const p2 = trail[i + 1]
            const midX = (p1.x + p2.x) / 2
            const midY = (p1.y + p2.y) / 2

            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.quadraticCurveTo(p1.x, p1.y, midX, midY)

            // Taper width: older tail is fine (1px), near the pen tip is thicker (3.5px)
            const progress = (i + 1) / trail.length
            const strokeW = Math.max(0.8, progress * 3.6)
            const opacity = Math.min(1, Math.max(0, p1.age * 0.85))

            ctx.lineWidth = strokeW
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            // Royal editorial blue ink color
            ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`
            ctx.stroke()
          }
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    const onMouseDown = () => setIsClicked(true)
    const onMouseUp = () => setIsClicked(false)

    const onMouseOver = (e) => {
      const target = e.target
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer') ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON'
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    const onMouseLeave = () => {
      setIsVisible(false)
      isFirstMove = true
      trail.length = 0 // Clear trail when exiting window
    }

    const onMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    rafId = requestAnimationFrame(animate)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } hidden md:block`}
    >
      {/* ─── Blue Ink Stripe Canvas Layer ─── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[99998]"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* ─── Smooth Trailing Ring (Behind cursor) ─── */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-[99999]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      >
        <div
          className={`rounded-full transition-[width,height,background-color,border-color,opacity,transform] duration-200 ease-out -translate-x-1/2 -translate-y-1/2 ${
            isHovered
              ? 'w-12 h-12 border-2 border-[#2563EB] bg-[#2563EB]/10 shadow-sm'
              : isClicked
              ? 'w-7 h-7 border border-[#2563EB] bg-[#2563EB]/25'
              : 'w-8 h-8 border border-[#2563EB]/40 bg-[#2563EB]/5'
          }`}
        />
      </div>

      {/* ─── Vintage Ink Fountain Pen Nib ─── */}
      <div
        ref={penRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-[100000]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      >
        <div
          className={`pointer-events-none transition-transform duration-150 ease-out origin-top-left ${
            isHovered ? 'scale-115 -rotate-6' : isClicked ? 'scale-90 translate-y-0.5' : 'scale-100'
          }`}
          style={{
            // Pen nib tip is positioned precisely at (0, 0)
            marginLeft: '-2px',
            marginTop: '-2px'
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pen Nib Body */}
            <path
              d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z"
              fill="#FAF6EE"
              stroke="#161412"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* Golden / Brass Shoulder Accent */}
            <path
              d="M16.5 5.5L18 13L13 18"
              fill="#C5A059"
              fillOpacity="0.4"
            />

            {/* Pen Nib Slit - Royal Blue Ink */}
            <path
              d="M2 2L9.5 9.5"
              stroke="#2563EB"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Breather Hole (Blue Inked circle) */}
            <circle
              cx="10.5"
              cy="10.5"
              r="1.6"
              fill="#2563EB"
              stroke="#161412"
              strokeWidth="0.8"
            />

            {/* Pen Handle / Barrel */}
            <path
              d="M12.5 18.5L19 12L22 15L15.5 21.5L12.5 18.5Z"
              fill="#161412"
              stroke="#161412"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Fresh Blue Ink Bead at the absolute tip */}
            <circle
              cx="2.5"
              cy="2.5"
              r="1.4"
              fill="#2563EB"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
