interface StatCalculation {
  min: number;
  max: number;
}

/**
 * Calculates the minimum and maximum stat values for a Pokemon at level 100
 * 
 * Formula for HP:
 * HP = floor(0.01 x (2 x Base + IV + floor(0.25 x EV)) x Level) + Level + 10
 * 
 * Formula for other stats:
 * Stat = floor(0.01 x (2 x Base + IV + floor(0.25 x EV)) x Level + 5) x Nature
 * 
 * @param baseStat - The base stat value from the Pokemon species
 * @param isHP - Whether this calculation is for HP stat (uses different formula)
 * @returns Object with min and max stat values at level 100
 */
export function calculateStatRange(baseStat: number, isHP: boolean = false): StatCalculation {
  const level = 100;
  
  if (isHP) {
    // HP calculation
    // Min: IV=0, EV=0
    const minHP = Math.floor(0.01 * (2 * baseStat + 0 + Math.floor(0.25 * 0)) * level) + level + 10;
    
    // Max: IV=31, EV=252
    const maxHP = Math.floor(0.01 * (2 * baseStat + 31 + Math.floor(0.25 * 252)) * level) + level + 10;
    
    return { min: minHP, max: maxHP };
  } else {
    // Other stats calculation
    // Min: IV=0, EV=0, hindering nature (0.9x)
    const minBase = Math.floor(0.01 * (2 * baseStat + 0 + Math.floor(0.25 * 0)) * level + 5);
    const minStat = Math.floor(minBase * 0.9);
    
    // Max: IV=31, EV=252, beneficial nature (1.1x)
    const maxBase = Math.floor(0.01 * (2 * baseStat + 31 + Math.floor(0.25 * 252)) * level + 5);
    const maxStat = Math.floor(maxBase * 1.1);
    
    return { min: minStat, max: maxStat };
  }
}

/**
 * Calculates stat ranges for all Pokemon stats
 * 
 * @param stats - Object containing base stat values
 * @returns Object with min/max calculations for each stat
 */
export function calculateAllStatRanges(stats: {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}) {
  return {
    hp: calculateStatRange(stats.hp, true),
    attack: calculateStatRange(stats.attack),
    defense: calculateStatRange(stats.defense),
    specialAttack: calculateStatRange(stats.specialAttack),
    specialDefense: calculateStatRange(stats.specialDefense),
    speed: calculateStatRange(stats.speed),
  };
}

// Example usage:
// const bulbasaurStats = {
//   hp: 45,
//   attack: 49,
//   defense: 49,
//   specialAttack: 65,
//   specialDefense: 65,
//   speed: 45,
// };
// 
// const ranges = calculateAllStatRanges(bulbasaurStats);
// console.log(ranges.hp); // { min: 250, max: 344 }
// console.log(ranges.attack); // { min: 90, max: 218 }