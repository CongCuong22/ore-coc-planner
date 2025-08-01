import { useState, useEffect } from 'react'
import './App.css'
import PlayerForm from './components/PlayerForm'
import OreCalculator from './components/OreCalculator'
import type { PlayerSettings } from './types'
import EquipmentManager from './components/EquipmentManager'

function App() {
  const [isDark, setIsDark] = useState(false)
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({
    league: 'Legend',
    attackTownHall: 16,
    clanWarAttackPerWeek: 7,
    clanWarRatio: 1,
    oresBuyUsingRaidMedals: { shiny: 0, glowy: 0, starry: 0 },
    oresBuyUsingGem: { shiny: 0, glowy: 0, starry: 0 },
    oreTraiderFree: false,
    playerTag: '',
    equimentJson: ''
  })

  // Equipment state
  const [equipmentList, setEquipmentList] = useState([])

  const [weeklyOre, setWeeklyOre] = useState({shiny: 0, glowy: 0, starry: 0})

  useEffect(() => {
    fetch('data/equipment-data.json')
      .then(res => res.json())
      .then((data) => {
        // Map interface Equipment
        const mapped = data.map((eq: any) => ({
          id: eq.id,
          name: eq.name,
          hero: eq.hero,
          rarity: eq.rarity === 'epic' ? 'Epic' : 'Common',
          iconUrl: eq.iconUrl,
          currentLevel: 1,
          targetLevel: eq.maxLevel,
          oreCost: { shiny: 0, glowy: 0, starry: 0 },
          isSelected: true,
          isHidden: false
        }))
        setEquipmentList(mapped)
      })
  }, [])

  const handleSettingsChange = (settings: PlayerSettings) => {
    setPlayerSettings(settings)
  }

  const handleEquipmentChange = (newList: any) => {
    setEquipmentList(newList)
  }

  return (
    
    <div className={isDark ? 'dark bg-slate-900 min-h-screen' : 'bg-slate-50 min-h-screen'}>
      <button
        onClick={() => setIsDark(d => !d)}
        className={`fixed top-4 right-4 z-50 p-2 rounded-full shadow-lg border transition-colors duration-200 focus:outline-none
          ${isDark ? 'bg-slate-800 text-yellow-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-amber-500 border-amber-200 hover:bg-amber-100'}`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
        )}
      </button>
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(images/background.png)' }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <header className={`${
          isDark 
            ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 shadow-amber-900/20' 
            : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-amber-600/20'
        } shadow-2xl`}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">⚔️</div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Hero Equipment Ore Planner
                  </h1>
                  <p className="text-slate-700 mt-1">
                    Calculate your monthly ore and the time needed to upgrade your equipment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Player Form */}
            <div className={`${
              isDark 
                ? 'bg-slate-800/80 border-amber-500/20' 
                : 'bg-white/80 border-amber-400/30'
            } backdrop-blur-md rounded-xl border shadow-2xl`}>
              <div className={`${
                isDark ? 'bg-amber-600/20 text-amber-100' : 'bg-amber-500/20 text-amber-900'
              } px-6 py-4 rounded-t-xl border-b border-amber-500/20`}>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>👤</span> Player Information
                </h2>
              </div>
              <div className="p-6">
                {/* Player Form */}
                <PlayerForm 
                  settings={playerSettings}
                  onSettingsChange={handleSettingsChange}
                  isDark = {isDark}
                />
              </div>
            </div>

            {/* Right Panel - Ore Calculator */}
            <div className={`${
              isDark 
                ? 'bg-slate-800/80 border-amber-500/20' 
                : 'bg-white/80 border-amber-400/30'
            } backdrop-blur-md rounded-xl border shadow-2xl`}>
              <div className={`${
                isDark ? 'bg-amber-600/20 text-amber-100' : 'bg-amber-500/20 text-amber-900'
              } px-6 py-4 rounded-t-xl border-b border-amber-500/20`}>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>💎</span> Total Monthly Ore
                </h2>
              </div>
              <div className="p-6">
                {/* Ore Calculator */}
                <OreCalculator
                  settings={playerSettings}
                  isDark={isDark}
                  onWeeklyOreChange={setWeeklyOre}
                />
              </div>
            </div>
          </div>

          {/* Equipment Manager */}
          <div className={`${
            isDark 
              ? 'bg-slate-800/80 border-amber-500/20' 
              : 'bg-white/80 border-amber-400/30'
          } backdrop-blur-md rounded-xl border shadow-2xl mt-8`}>
            <div className={`${
              isDark ? 'bg-amber-600/20 text-amber-100' : 'bg-amber-500/20 text-amber-900'
            } px-6 py-4 rounded-t-xl border-b border-amber-500/20`}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>⚔️</span> Equipment Manager
              </h2>
            </div>
            <div className="p-6">
              <EquipmentManager
                equipment={equipmentList}
                onEquipmentChange={handleEquipmentChange}
                isDark={isDark}
                weeklyOre={weeklyOre}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={`${
          isDark ? 'bg-slate-900/80 text-slate-300' : 'bg-slate-100/80 text-slate-600'
        } backdrop-blur-md mt-16`}>
          <div className="container mx-auto px-4 py-6 text-center">
            <p>© 2025 Clash of Clans Hero Equipment Ore Planner - Created by Cong Cuong</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
