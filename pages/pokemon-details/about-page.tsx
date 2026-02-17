import { Badge } from "@/components/ui/badge";
import { Pokemon } from "@/entities/pokemon";
import { AppFonts } from "@/shared/ui/fonts";
import { View, Text, ScrollView } from "react-native";

function formatGender(genderRate?: number) {
  if (genderRate == null || genderRate === -1) {
    return { isGenderless: true, femalePercent: 0, malePercent: 0 };
  }
  const femalePercent = (genderRate / 8) * 100;
  return { isGenderless: false, femalePercent, malePercent: 100 - femalePercent };
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-6 mt-5">
      <Text
        className="flex-1 text-xs text-text-black"
        style={{ fontFamily: AppFonts.medium }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

function InfoValue({ children }: { children: React.ReactNode }) {
  return (
    <Text
      className="flex-[2] text-base text-text-grey"
      style={{ fontFamily: AppFonts.regular }}
    >
      {children}
    </Text>
  );
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <Text
      className="mt-[30px] text-base"
      style={{ fontFamily: AppFonts.bold, color }}
    >
      {title}
    </Text>
  );
}

export default function AboutPage({ pokemon }: { pokemon: Pokemon }) {
  const { isGenderless, femalePercent, malePercent } = formatGender(pokemon.genderRate);
  const typeColor = pokemon.types[0].foregroundColor;

  return (
    <ScrollView className="bg-white rounded-t-[30px] flex-1 flex-col p-8">
      <Text
        className="text-base text-text-grey"
        style={{ fontFamily: AppFonts.regular }}
      >
        {pokemon.description ?? ""}
      </Text>
      <View>
        <SectionHeader title="Pokédex Data" color={typeColor} />
        <InfoRow label="Species">
          <InfoValue>{pokemon.genus ?? ""}</InfoValue>
        </InfoRow>
        <InfoRow label="Height">
          <InfoValue>
            {pokemon.height != null ? `${(pokemon.height / 10).toFixed(1)} m` : "—"}
          </InfoValue>
        </InfoRow>
        <InfoRow label="Weight">
          <InfoValue>
            {pokemon.weight != null ? `${(pokemon.weight / 10).toFixed(1)} kg` : "—"}
          </InfoValue>
        </InfoRow>
        <InfoRow label="Weakness">
          <View className="flex-[2] flex-row gap-2">
            {pokemon.types.map((type) => (
              <Badge
                key={`${pokemon.id}-${type.name}`}
                image={type.icon}
                label={""}
                backgroundColor={type.foregroundColor}
              />
            ))}
          </View>
        </InfoRow>
        <InfoRow label="Gender">
          <View className="flex-row flex-[2]">
            {isGenderless ? (
              <Text
                className="text-base text-text-grey"
                style={{ fontFamily: AppFonts.medium }}
              >
                Genderless
              </Text>
            ) : (
              <>
                <Text
                  className="text-base"
                  style={{ fontFamily: AppFonts.medium, color: "#6C79DB" }}
                >
                  {`♂ ${malePercent}%, `}
                </Text>
                <Text
                  className="text-base"
                  style={{ fontFamily: AppFonts.medium, color: "#F0729F" }}
                >
                  {`♀ ${femalePercent}%`}
                </Text>
              </>
            )}
          </View>
        </InfoRow>
      </View>

      <View>
        <SectionHeader title="Training" color={typeColor} />
        <InfoRow label="EV Yield">
          <InfoValue>
            {pokemon.stats
              .filter((s) => s.effort > 0)
              .map((s) => `${s.effort} ${s.name}`)
              .join(", ") || "—"}
          </InfoValue>
        </InfoRow>
        <InfoRow label="Catch Rate">
          <InfoValue>{pokemon.catchRate ?? "—"}</InfoValue>
        </InfoRow>
        <InfoRow label="Base Friendship">
          <InfoValue>{pokemon.baseHappiness ?? "—"}</InfoValue>
        </InfoRow>
        <InfoRow label="Base Exp">
          <InfoValue>{pokemon.baseExperience ?? "—"}</InfoValue>
        </InfoRow>
        <InfoRow label="Growth Rate">
          <InfoValue>
            {pokemon.growthRate
              ? pokemon.growthRate
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")
              : "—"}
          </InfoValue>
        </InfoRow>
      </View>
    </ScrollView>
  );
}
