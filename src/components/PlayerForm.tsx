import { useState, useEffect } from "react";
import type { PlayerSettings } from "../types";

interface PlayerFormProps {
    settings: PlayerSettings
    onSettingsChange: (settings: PlayerSettings) => void
    isDark: boolean
}

function PlayerForm({settings, onSettingsChange, isDark} : PlayerFormProps) {

    const [leagues, setLeague] = useState<string[]>([]);

    

    useEffect(() => {
        const fetchLeagues = async () => {
            setLeague([
                'Legend', 'Titan I', 'Titan II', 'Titan III',
                'Champion I', 'Champion II', 'Champion III',
                'Master I', 'Master II', 'Master III',
                'Crystal I', 'Crystal II', 'Crystal III',
                'Gold I', 'Gold II', 'Gold III',
                'Silver I', 'Silver II', 'Silver III',
                'Bronze I', 'Bronze II', 'Bronze III'
            ]);
        };

        fetchLeagues();
    }, []);

    const updateSetting = (key: keyof PlayerSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

    const updateRaidMedal = (ore: 'shiny' | 'glowy' | 'starry', value: number) => {
    onSettingsChange({
      ...settings,
      oresBuyUsingRaidMedals: {
        ...settings.oresBuyUsingRaidMedals,
        [ore]: value
      }
    })
  }
  const updateGem = (ore: 'shiny' | 'glowy' | 'starry', value: number) => {
    onSettingsChange({
      ...settings,
      oresBuyUsingGem: {
        ...settings.oresBuyUsingGem,
        [ore]: value
      }
    })
  }

    const labelClasses = `block text-sm font-medium mb-2 ${
        isDark ? 'text-slate-300' : 'text-slate-700'
    }`

    const inputClasses = `w-full p-3 rounded-lg border transition-all duration-200 ${
    isDark 
      ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
      : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
    }`


    const sliderClasses = `w-full h-2 rounded-lg appearance-none cursor-pointer ${
    isDark ? 'bg-slate-600' : 'bg-slate-200'
    }`


    return (
        <div className="space-y-6">
            {/*league selection*/}
            <div>
                <label className={labelClasses}>
                    Current League
                </label>
                <select 
                    value={settings.league}
                    onChange={e => updateSetting('league', e.target.value)}
                    className={inputClasses}
                >
                  {leagues.map(league => (
                    <option key={league} value={league}>{league}</option>
                  ))}  
                </select>
            </div>

            {/*Town hall Selection */}
            <div>
              <label className={labelClasses}>Attack Town Hall: {settings.attackTownHall}</label>
              <input
                type="range"
                min={8}
                max={17}
                value={settings.attackTownHall}
                onChange={e => updateSetting('attackTownHall', parseInt(e.target.value))}
                className={sliderClasses}
                style={{
                  background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${((settings.attackTownHall-8)/9)*100}%, ${isDark ? '#334155' : '#22292f'} ${((settings.attackTownHall-8)/9)*100}%, ${isDark ? '#334155' : '#22292f'} 100%)`
                }}
              />
              <div className="flex justify-between mt-2 select-none min-h-[40px]">
                {Array.from({ length: 10 }, (_, i) => {
                  const th = i + 8;
                  const isActive = th === settings.attackTownHall;
                  return (
                    <span
                      key={th}
                      className={`mx-1 font-bold transition-all duration-150 inline-block align-bottom ${
                        isActive
                          ? `text-2xl ${isDark ? 'text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.7)]' : 'text-amber-600'}`
                          : `text-xl ${isDark ? 'text-slate-500' : 'text-slate-400'}`
                      }`}
                      style={{
                        fontFamily: "'Bangers', 'Roboto', sans-serif",
                        letterSpacing: "1px",
                        height: "40px",
                        lineHeight: "40px"
                      }}
                    >
                      {th}
                    </span>
                  );
                })}
              </div>
            </div>

            {/*Clan war attack per week */}
            <div>
                <label className={labelClasses}>Clan war attack per week: {settings.clanWarAttackPerWeek}</label>
                <input
                  type="range"
                  min={0}
                  max={7}
                  value={settings.clanWarAttackPerWeek}
                  onChange={e => updateSetting('clanWarAttackPerWeek', parseInt(e.target.value))}
                  className={sliderClasses}
                  style={{
                    background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(settings.clanWarAttackPerWeek/7)*100}%, ${isDark ? '#334155' : '#22292f'} ${(settings.clanWarAttackPerWeek/7)*100}%, ${isDark ? '#334155' : '#22292f'} 100%)`
                  }}
                />
                <div className="flex justify-between mt-2 select-none min-h-[40px]">
                  {Array.from({ length: 8 }, (_, i) => {
                    const isActive = i === settings.clanWarAttackPerWeek;
                    return (
                      <span
                        key={i}
                        className={`mx-1 font-bold transition-all duration-150 inline-block align-bottom ${
                          isActive
                            ? `text-2xl ${isDark ? 'text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.7)]' : 'text-amber-600'}`
                            : `text-xl ${isDark ? 'text-slate-500' : 'text-slate-400'}`
                        }`}
                        style={{
                          fontFamily: "'Bangers', 'Roboto', sans-serif",
                          letterSpacing: "1px",
                          height: "40px",
                          lineHeight: "40px"
                        }}
                      >
                        {i}
                      </span>
                    );
                  })}
                </div>
            </div>

            {/*Clan War Win Ratio */}
            <div>
                <label className={labelClasses}>Clan War Win Ratio: {(settings.clanWarRatio * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={settings.clanWarRatio}
                  onChange={e => updateSetting('clanWarRatio', parseFloat(e.target.value))}
                  className={sliderClasses}
                  style={{
                    background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${settings.clanWarRatio*100}%, ${isDark ? '#334155' : '#22292f'} ${settings.clanWarRatio*100}%, ${isDark ? '#334155' : '#22292f'} 100%)`
                  }}
                />
                <div className={`flex justify-between text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>0%</span>
                    <span>100%</span>
                </div>
            </div>

            {/*Ores buy using raid medal */}
            <div>
                <label className={labelClasses}>Ores buy using raid medals</label>
                <div className="flex items-center gap-4">
                    <img src="images/shiny.png" alt="Shiny Ore" className="w-6 h-6" title="Shiny Ore" />
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        step={500}
                        value={settings.oresBuyUsingRaidMedals.shiny}
                        onChange={e => updateRaidMedal('shiny', parseInt(e.target.value))}
                        className={`${sliderClasses} w-24`}
                        style={{
                            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(settings.oresBuyUsingRaidMedals.shiny / 1000) * 100}%, ${isDark ? '#334155' : '#22292f'} ${(settings.oresBuyUsingRaidMedals.shiny / 1000) * 100}%, ${isDark ? '#334155' : '#22292f'} 100%)`
                        }}
                    />
                    <span className={`inline-block text-right font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`} style={{minWidth: "40px"}}>{settings.oresBuyUsingRaidMedals.shiny}</span>

                    <img src="images/glowy.png" alt="Glowy Ore" className="w-6 h-6" title="Glowy Ore" />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={50}
                        value={settings.oresBuyUsingRaidMedals.glowy}
                        onChange={e => updateRaidMedal('glowy', parseInt(e.target.value))}
                        className={`${sliderClasses} w-16`}
                         style={{
                            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(settings.oresBuyUsingRaidMedals.glowy / 100) * 100}%, ${isDark ? '#334155' : '#22292f'} ${(settings.oresBuyUsingRaidMedals.glowy / 100) * 100}%, ${isDark ? '#334155' : '#22292f'} 100%)`
                        }}
                    />
                    <span className={`inline-block text-right font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`} style={{minWidth: "40px"}}>{settings.oresBuyUsingRaidMedals.glowy}</span>

                    <img src="images/starry.png" alt="Starry Ore" className="w-6 h-6" title="Starry Ore" />
                    <input
                        type="range"
                        min={0}
                        max={10}
                        step={5}
                        value={settings.oresBuyUsingRaidMedals.starry}
                        onChange={e => updateRaidMedal('starry', parseInt(e.target.value))}
                        className={`${sliderClasses} w-12`}
                        style={{
                            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(settings.oresBuyUsingRaidMedals.starry / 10) * 100}%, ${isDark ? '#334155' : '#22292f'} ${(settings.oresBuyUsingRaidMedals.starry / 10) * 100}%, ${isDark ? '#334155' : '#22292f'} 100%)`
                        }}
                    />
                    <span className={`inline-block text-right font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`} style={{minWidth: "40px"}}>{settings.oresBuyUsingRaidMedals.starry}</span>
                </div>
            </div>

            {/*Ores buy using gem*/}
            <div>
                <label className={labelClasses}>Ores buy using gems</label>
                <div className="flex items-center gap-4">
                    <img src="images/shiny.png" alt="Shiny Ore" className="w-6 h-6" title="Shiny Ore" />
                    <input
                        type="range"
                        min={0}
                        max={1500}
                        step={300}
                        value={settings.oresBuyUsingGem.shiny}
                        onChange={e => updateGem('shiny', parseInt(e.target.value))}
                        className={`${sliderClasses} w-24`}
                        style={{
                            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(settings.oresBuyUsingGem.shiny / 1500) * 100}%, ${isDark ? '#334155' : '#22292f'} ${(settings.oresBuyUsingGem.shiny / 1500) * 100}%, ${isDark ? '#334155' : '#22292f'} 100%)`
                        }}
                    />
                    <span className={`inline-block text-right font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`} style={{minWidth: "40px"}}>{settings.oresBuyUsingGem.shiny}</span>

                    <img src="images/glowy.png" alt="Glowy Ore" className="w-6 h-6" title="Glowy Ore" />
                    <input
                        type="range"
                        min={0}
                        max={120}
                        step={60}
                        value={settings.oresBuyUsingGem.glowy}
                        onChange={e => updateGem('glowy', parseInt(e.target.value))}
                        className={`${sliderClasses} w-24`}
                        style={{
                            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(settings.oresBuyUsingGem.glowy / 120) * 100}%, ${isDark ? '#334155' : '#22292f'} ${(settings.oresBuyUsingGem.glowy / 120) * 100}%, ${isDark ? '#334155' : '#22292f'} 100%)`
                        }}
                    />
                    <span className={`inline-block text-right font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`} style={{minWidth: "40px"}}>{settings.oresBuyUsingGem.glowy}</span>

                    <img src="images/starry.png" alt="Starry Ore" className="w-6 h-6" title="Starry Ore" />
                    <input
                        type="range"
                        min={0}
                        max={15}
                        step={15}
                        value={settings.oresBuyUsingGem.starry}
                        onChange={e => updateGem('starry', parseInt(e.target.value))}
                        className={`${sliderClasses} w-24`}
                        style={{
                            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(settings.oresBuyUsingGem.starry / 15) * 100}%, ${isDark ? '#334155' : '#22292f'} ${(settings.oresBuyUsingGem.starry / 15) * 100}%, ${isDark ? '#334155' : '#22292f'} 100%)`
                        }}
                    />
                    <span className={`inline-block text-right font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`} style={{minWidth: "40px"}}>{settings.oresBuyUsingGem.starry}</span>
                </div>
            </div>
                

            {/*Gain free */}
            {/* <div>
                <label className={labelClasses}>Gain free</label>

            </div> */}

            <div>
                <label className={labelClasses + " flex items-center gap-2"}>
                    <input
                        type="checkbox"
                        checked={settings.oreTraiderFree}
                        onChange={e => updateSetting('oreTraiderFree', e.target.checked)}
                        className="mr-2"
                    />
                    Gain glowy free
                </label>
            </div>

            

        </div>

    )
}

export default PlayerForm;
