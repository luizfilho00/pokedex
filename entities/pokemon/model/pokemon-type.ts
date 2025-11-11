export interface PokemonType {
  name: string;
  icon: any;
  backgroundColor: string;
  foregroundColor: string;
}

export class BugType implements PokemonType {
  name = "Bug";
  icon = require("@/assets/images/bug.png");
  backgroundColor = "#8BD674";
  foregroundColor = "#8CB230";
}

export class DarkType implements PokemonType {
  name = "Dark";
  icon = require("@/assets/images/dark.png");
  backgroundColor = "#6F6E78";
  foregroundColor = "#58575F";
}

export class DragonType implements PokemonType {
  name = "Dragon";
  icon = require("@/assets/images/dragon.png");
  backgroundColor = "#7383B9";
  foregroundColor = "#0F6AC0";
}

export class ElectricType implements PokemonType {
  name = "Electric";
  icon = require("@/assets/images/electric.png");
  backgroundColor = "#F2CB55";
  foregroundColor = "#EED535";
}

export class FairyType implements PokemonType {
  name = "Fairy";
  icon = require("@/assets/images/fairy.png");
  backgroundColor = "#EBA8C3";
  foregroundColor = "#ED6EC7";
}

export class FightingType implements PokemonType {
  name = "Fighting";
  icon = require("@/assets/images/fighting.png");
  backgroundColor = "#EB4971";
  foregroundColor = "#D04164";
}

export class FireType implements PokemonType {
  name = "Fire";
  icon = require("@/assets/images/fire.png");
  backgroundColor = "#FFA756";
  foregroundColor = "#FD7D24";
}

export class FlyingType implements PokemonType {
  name = "Flying";
  icon = require("@/assets/images/flying.png");
  backgroundColor = "#83A2E3";
  foregroundColor = "#748FC9";
}

export class GhostType implements PokemonType {
  name = "Ghost";
  icon = require("@/assets/images/ghost.png");
  backgroundColor = "#8571BE";
  foregroundColor = "#556AAE";
}

export class GrassType implements PokemonType {
  name = "Grass";
  icon = require("@/assets/images/grass.png");
  backgroundColor = "#8BBE8A";
  foregroundColor = "#62B957";
}

export class GroundType implements PokemonType {
  name = "Ground";
  icon = require("@/assets/images/ground.png");
  backgroundColor = "#F78551";
  foregroundColor = "#DD7748";
}

export class IceType implements PokemonType {
  name = "Ice";
  icon = require("@/assets/images/ice.png");
  backgroundColor = "#91D8DF";
  foregroundColor = "#61CEC0";
}

export class NormalType implements PokemonType {
  name = "Normal";
  icon = require("@/assets/images/normal.png");
  backgroundColor = "#B5B9C4";
  foregroundColor = "#9DA0AA";
}

export class PoisonType implements PokemonType {
  name = "Poison";
  icon = require("@/assets/images/poison.png");
  backgroundColor = "#9F6E97";
  foregroundColor = "#A552CC";
}

export class PsychicType implements PokemonType {
  name = "Psychic";
  icon = require("@/assets/images/psychic.png");
  backgroundColor = "#FF6568";
  foregroundColor = "#EA5D60";
}

export class RockType implements PokemonType {
  name = "Rock";
  icon = require("@/assets/images/rock.png");
  backgroundColor = "#D4C294";
  foregroundColor = "#BAAB82";
}

export class SteelType implements PokemonType {
  name = "Steel";
  icon = require("@/assets/images/steel.png");
  backgroundColor = "#4C91B2";
  foregroundColor = "#417D9A";
}

export class WaterType implements PokemonType {
  name = "Water";
  icon = require("@/assets/images/water.png");
  backgroundColor = "#58ABF6";
  foregroundColor = "#4A90DA";
}
