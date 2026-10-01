/**
 * Featured tours section: grid of Tour cards from data, connected to shared filter state in AppContext
 * so users can filter by destination or budget from either the Home Hero or the Tours section.
 */
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { tours } from '../data'
import { useApp } from '../context/AppContext'
import Title from './Title'
import Tour from './Tour'

const directions: Array<'left' | 'right' | 'bottom'> = ['left', 'right', 'bottom', 'left', 'right', 'bottom']

const Tours = () => {
  const {
    selectedLocation,
    setSelectedLocation,
    maxBudget,
    setMaxBudget,
    resetFilters,
  } = useApp()

  const locations = useMemo(() => {
    const unique = Array.from(new Set(tours.map((t) => t.location.toLowerCase())))
    return ['all', ...unique]
  }, [])

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesLocation =
        selectedLocation === 'all' ||
        tour.location.toLowerCase() === selectedLocation.toLowerCase()
      const matchesBudget = tour.cost <= maxBudget
      return matchesLocation && matchesBudget
    })
  }, [selectedLocation, maxBudget])

  const isFiltered = selectedLocation !== 'all' || maxBudget < 5000

  return (
    <motion.section
      id="tours"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      className="py-20 scroll-mt-16"
    >
      <Title title="featured" subTitle="tours" />

      {/* Interactive Filter Controls Bar synced with Home Hero */}
      <div className="w-[90vw] max-w-[1170px] mx-auto mb-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-grey-9">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter tours by destination">
          {locations.map((loc) => {
            const active = selectedLocation === loc
            return (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md capitalize transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-primary-5 text-white shadow-sm'
                    : 'bg-grey-10 text-grey-3 hover:bg-grey-9'
                }`}
              >
                {loc === 'all' ? 'All Regions' : loc}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-grey-4">
          <label htmlFor="tours-budget-filter" className="font-medium whitespace-nowrap">
            Max Price: <span className="text-grey-1 font-semibold tabular-nums">${maxBudget.toLocaleString()}</span>
          </label>
          <input
            id="tours-budget-filter"
            type="range"
            min={1400}
            max={5000}
            step={100}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-28 sm:w-36 accent-primary-5 cursor-pointer"
          />
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-5 hover:text-primary-3 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {filteredTours.length > 0 ? (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.15, delayChildren: 0.1 },
            },
          }}
          className="w-[90vw] max-w-[1170px] mx-auto grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredTours.map((tour, index) => (
            <Tour key={tour.id} {...tour} direction={directions[index % directions.length]} />
          ))}
        </motion.div>
      ) : (
        <div className="w-[90vw] max-w-[1170px] mx-auto text-center py-12 bg-grey-10 rounded-lg border border-grey-9">
          <p className="text-base font-medium text-grey-2 mb-2">
            No tours match your current destination and budget filters.
          </p>
          <p className="text-sm text-grey-5 mb-4">
            Try increasing the maximum rate or selecting all regions.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 bg-primary-5 hover:bg-primary-4 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </motion.section>
  )
}

export default Tours
