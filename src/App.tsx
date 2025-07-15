import { useState } from 'react'
import './App.css'
import PlayerForm from './components/PlayerForm'
import type { PlayerSettings } from './types'

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

  const handleSettingsChange = (settings: PlayerSettings) => {
    setPlayerSettings(settings)
  }

  return (
    
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50'
    }`}>
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/background.png)' }}
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
              {/* Equipment Manager */}
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
