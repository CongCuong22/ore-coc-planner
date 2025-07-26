import { useState, useEffect } from 'react'
import type { Equipment } from '../types'

const HEROES = [
  "Barbarian King",
  "Archer Queen",
  "Grand Warden",
  "Royal Champion",
  "Minion Prince"
];



interface EquipmentManagerProps {
  equipment: Equipment[]
  onEquipmentChange: (equipment: Equipment[]) => void
  isDark: boolean;
  weeklyOre: {shiny: number; glowy: number; starry: number};
}

function EquipmentManager({ equipment, onEquipmentChange, isDark, weeklyOre }: EquipmentManagerProps) {
  const [showHidden, setShowHidden] = useState(false)
  const [selectedHeroes, setSelectedHeroes] = useState<string[]>(HEROES)
  const [upgradeCosts, setUpgradeCosts] = useState<any>({})

  const [collapsedHeroes, setCollapsedHeroes] = useState<string[]>([])

  useEffect(() => {
    fetch('/data/upgrade-cost.json')
      .then(res => res.json())
      .then(setUpgradeCosts)
  }, [])

  // Filter equipment of hero hide/show
  const filteredEquipment = equipment.filter(eq =>
    selectedHeroes.includes(eq.hero) && (showHidden || !eq.isHidden)
  )

  // Calculator
  const calculateOreCost = (eq: Equipment) => {
    if (!upgradeCosts.common || !upgradeCosts.epic) return { shiny: 0, glowy: 0, starry: 0 }
    const costs = eq.rarity === 'Common' ? upgradeCosts.common : upgradeCosts.epic
    let totalShiny = 0, totalGlowy = 0, totalStarry = 0
    for (let level = eq.currentLevel; level < eq.targetLevel; level++) {
      const cost = costs[level] || {}
      totalShiny += cost.shiny || 0
      totalGlowy += cost.glowy || 0
      totalStarry += cost.starry || 0
    }
    return { shiny: totalShiny, glowy: totalGlowy, starry: totalStarry }
  }

  const estimateTime = (cost: { shiny: number, glowy: number, starry: number }) => {
    const shinyWeeks = weeklyOre.shiny > 0 ? cost.shiny / weeklyOre.shiny : 0;
    const glowyWeeks = weeklyOre.glowy > 0 ? cost.glowy / weeklyOre.glowy : 0;
    const starryWeeks = weeklyOre.starry > 0 ? cost.starry / weeklyOre.starry : 0;
    const maxWeeks = Math.max(shinyWeeks, glowyWeeks, starryWeeks);
    if (maxWeeks > 0) {
      const rounded = Math.ceil(maxWeeks);
      return `≈${rounded} weeks`;
    } else {
      return '-';
    }
  }

  const selectedCount = equipment.filter(eq => eq.isSelected && (showHidden || !eq.isHidden) && selectedHeroes.includes(eq.hero)).length

  // UI
  return (
    <div className="space-y-6">
      {/* Hero filter */}
      <div className="flex flex-wrap gap-3">
        {HEROES.map(hero => (
          <label key={hero} className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded-md font-medium transition-colors border select-none
            ${selectedHeroes.includes(hero)
              ? isDark
                ? 'bg-amber-600/80 text-white border-amber-500 shadow-sm hover:bg-amber-500'
                : 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm hover:bg-amber-200'
              : isDark
                ? 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}
          `}>
            <input
              type="checkbox"
              checked={selectedHeroes.includes(hero)}
              onChange={e => {
                setSelectedHeroes(val =>
                  e.target.checked
                    ? [...val, hero]
                    : val.filter(h => h !== hero)
                )
              }}
              className="accent-amber-500 w-4 h-4 focus:ring-amber-400"
            />
            <span>{hero}</span>
          </label>
        ))}
      </div>

      {/* Controls + badge */}
      <div className="flex flex-wrap gap-4 items-center mt-2">
        <button
          onClick={() => onEquipmentChange(equipment.map(eq => ({ ...eq, isSelected: true })))}
          className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400
            ${isDark
              ? 'bg-slate-700 text-amber-200 border-slate-600 hover:bg-amber-700 hover:text-white'
              : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'}
          `}
        >
          Select All
        </button>
        <button
          onClick={() => onEquipmentChange(equipment.map(eq => ({ ...eq, isSelected: false })))}
          className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400
            ${isDark
              ? 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}
          `}
        >
          Deselect All
        </button>
        <button
          onClick={() => setShowHidden(v => !v)}
          className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400
            ${isDark
              ? 'bg-slate-700 text-green-200 border-slate-600 hover:bg-green-700 hover:text-white'
              : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'}
          `}
        >
          {showHidden ? 'Hide Hidden Equipment' : `Show Hidden Equipment (${equipment.filter(eq => eq.isHidden).length})`}
        </button>
        <span className="ml-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
          Selected: {selectedCount}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow bg-white dark:bg-slate-800 dark:border-slate-700">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700">
            <tr>
              <th className="py-3 px-2 text-center font-bold text-slate-700 dark:text-slate-100 border-b border-amber-200 dark:border-slate-600">☑️</th>
              <th className="py-3 px-2 text-left font-bold text-slate-700 dark:text-slate-100 border-b border-amber-200 dark:border-slate-600">Equipment</th>
              <th className="py-3 px-2 text-center font-bold text-slate-700 dark:text-slate-100 border-b border-amber-200 dark:border-slate-600">Rarity</th>
              <th className="py-3 px-2 text-center font-bold text-slate-700 dark:text-slate-100 border-b border-amber-200 dark:border-slate-600">Required Ore</th>
              <th className="py-3 px-2 text-center font-bold text-slate-700 dark:text-slate-100 border-b border-amber-200 dark:border-slate-600">Estimate</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              // Group by hero
              const grouped: { [hero: string]: typeof filteredEquipment } = {};
              filteredEquipment.forEach(eq => {
                if (!grouped[eq.hero]) grouped[eq.hero] = [];
                grouped[eq.hero].push(eq);
              });
              const rows = [];
              for (const hero of Object.keys(grouped)) {
                const isCollapsed = collapsedHeroes.includes(hero);
                // Calc for selected equipment
                const heroEquip = grouped[hero].filter(eq => !eq.isHidden);
                // Separate Epic and Common
                const epicEquip = heroEquip.filter(eq => eq.rarity === 'Epic');
                const commonEquip = heroEquip.filter(eq => eq.rarity === 'Common');
                // Calculate total ore for each
                let epicCost = { shiny: 0, glowy: 0, starry: 0 };
                let commonCost = { shiny: 0, glowy: 0, starry: 0 };
                epicEquip.forEach(eq => {
                  const cost = calculateOreCost(eq);
                  epicCost.shiny += cost.shiny;
                  epicCost.glowy += cost.glowy;
                  epicCost.starry += cost.starry;
                });
                commonEquip.forEach(eq => {
                  const cost = calculateOreCost(eq);
                  commonCost.shiny += cost.shiny;
                  commonCost.glowy += cost.glowy;
                  commonCost.starry += cost.starry;
                });
                // Estimate time for Epic first (starry is bottleneck)
                let epicWeeks = 0;
                let epicPossible = true;
                if (epicEquip.length > 0) {
                  if (weeklyOre.starry > 0) {
                    const shinyWeeks = weeklyOre.shiny > 0 ? epicCost.shiny / weeklyOre.shiny : 0;
                    const glowyWeeks = weeklyOre.glowy > 0 ? epicCost.glowy / weeklyOre.glowy : 0;
                    const starryWeeks = epicCost.starry / weeklyOre.starry;
                    epicWeeks = Math.max(shinyWeeks, glowyWeeks, starryWeeks);
                  } else {
                    epicPossible = false;
                  }
                }
                // After Epic, calculate remaining weekly ore for Common
                let commonWeeks = 0;
                if (commonEquip.length > 0) {
                  let remainShiny = weeklyOre.shiny;
                  let remainGlowy = weeklyOre.glowy;
                  let remainStarry = weeklyOre.starry;
                  if (epicEquip.length > 0 && epicPossible) {
                    // Subtract epic ore usage per week (proportionally)
                    // Calculate per-week usage for each ore type
                    const epicTotalWeeks = epicWeeks > 0 ? epicWeeks : 1;
                    const usedShinyPerWeek = epicCost.shiny / epicTotalWeeks;
                    const usedGlowyPerWeek = epicCost.glowy / epicTotalWeeks;
                    const usedStarryPerWeek = epicCost.starry / epicTotalWeeks;
                    remainShiny = Math.max(weeklyOre.shiny - usedShinyPerWeek, 0);
                    remainGlowy = Math.max(weeklyOre.glowy - usedGlowyPerWeek, 0);
                    remainStarry = Math.max(weeklyOre.starry - usedStarryPerWeek, 0);
                  }
                  // If no ore left, cannot upgrade Common
                  if (remainShiny === 0 && remainGlowy === 0 && remainStarry === 0) {
                    commonWeeks = 0;
                  } else {
                    const shinyWeeks = remainShiny > 0 ? commonCost.shiny / remainShiny : 0;
                    const glowyWeeks = remainGlowy > 0 ? commonCost.glowy / remainGlowy : 0;
                    // Starry is usually 0 for Common, but keep for completeness
                    const starryWeeks = remainStarry > 0 ? commonCost.starry / remainStarry : 0;
                    commonWeeks = Math.max(shinyWeeks, glowyWeeks, starryWeeks);
                  }
                }
                // Total estimate
                let heroEstimate = '-';
                if (epicEquip.length > 0) {
                  if (!epicPossible) {
                    heroEstimate = '-';
                  } else {
                    const totalWeeks = epicWeeks + commonWeeks;
                    if (totalWeeks > 0) {
                      heroEstimate = `≈${Math.ceil(totalWeeks)} weeks`;
                    } else {
                      heroEstimate = '-';
                    }
                  }
                } else if (commonEquip.length > 0) {
                  // Only Common
                  const shinyWeeks = weeklyOre.shiny > 0 ? commonCost.shiny / weeklyOre.shiny : 0;
                  const glowyWeeks = weeklyOre.glowy > 0 ? commonCost.glowy / weeklyOre.glowy : 0;
                  const starryWeeks = weeklyOre.starry > 0 ? commonCost.starry / weeklyOre.starry : 0;
                  const maxWeeks = Math.max(shinyWeeks, glowyWeeks, starryWeeks);
                  if (maxWeeks > 0) {
                    heroEstimate = `≈${Math.ceil(maxWeeks)}w`;
                  } else {
                    heroEstimate = '-';
                  }
                }
                // Calculate total ore for display
                let totalShiny = epicCost.shiny + commonCost.shiny;
                let totalGlowy = epicCost.glowy + commonCost.glowy;
                let totalStarry = epicCost.starry + commonCost.starry;
                rows.push(
                  <tr key={hero + '-group'}>
                    <td colSpan={5} className="bg-amber-100 dark:bg-slate-700 text-lg font-bold text-slate-700 dark:text-slate-100 py-2 px-4 border-b border-amber-200 dark:border-slate-600 cursor-pointer select-none" onClick={() => {
                      setCollapsedHeroes(prev => prev.includes(hero) ? prev.filter(h => h !== hero) : [...prev, hero]);
                    }}>
                      <span className="inline-block mr-2 align-middle">{isCollapsed ? '►' : '▼'}</span>{hero}
                      <span className="ml-4 text-base font-normal">
                        {totalShiny > 0 && <span className="text-amber-500 font-semibold mr-2"><img src="/images/shiny.png" alt="shiny" className="w-4 h-4 inline-block" /> {totalShiny}</span>}
                        {totalGlowy > 0 && <span className="text-blue-500 font-semibold mr-2"><img src="/images/glowy.png" alt="glowy" className="w-4 h-4 inline-block" /> {totalGlowy}</span>}
                        {totalStarry > 0 && <span className="text-purple-500 font-semibold mr-2"><img src="/images/starry.png" alt="starry" className="w-4 h-4 inline-block" /> {totalStarry}</span>}
                        <span className="text-green-700 dark:text-green-300 ml-2">Estimate: {heroEstimate}</span>
                      </span>
                    </td>
                  </tr>
                );
                if (!isCollapsed) {
                  rows.push(...grouped[hero].map(eq => {
                    const cost = calculateOreCost(eq)
                    const maxLevel = eq.rarity === 'Common' ? 18 : 27;
                    const progressArr = [];
                    for (let i = 1; i <= maxLevel; i++) {
                      if (i === eq.currentLevel) progressArr.push('o');
                      else if (i === eq.targetLevel) progressArr.push('0');
                      else if (i > eq.currentLevel && i < eq.targetLevel) progressArr.push('-');
                      else progressArr.push('.');
                    }
                    return (
                      <tr
                        key={eq.id}
                        className={`transition-all duration-200 border-b border-slate-100 dark:border-slate-700 ${eq.isHidden ? 'opacity-50' : ''} ${eq.isSelected ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-white dark:bg-slate-800'} hover:bg-amber-100/60 dark:hover:bg-slate-700 animate-fadeIn`}
                      >
                        <td className="text-center align-middle py-3">
                          <div className="flex flex-row gap-2 items-center justify-center">
                            <input
                              type="checkbox"
                              checked={eq.isSelected && !eq.isHidden}
                              onChange={e => onEquipmentChange(equipment.map(item =>
                                item.id === eq.id
                                  ? {
                                      ...item,
                                      isSelected: e.target.checked,
                                      isHidden: !e.target.checked
                                    }
                                  : item
                              ))}
                              className="w-5 h-5 accent-amber-500 rounded focus:ring-amber-400"
                            />
                            <button
                              onClick={() => onEquipmentChange(equipment.map(item =>
                                item.id === eq.id
                                  ? {
                                      ...item,
                                      isHidden: !item.isHidden,
                                      isSelected: item.isHidden ? false : item.isSelected // Unselect khi ẩn
                                    }
                                  : item
                              ))}
                              className={`p-1 rounded transition-colors ${
                                eq.isHidden 
                                  ? 'text-slate-400 hover:text-slate-600' 
                                  : 'text-slate-600 hover:text-slate-800'
                              }`}
                              title={eq.isHidden ? 'Show Equipment' : 'Hide Equipment'}
                            >
                              {eq.isHidden ? '👁️‍🗨️' : '🙈'}
                            </button>
                          </div>
                        </td>
                        <td className="align-middle min-w-[220px] py-3">
                          <div className="flex flex-row items-stretch h-16">
                            {/*Left-side image */}
                            {eq.iconUrl && (
                              <div className="flex-shrink-0 flex items-center h-full">
                                <img src={eq.iconUrl} alt={eq.name} className="h-full w-14 object-contain rounded shadow-sm bg-transparent" />
                              </div>
                            )}
                            {/* Right info */}
                            <div className="flex flex-col justify-center pl-3 flex-1 h-full">
                              <span className="font-semibold text-base text-slate-800 dark:text-slate-100 leading-tight">{eq.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                {/* Input currentLevel */}
                                <input
                                  type="number"
                                  min={1}
                                  max={eq.targetLevel}
                                  value={eq.currentLevel}
                                  onChange={e => {
                                    const newLevel = parseInt(e.target.value)
                                    if (newLevel >= 1 && newLevel <= eq.targetLevel) {
                                      onEquipmentChange(equipment.map(item =>
                                        item.id === eq.id
                                          ? { ...item, currentLevel: newLevel, targetLevel: Math.max(newLevel, item.targetLevel) }
                                          : item
                                      ))
                                    }
                                  }}
                                  className={`w-14 p-1 text-center rounded border text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400'}`}
                                />
                                <span className="text-xs text-slate-500">/</span>
                                {/* Input targetLevel */}
                                <input
                                  type="number"
                                  min={eq.currentLevel}
                                  max={maxLevel}
                                  value={eq.targetLevel}
                                  onChange={e => {
                                    const newLevel = parseInt(e.target.value)
                                    if (newLevel >= eq.currentLevel && newLevel <= maxLevel) {
                                      onEquipmentChange(equipment.map(item =>
                                        item.id === eq.id
                                          ? { ...item, targetLevel: newLevel }
                                          : item
                                      ))
                                    }
                                  }}
                                  className={`w-14 p-1 text-center rounded border text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400'}`}
                                />
                                <span className="text-xs text-slate-400">/{maxLevel}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center align-middle py-3">
                          <span className={`inline-block px-2 py-0.5 rounded ${eq.rarity === 'Epic' ? 'bg-purple-200 text-purple-700' : 'bg-slate-200 text-slate-700'} font-semibold text-sm`}>{eq.rarity === 'Epic' ? 'Epic' : 'Common'}</span>
                        </td>
                        <td className="text-center align-middle py-3">
                          <div className="flex gap-2 items-center flex-wrap justify-center">
                            {cost.shiny > 0 && <span className="flex items-center gap-1 text-amber-500"><img src="/images/shiny.png" alt="shiny" className="w-4 h-4" />{cost.shiny}</span>}
                            {cost.glowy > 0 && <span className="flex items-center gap-1 text-blue-500"><img src="/images/glowy.png" alt="glowy" className="w-4 h-4" />{cost.glowy}</span>}
                            {cost.starry > 0 && <span className="flex items-center gap-1 text-purple-500"><img src="/images/starry.png" alt="starry" className="w-4 h-4" />{cost.starry}</span>}
                            {(cost.shiny === 0 && cost.glowy === 0 && cost.starry === 0) && <span className="text-slate-400 italic">-</span>}
                          </div>
                        </td>
                        <td className="text-center align-middle font-semibold text-slate-700 dark:text-slate-100 py-3">
                          {estimateTime(cost)}
                        </td>
                      </tr>
                    );
                  }));
                }
              }
              return rows;
            })()}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EquipmentManager