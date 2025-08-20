"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, Wine, MapPin, Clock, Phone, Instagram, Star, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function IkiAndGaiLanding() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const handleVideoLoad = () => {
    setVideoLoaded(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.preload = "auto"
      // Ensure video is paused and ready for scrubbing
      videoRef.current.pause()
    }
  }

  useEffect(() => {
    if (!videoLoaded || !videoRef.current || !containerRef.current) return

    const video = videoRef.current
    const container = containerRef.current

    // Set initial states - make video more visible
    gsap.set(video, { 
      scale: 1.02, 
      opacity: 0.7,
      filter: "brightness(1.1) contrast(1.1) saturate(1.1)"
    })

    // Main video scrubbing timeline with improved bidirectional control
    const videoTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3, // Reduced for more responsive scrubbing
        onUpdate: (self) => {
          if (video.duration && video.readyState >= 2) { // Ensure video is ready
            const progress = gsap.utils.mapRange(0.05, 0.95, 0, 1, self.progress) // Start earlier
            const clampedProgress = gsap.utils.clamp(0, 1, progress)
            const targetTime = clampedProgress * video.duration
            
            // Direct assignment for immediate response in both directions
            video.currentTime = targetTime
            
            // Ensure video is paused (we're controlling it manually)
            if (!video.paused) {
              video.pause()
            }
          }
        },
        onRefresh: () => {
          // Reset video to beginning when ScrollTrigger refreshes
          if (video.duration) {
            video.currentTime = 0
          }
        }
      },
    })

    // Video visual effects timeline - enhanced visibility
    const videoEffectsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    })

    videoEffectsTimeline
      .to(video, {
        scale: 1,
        opacity: 0.9,
        filter: "brightness(1.2) contrast(1.05) saturate(1.15)",
        duration: 0.2,
        ease: "power2.out",
      })
      .to(video, {
        scale: 1,
        opacity: 0.9,
        filter: "brightness(1.2) contrast(1.05) saturate(1.15)",
        duration: 0.6,
        ease: "none",
      })
      .to(video, {
        scale: 1.02,
        opacity: 0.7,
        filter: "brightness(1.1) contrast(1.1) saturate(1.1)",
        duration: 0.2,
        ease: "power2.in",
      })

    const heroTl = gsap.timeline({ delay: 0.3 }) // Start earlier
    heroTl
      .fromTo(
        ".hero-content",
        { opacity: 0, y: 30, scale: 0.98 }, // Reduced movement
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
      )
      .to(
        ".scroll-arrow",
        {
          y: 8,
          duration: 1.8,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        },
        "-=0.6",
      )

    // Enhanced section animations with earlier start
    const sections = [
      { element: ".story-section", start: 15, peak: 25, end: 35 }, // Start earlier
      { element: ".experience-section", start: 30, peak: 40, end: 50 },
      { element: ".atmosphere-section", start: 45, peak: 55, end: 65 },
      { element: ".visit-section", start: 70, peak: 80, end: 90 },
    ]

    sections.forEach((section) => {
      const element = document.querySelector(section.element)
      if (!element) return

      // Set initial state
      gsap.set(element, { opacity: 0, y: 60, scale: 0.95 }) // Reduced movement

      // Fade in animation
      gsap.to(element, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: `${section.start}% center`,
          end: `${section.peak}% center`,
          scrub: 1.2, // Faster scrubbing
        },
      })

      // Hold visibility
      gsap.to(element, {
        opacity: 1,
        scrollTrigger: {
          trigger: container,
          start: `${section.peak}% center`,
          end: `${section.end - 3}% center`,
          scrub: false,
        },
      })

      // Fade out animation
      gsap.to(element, {
        opacity: 0,
        y: -40,
        scale: 1.02,
        ease: "power2.in",
        scrollTrigger: {
          trigger: container,
          start: `${section.end - 3}% center`,
          end: `${section.end}% center`,
          scrub: 1.2,
        },
      })
    })

    // Staggered animation for experience icons
    gsap.fromTo(
      ".experience-icon",
      { opacity: 0, scale: 0.9, rotation: -5 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".experience-section",
          start: "top 85%", // Start earlier
          end: "bottom 15%",
          scrub: 1,
        },
      }
    )

    // Floating animation for elements
    gsap.to(".floating-element", {
      y: -15,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.4,
    })

    // Performance optimizations
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 150,
    })

    // Additional video event listeners for better control
    const handleVideoCanPlayInEffect = () => {
      video.pause() // Ensure video starts paused
    }

    const handleVideoSeeked = () => {
      // Ensure video stays paused after seeking
      if (!video.paused) {
        video.pause()
      }
    }

    video.addEventListener('canplay', handleVideoCanPlayInEffect)
    video.addEventListener('seeked', handleVideoSeeked)

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      videoTimeline.kill()
      videoEffectsTimeline.kill()
      heroTl.kill()
      
      // Remove event listeners
      video.removeEventListener('canplay', handleVideoCanPlayInEffect)
      video.removeEventListener('seeked', handleVideoSeeked)
    }
  }, [videoLoaded])

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-x-hidden" style={{ height: "600vh" }}>
      {/* Fixed Header with Logo and Instagram - Mobile Responsive */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 sm:p-6 pointer-events-none">
        {/* Logo */}
        <div className="pointer-events-auto">
          <Image
            src="/logo.png"
            alt="Iki & Gai Logo"
            width={120}
            height={60}
            className="h-8 w-auto sm:h-12 object-contain"
            priority
          />
        </div>
        
        {/* Instagram Icon */}
        <div className="pointer-events-auto">
          <a
            href="https://www.instagram.com/ikiandgaibar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors duration-300"
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 will-change-transform">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          preload="auto"
          playsInline
          onLoadedData={handleVideoLoad}
          style={{
            willChange: "transform, filter, opacity",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          <source src="/output.mp4" type="video/mp4" />
        </video>
        {/* Enhanced dark overlay for sophisticated bar atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Hero Section - Mobile Responsive */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          <div className="hero-content text-center max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] font-extralight tracking-tight mb-8 sm:mb-12 leading-none">
              <span
                className="block text-white drop-shadow-2xl"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  textShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
                  filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.9))",
                  letterSpacing: "-0.02em",
                }}
              >
                IKI & GAI
              </span>
            </h1>

            <div className="hero-subtitle">
              <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-4 sm:mb-6 font-light tracking-[0.2em] sm:tracking-[0.3em] drop-shadow-lg uppercase" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Premium Bar
              </p>
              <p className="text-sm sm:text-lg md:text-xl text-gray-400 mb-12 sm:mb-16 lg:mb-20 font-light leading-relaxed max-w-xs sm:max-w-2xl mx-auto drop-shadow-md px-4 sm:px-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                An intimate sanctuary for connoisseurs and those who appreciate the art of mixology
              </p>
            </div>

            <div className="flex flex-col items-center gap-8 sm:gap-12">
              <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] font-light drop-shadow-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Discover Our Story
              </p>
              <div className="scroll-arrow">
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 drop-shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Story Section - Mobile Responsive */}
        <section className="story-section min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center glass-morphism rounded-none p-8 sm:p-12 md:p-16 lg:p-20 border-l border-r border-white/10">
            <div className="floating-element">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white mx-auto mb-8 sm:mb-12 drop-shadow-lg" />
            </div>
            <h2
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight mb-8 sm:mb-12 md:mb-16 leading-tight text-white drop-shadow-xl"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: "-0.02em" }}
            >
              Crafted Excellence
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto font-light drop-shadow-lg px-4 sm:px-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Every cocktail tells a story. Every sip holds a moment. We craft exceptional drinks with precision and passion, 
              creating experiences that linger long after the last drop.
            </p>
          </div>
        </section>

        {/* Experience Section - Mobile Responsive */}
        <section className="experience-section min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center glass-morphism rounded-none p-8 sm:p-12 md:p-16 lg:p-20 border-t border-b border-white/10">
            <h2
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight mb-12 sm:mb-16 md:mb-20 leading-tight text-white drop-shadow-xl"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: "-0.02em" }}
            >
              The Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 mt-12 sm:mt-16 md:mt-20">
              <div className="text-center">
                <div className="experience-icon w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-light mb-4 sm:mb-6 text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Artisanal Cocktails
                </h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light px-4 sm:px-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Discover handcrafted cocktails using premium spirits and innovative techniques
                </p>
              </div>

              <div className="text-center">
                <div className="experience-icon w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-light mb-4 sm:mb-6 text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Expert Mixology
                </h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light px-4 sm:px-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Our master mixologist Sarthak guides you through perfect pairings and new discoveries
                </p>
              </div>

              <div className="text-center">
                <div className="experience-icon w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-light mb-4 sm:mb-6 text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Intimate Setting
                </h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light px-4 sm:px-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  A sophisticated atmosphere designed for conversation and contemplation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Atmosphere Section - Mobile Responsive */}
        <section className="atmosphere-section min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center glass-morphism rounded-none p-8 sm:p-12 md:p-16 lg:p-20 mx-4 sm:mx-0 max-w-4xl border-l border-r border-white/10">
            <h3
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight mb-8 sm:mb-12 md:mb-16 text-white drop-shadow-xl"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: "-0.02em" }}
            >
              Atmosphere
            </h3>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl mb-12 sm:mb-16 leading-relaxed font-light drop-shadow-lg px-4 sm:px-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Dimly lit. Quietly sophisticated. Where conversations flow as smoothly as our finest pours.
            </p>
            <div className="w-16 sm:w-20 md:w-24 h-px bg-white/30 mx-auto"></div>
          </div>
        </section>

        {/* Visit Section - Mobile Responsive */}
        <section className="visit-section min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center glass-morphism rounded-none p-8 sm:p-12 md:p-16 lg:p-20 border border-white/10">
            <h2
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight mb-8 sm:mb-12 md:mb-16 leading-tight text-white drop-shadow-xl"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: "-0.02em" }}
            >
              Visit Us
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 sm:mb-16 md:mb-20 leading-relaxed max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto font-light drop-shadow-lg px-4 sm:px-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Reserve your table for an evening of exceptional cocktails and refined company.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center mb-12 sm:mb-16">
              <Button
                size="lg"
                className="premium-button bg-white text-black hover:bg-gray-100 text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-none font-light transition-all duration-700 hover:scale-105 uppercase tracking-wider w-full sm:w-auto"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Reserve Table
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="premium-button border-white/40 bg-transparent text-white hover:bg-white/10 text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-none font-light transition-all duration-700 hover:scale-105 uppercase tracking-wider w-full sm:w-auto"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Cocktail Menu
              </Button>
            </div>

            {/* Contact Info - Mobile Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-gray-400 font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-lg text-center">Ground Floor, Sangam Courtyard</span>
              </div>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-lg">+91 98765 43210</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Mobile Responsive */}
        <footer className="relative z-20 glass-morphism border-t border-white/10 py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 md:mt-32">
          <div className="max-w-5xl mx-auto text-center">
            <h3
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight mb-8 sm:mb-12 text-white drop-shadow-lg"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: "-0.02em" }}
            >
              IKI & GAI
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 mb-12 sm:mb-16 md:mb-20">
              <div>
                <h4 className="text-lg sm:text-xl font-light mb-6 sm:mb-8 text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Hours
                </h4>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400 font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <p>Tuesday - Thursday: 6pm - 1am</p>
                  <p>Friday - Saturday: 6pm - 2am</p>
                  <p>Sunday: 5pm - 12am</p>
                  <p className="text-white">Closed Mondays</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-light mb-6 sm:mb-8 text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Services
                </h4>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400 font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <p>Signature Cocktails</p>
                  <p>Private Events</p>
                  <p>Corporate Gatherings</p>
                  <p>Mixology Classes</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-light mb-6 sm:mb-8 text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Contact
                </h4>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400 font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <p>hello@ikiandgai.com</p>
                  <p>+91 98765 43210</p>
                  <p>Ground Floor, Sangam Courtyard</p>
                  <p>Unit No. G8, G10, Major Somnath Marg</p>
                  <p>KD Colony, Sector 9, R.K. Puram</p>
                  <p>New Delhi, Delhi 110022</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 sm:pt-12">
              <p className="text-xs sm:text-sm text-gray-500 font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>© 2025 Iki & Gai Bar. Owned by Sarthak.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
