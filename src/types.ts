export interface PlayerSettings{
    league: string;
    attackTownHall: number;
    clanWarAttackPerWeek: number;
    clanWarRatio: number;
    oresBuyUsingRaidMedals: {
        shiny: number;
        glowy: number;
        starry: number;
    };
    oresBuyUsingGem: {
        shiny: number;
        glowy: number;
        starry: number;
    };
    oreTraiderFree: boolean;
    playerTag?: string;
    equimentJson?: string;
}


export type EquipmentRarity = 'Common' | 'Epic';

export interface Equipment {
    id: string; 
    name: string; 
    rarity: EquipmentRarity; 
    iconUrl?: string;
    currentLevel: number;
    targetLevel: number; 
    oreCost: {
        shiny: number;
        glowy: number;
        starry: number;
    };
  isSelected: boolean; 
  isHidden: boolean; 
}

export interface OreSummary {
  shiny: number;
  glowy: number;
  starry: number;
}

export interface OreSourceBreakdown {
  daily: OreSummary;
  war: OreSummary;
  trader: OreSummary;
  raidMedal: OreSummary;
  gem: OreSummary;
  total: OreSummary;
}

export interface FullOreSummary {
  weekly: OreSourceBreakdown;
  monthly: OreSourceBreakdown;
}
