import { useState, useEffect } from "react";
import type { PlayerSettings } from "../types";

interface OreCalculatorProps {
  settings: PlayerSettings;
  isDark: boolean;
}

interface OreSource {
  shiny: number;
  glowy: number;
  starry: number;
}

interface OreDataMode {
  sources: { [key: string]: OreSource };
  total: OreSource;
}

interface OreData {
  week: OreDataMode;
  month: OreDataMode;
}

const ORE_SOURCES = [
  { key: "Daily", label: "Daily", icon: "/images/daily.png", color: "bg-amber-100 text-amber-700 border-amber-300", dark: "bg-amber-500/20 text-amber-100 border-amber-500/30" },
  { key: "War", label: "War", icon: "/images/war.png", color: "bg-blue-100 text-blue-700 border-blue-300", dark: "bg-blue-500/20 text-blue-100 border-blue-500/30" },
  { key: "Trader", label: "Trader Free", icon: "/images/trader.png", color: "bg-green-100 text-green-700 border-green-300", dark: "bg-green-500/20 text-green-100 border-green-500/30" },
  { key: "Raid Medal", label: "Raid Medal", icon: "/images/raid.png", color: "bg-cyan-100 text-cyan-700 border-cyan-300", dark: "bg-cyan-500/20 text-cyan-100 border-cyan-500/30" },
  { key: "Gem", label: "Gem", icon: "/images/gem.png", color: "bg-pink-100 text-pink-700 border-pink-300", dark: "bg-pink-500/20 text-pink-100 border-pink-500/30" },
];

const LEAGUE_DAILY_BONUS: Record<string, { shiny: number; glowy: number }> = {
  "Legend": { shiny: 1000, glowy: 54 },
  "Titan I": { shiny: 925, glowy: 50 },
  "Titan II": { shiny: 850, glowy: 46 },
  "Titan III": { shiny: 775, glowy: 42 },
  "Champion I": { shiny: 700, glowy: 38 },
  "Champion II": { shiny: 625, glowy: 34 },
  "Champion III": { shiny: 550, glowy: 30 },
  "Master I": { shiny: 525, glowy: 28 },
  "Master II": { shiny: 500, glowy: 26 },
  "Master III": { shiny: 450, glowy: 24 },
  "Crystal I": { shiny: 425, glowy: 22 },
  "Crystal II": { shiny: 400, glowy: 20 },
  "Crystal III": { shiny: 375, glowy: 18 },
  "Gold I": { shiny: 350, glowy: 16 },
  "Gold II": { shiny: 325, glowy: 14 },
  "Gold III": { shiny: 300, glowy: 12 },
  "Silver I": { shiny: 275, glowy: 11 },
  "Silver II": { shiny: 250, glowy: 10 },
  "Silver III": { shiny: 200, glowy: 9 },
  "Bronze I": { shiny: 175, glowy: 8 },
  "Bronze II": { shiny: 175, glowy: 7 },
  "Bronze III": { shiny: 125, glowy: 6 },
};

const WAR_BONUS_BY_TH: Record<number, { shiny: number; glowy: number; starry: number }> = {
  8:  { shiny: 380,  glowy: 15, starry: 0 },
  9:  { shiny: 410,  glowy: 18, starry: 0 },
  10: { shiny: 460,  glowy: 21, starry: 3 },
  11: { shiny: 560,  glowy: 24, starry: 3 },
  12: { shiny: 610,  glowy: 27, starry: 4 },
  13: { shiny: 710,  glowy: 30, starry: 4 },
  14: { shiny: 810,  glowy: 33, starry: 4 },
  15: { shiny: 960,  glowy: 36, starry: 5 },
  16: { shiny: 1110, glowy: 39, starry: 6 },
  17: { shiny: 1110, glowy: 39, starry: 6 },
};



function calcOreWeek(settings: PlayerSettings){
  //A Daily
  const dailyBonus = LEAGUE_DAILY_BONUS[settings.league] || {shiny: 0, glowy: 0};
  const dailyShiny = dailyBonus.shiny * 7;
  const dailyGlowy = dailyBonus.glowy * 7;

  //B War
  const warBonus = WAR_BONUS_BY_TH[settings.attackTownHall] || {shiny: 0, glowy: 0, starry: 0}
  const warTurns = settings.clanWarAttackPerWeek;
  const winRatio = settings.clanWarRatio;
  const warShiny = warTurns * warBonus.shiny * winRatio;
  const warGlowy = warTurns * warBonus.glowy * winRatio;
  const warStarry = warTurns * warBonus.starry * winRatio;

  // C. Trader free
  const traderFreeGlowy = settings.oreTraiderFree ? 10 : 0;

  const raid = settings.oresBuyUsingRaidMedals;
  const gem = settings.oresBuyUsingGem;

  const sources = {
    Daily: { shiny: dailyShiny, glowy: dailyGlowy, starry: 0 },
    War: { shiny: warShiny, glowy: warGlowy, starry: warStarry },
    Trader: { shiny: 0, glowy: traderFreeGlowy, starry: 0 },
    "Raid Medal": { ...raid },
    Gem: { ...gem }
  };

  // total
  const total = Object.values(sources).reduce(
    (acc, src) => ({
      shiny: acc.shiny + src.shiny,
      glowy: acc.glowy + src.glowy,
      starry: acc.starry + (src.starry || 0)
    }),
    { shiny: 0, glowy: 0, starry: 0 }
  );

  return { sources, total };
}

function OreCalculator({ settings, isDark }: OreCalculatorProps) {
  const [mode, setMode] = useState<"week" | "month">("month");
  const [oreData, setOreData] = useState<OreData | null>(null);

  useEffect(() => {
    const week = calcOreWeek(settings);
    const month: OreDataMode = { sources: {}, total: { shiny: 0, glowy: 0, starry: 0 } };
    for (const key in week.sources) {
      const k = key as keyof typeof week.sources;
      month.sources[k] = {
        shiny: Math.round(week.sources[k].shiny * 4.33),
        glowy: Math.round(week.sources[k].glowy * 4.33),
        starry: Math.round((week.sources[k].starry || 0) * 4.33)
      };
      month.total.shiny += month.sources[k].shiny;
      month.total.glowy += month.sources[k].glowy;
      month.total.starry += month.sources[k].starry;
    }
    setOreData({ week, month });
  }, [settings]);

  if (!oreData) return <div>Loading...</div>;
  const current = oreData[mode];

  const formatNumber = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  return (
    <div className="space-y-6">
      {/* Toggle weekly/monthly */}
      <div className="flex gap-2 mb-4 justify-center">
        <button
          className={`px-4 py-2 rounded-full font-semibold shadow transition-all duration-150 border-2 ${mode === "week" ? "bg-amber-500 text-white border-amber-500 scale-105" : "bg-slate-200 text-slate-700 border-transparent hover:bg-amber-100"}`}
          onClick={() => setMode("week")}
        >
          Weekly
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold shadow transition-all duration-150 border-2 ${mode === "month" ? "bg-amber-500 text-white border-amber-500 scale-105" : "bg-slate-200 text-slate-700 border-transparent hover:bg-amber-100"}`}
          onClick={() => setMode("month")}
        >
          Monthly
        </button>
      </div>

      {/* Total ore */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="text-2xl font-bold flex gap-4">
          <span className="flex items-center gap-1 text-amber-500"><img src="/images/shiny.png" alt="shiny" className="w-6 h-6 inline-block" /> {formatNumber(current.total.shiny)}</span>
          <span className="flex items-center gap-1 text-blue-500"><img src="/images/glowy.png" alt="glowy" className="w-6 h-6 inline-block" /> {formatNumber(current.total.glowy)}</span>
          <span className="flex items-center gap-1 text-purple-500"><img src="/images/starry.png" alt="starry" className="w-6 h-6 inline-block" /> {formatNumber(current.total.starry)}</span>
        </div>
        <div className="text-sm text-slate-500">Total {mode === "week" ? "per week" : "per month"}</div>
      </div>

      {/* Detail */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ORE_SOURCES.map((src) => {
          const source = current.sources[src.key];
          if (!source || (source.shiny === 0 && source.glowy === 0 && (!source.starry || source.starry === 0))) return null;
          const color = isDark ? src.dark : src.color;
          return (
            <div key={src.key} className={`flex items-center gap-3 p-4 rounded-xl border shadow card-hover ${color}`}>
              <img src={src.icon} alt={src.label} className="w-8 h-8" />
              <div>
                <div className="font-semibold text-base mb-1">{src.label}</div>
                <div className="flex gap-2 text-sm">
                  {source.shiny > 0 && <span className="flex items-center gap-1 text-amber-500"><img src="/images/shiny.png" alt="shiny" className="w-5 h-5 inline-block" /> {formatNumber(source.shiny)}</span>}
                  {source.glowy > 0 && <span className="flex items-center gap-1 text-blue-500"><img src="/images/glowy.png" alt="glowy" className="w-5 h-5 inline-block" /> {formatNumber(source.glowy)}</span>}
                  {source.starry > 0 && <span className="flex items-center gap-1 text-purple-500"><img src="/images/starry.png" alt="starry" className="w-5 h-5 inline-block" /> {formatNumber(source.starry)}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          Contribution by Ore Type
        </h3>
        <div className="space-y-4">
          {/* Shiny Ore */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-[80px]">
              <img src="/images/shiny.png" alt="shiny" className="w-5 h-5" />
              <span className="text-sm font-medium text-slate-700">Shiny</span>
            </div>
            <div className="flex-1 bg-slate-100 rounded-full overflow-hidden h-4 border border-slate-200 relative">
              {ORE_SOURCES.map((src) => {
                const source = current.sources[src.key];
                if (!source || source.shiny === 0) return null;
                const totalShiny = current.total.shiny;
                const percent = totalShiny > 0 ? (source.shiny / totalShiny) * 100 : 0;
                let barColor = 'bg-amber-400';
                if (src.key === "Daily") barColor = 'bg-amber-400';
                else if (src.key === "War") barColor = 'bg-blue-400';
                else if (src.key === "Trader") barColor = 'bg-green-400';
                else if (src.key === "Raid Medal") barColor = 'bg-cyan-400';
                else if (src.key === "Gem") barColor = 'bg-pink-400';
                return (
                  <div
                    key={src.key}
                    className={`h-full ${barColor} float-left rounded-none`}
                    style={{ width: `${percent}%` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Glowy Ore */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-[80px]">
              <img src="/images/glowy.png" alt="glowy" className="w-5 h-5" />
              <span className="text-sm font-medium text-slate-700">Glowy</span>
            </div>
            <div className="flex-1 bg-slate-100 rounded-full overflow-hidden h-4 border border-slate-200 relative">
              {ORE_SOURCES.map((src) => {
                const source = current.sources[src.key];
                if (!source || source.glowy === 0) return null;
                const totalGlowy = current.total.glowy;
                const percent = totalGlowy > 0 ? (source.glowy / totalGlowy) * 100 : 0;
                let barColor = 'bg-amber-400';
                if (src.key === "Daily") barColor = 'bg-amber-400';
                else if (src.key === "War") barColor = 'bg-blue-400';
                else if (src.key === "Trader") barColor = 'bg-green-400';
                else if (src.key === "Raid Medal") barColor = 'bg-cyan-400';
                else if (src.key === "Gem") barColor = 'bg-pink-400';
                return (
                  <div
                    key={src.key}
                    className={`h-full ${barColor} float-left rounded-none`}
                    style={{ width: `${percent}%` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Starry Ore */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-[80px]">
              <img src="/images/starry.png" alt="starry" className="w-5 h-5" />
              <span className="text-sm font-medium text-slate-700">Starry</span>
            </div>
            <div className="flex-1 bg-slate-100 rounded-full overflow-hidden h-4 border border-slate-200 relative">
              {ORE_SOURCES.map((src) => {
                const source = current.sources[src.key];
                if (!source || !source.starry || source.starry === 0) return null;
                const totalStarry = current.total.starry;
                const percent = totalStarry > 0 ? (source.starry / totalStarry) * 100 : 0;
                let barColor = 'bg-amber-400';
                if (src.key === "Daily") barColor = 'bg-amber-400';
                else if (src.key === "War") barColor = 'bg-blue-400';
                else if (src.key === "Trader") barColor = 'bg-green-400';
                else if (src.key === "Raid Medal") barColor = 'bg-cyan-400';
                else if (src.key === "Gem") barColor = 'bg-pink-400';
                return (
                  <div
                    key={src.key}
                    className={`h-full ${barColor} float-left rounded-none`}
                    style={{ width: `${percent}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OreCalculator;