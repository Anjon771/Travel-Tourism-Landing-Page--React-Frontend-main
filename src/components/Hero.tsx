/**
 * Hero section (#home): editorial travel showcase with dynamic backdrop photography,
 * streaming typewriter headline, interactive Quick Tour Finder (synced with Tours via AppContext),
 * and an interactive Expedition Spotlight switcher.
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Compass, MapPin, RotateCcw } from 'lucide-react'
import { useCyclingStreamingWords } from '../hooks/useCyclingStreamingWords'
import { tours } from '../data'
import { useApp } from '../context/AppContext'

const HERO_KEYWORDS = [
  'Explore',
  'Get Lost',
  'Wander',
  'Adventure',
  'Unwind',
  'Roam',
  'Discover',
]

const BUDGET_OPTIONS = [
  { label: 'Any Budget (Up to $5,000)', value: 5000 },
  { label: 'Up to $3,500', value: 3500 },
  { label: 'Up to $2,500', value: 2500 },
  { label: 'Up to $2,000', value: 2000 },
]

const Hero = () => {
  const { text: streamingWord, phase } = useCyclingStreamingWords(HERO_KEYWORDS)
  const showCursor = phase === 'in' || phase === 'out'

  const {
    selectedLocation,
    setSelectedLocation,
    maxBudget,
    setMaxBudget,
    resetFilters,
  } = useApp()

  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [heroImgError, setHeroImgError] = useState(false)
  const [cardImgError, setCardImgError] = useState<Record<number, boolean>>({})

  const activeTour = tours[spotlightIndex] ?? tours[0]

  const locations = useMemo(() => {
    const unique = Array.from(new Set(tours.map((t) => t.location.toLowerCase())))
    return ['all', ...unique]
  }, [])

  const matchingToursCount = useMemo(() => {
    return tours.filter((t) => {
      const locMatch =
        selectedLocation === 'all' || t.location.toLowerCase() === selectedLocation.toLowerCase()
      const budgetMatch = t.cost <= maxBudget
      return locMatch && budgetMatch
    }).length
  }, [selectedLocation, maxBudget])

  const handlePrevSpotlight = () => {
    setSpotlightIndex((prev) => (prev - 1 + tours.length) % tours.length)
  }

  const handleNextSpotlight = () => {
    setSpotlightIndex((prev) => (prev + 1) % tours.length)
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSelectSpotlightTour = (location: string) => {
    setSelectedLocation(location.toLowerCase())
    setMaxBudget(5000)
    scrollToSection('tours')
  }

  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 pb-16 md:pt-28 md:pb-24 flex items-center overflow-hidden bg-grey-1"
    >
      {/* Resilient Full-Bleed Background Media with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        {!heroImgError ? (
          <img
            src="/images/main.jpeg"
            alt="Panoramic mountain coastal landscape for Backroads expeditions"
            referrerPolicy="no-referrer"
            onError={() => setHeroImgError(true)}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-grey-1 via-primary-1 to-grey-2" />
        )}
        {/* Multi-stop directional scrim ensuring >= 4.5:1 WCAG AA contrast across all viewports */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-grey-1/95 via-grey-1/85 to-grey-1/60"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-grey-1 via-transparent to-grey-1/50"
          aria-hidden="true"
        />
      </div>

      {/* Main 12-Column Container */}
      <div className="relative z-10 w-[90vw] max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left 7 Columns: Editorial Proposition, Streaming Headline, Interactive Quick Finder */}
          <div className="lg:col-span-7 text-left text-white">
            {/* Quiet Unboxed Editorial Metadata Kicker */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium tracking-wider text-primary-8 mb-4"
            >
              <span>Handcrafted Small-Group Expeditions</span>
              <span aria-hidden="true">·</span>
              <span>6 Iconic Regions</span>
              <span aria-hidden="true">·</span>
              <span>Expert Local Guides</span>
            </motion.div>

            {/* Primary Display Headline with Streaming Typewriter Hook */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight leading-[1.1] text-white mb-6 [text-wrap:balance]"
            >
              Venture Beyond the Familiar — Let’s{' '}
              <span className="inline-block min-w-[9ch] text-left align-baseline text-primary-7">
                <span className="inline align-baseline">{streamingWord}</span>
                {showCursor && (
                  <span
                    className="inline-block w-0.5 h-[0.9em] ml-1 bg-primary-7 align-baseline animate-pulse"
                    aria-hidden="true"
                  />
                )}
              </span>
            </motion.h1>

            {/* Value Proposition Body Prose */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="text-base md:text-lg text-grey-9/90 leading-relaxed max-w-[58ch] mb-8 font-normal"
            >
              Experience authentic overland journeys curated by local naturalists and historians.
              From Himalayan monastery trails to East African wildlife reserves, every itinerary
              includes boutique stays, guided treks, and transparent pricing.
            </motion.p>

            {/* Interactive Expedition Quick Finder Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 sm:p-5 mb-8"
            >
              <div className="flex items-center justify-between gap-2 mb-3 text-xs text-grey-8">
                <span className="font-medium text-white">Filter Handcrafted Departures</span>
                <span className="tabular-nums text-primary-8">
                  {matchingToursCount} of {tours.length} routes match
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                {/* Destination Filter */}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="hero-destination-select"
                    className="block text-xs text-grey-8 mb-1.5"
                  >
                    Destination
                  </label>
                  <select
                    id="hero-destination-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-grey-1/85 border border-white/20 text-white text-sm capitalize focus:outline-none focus:border-primary-6 transition-colors cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc} className="bg-grey-1 text-white capitalize">
                        {loc === 'all' ? 'All Destinations' : loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Max Budget Filter */}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="hero-budget-select"
                    className="block text-xs text-grey-8 mb-1.5"
                  >
                    Maximum Rate
                  </label>
                  <select
                    id="hero-budget-select"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-lg bg-grey-1/85 border border-white/20 text-white text-sm focus:outline-none focus:border-primary-6 transition-colors cursor-pointer tabular-nums"
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-grey-1 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Search / Jump Action */}
                <div className="sm:col-span-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('tours')}
                    className="flex-1 h-11 px-4 bg-primary-5 hover:bg-primary-6 text-white font-semibold text-sm rounded-lg transition-colors duration-150 inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    <span>Explore {matchingToursCount} Tours</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                  {(selectedLocation !== 'all' || maxBudget < 5000) && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      title="Reset filters"
                      aria-label="Reset tour filters"
                      className="h-11 px-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quantitative Rigor Proof Strip (Tabular Numerals, Unboxed) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.45 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/15"
            >
              <div>
                <p className="text-2xl font-bold text-white tabular-nums m-0">6–20 Days</p>
                <p className="text-xs text-grey-8 mt-1 mb-0">Flexible Route Durations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tabular-nums m-0">From $1,400</p>
                <p className="text-xs text-grey-8 mt-1 mb-0">All-Inclusive Packages</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tabular-nums m-0">Max 12</p>
                <p className="text-xs text-grey-8 mt-1 mb-0">Travelers Per Group</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tabular-nums m-0">100% Local</p>
                <p className="text-xs text-grey-8 mt-1 mb-0">Certified Trail Guides</p>
              </div>
            </motion.div>
          </div>

          {/* Right 5 Columns: Interactive Featured Expedition Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="lg:col-span-5"
          >
            <div className="bg-grey-1/85 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden shadow-dark">
              {/* Top Header Bar of Spotlight Panel */}
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-grey-8">
                  <Compass className="w-4 h-4 text-primary-7 shrink-0" aria-hidden="true" />
                  <span className="font-medium text-white">Featured Route Spotlight</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums text-primary-8">
                    0{spotlightIndex + 1} / 0{tours.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevSpotlight}
                    aria-label="Previous featured tour"
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center transition-colors duration-150 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSpotlight}
                    aria-label="Next featured tour"
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center transition-colors duration-150 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Animated Tour Spotlight Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTour.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Visual Media Slot with Resilient Fallback */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-grey-2">
                    {!cardImgError[activeTour.id] ? (
                      <img
                        src={activeTour.image}
                        alt={activeTour.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setCardImgError((prev) => ({ ...prev, [activeTour.id]: true }))
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-2 to-grey-1 flex items-center justify-center p-6 text-center">
                        <span className="text-white font-semibold capitalize">
                          {activeTour.title}
                        </span>
                      </div>
                    )}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-grey-1/90 via-grey-1/20 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between gap-2">
                      <div>
                        {activeTour.slogan && (
                          <p className="text-xs text-primary-8 font-medium mb-0.5">
                            {activeTour.slogan}
                          </p>
                        )}
                        <h2 className="text-xl font-bold text-white capitalize m-0 tracking-tight">
                          {activeTour.title}
                        </h2>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-grey-8 block">Starting from</span>
                        <span className="text-lg font-bold text-primary-7 tabular-nums">
                          ${activeTour.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-grey-7 mb-3">
                      <span className="inline-flex items-center gap-1 text-primary-8 capitalize font-medium">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        {activeTour.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{activeTour.duration} days</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">Departs {activeTour.date}</span>
                    </div>

                    <p className="text-sm text-grey-8 leading-relaxed mb-5 line-clamp-2">
                      {activeTour.info}
                    </p>

                    {/* Interactive Route Selector Tabs + Action */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <div
                        className="flex items-center gap-1"
                        role="tablist"
                        aria-label="Select featured route"
                      >
                        {tours.map((tour, idx) => {
                          const isSelected = idx === spotlightIndex
                          return (
                            <button
                              key={tour.id}
                              type="button"
                              role="tab"
                              aria-selected={isSelected}
                              aria-label={`Preview ${tour.title}`}
                              onClick={() => setSpotlightIndex(idx)}
                              className={`px-2 py-1 text-xs font-medium rounded transition-colors duration-150 tabular-nums cursor-pointer ${
                                isSelected
                                  ? 'bg-primary-5 text-white'
                                  : 'text-grey-7 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              0{idx + 1}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectSpotlightTour(activeTour.location)}
                        className="text-xs font-semibold text-primary-7 hover:text-primary-8 inline-flex items-center gap-1 transition-colors duration-150 whitespace-nowrap cursor-pointer"
                      >
                        <span>View in Tours</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
