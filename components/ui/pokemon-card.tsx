import { TextColors } from "@/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";
import { Badge } from "./badge";

export function PokemonCard() {
  return (
    <View style={styles.invisibleCardContainer}>
      <View style={styles.cardContainer}>
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: TextColors.number,
            }}
          >
            #001
          </Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: TextColors.white,
            }}
          >
            Bulbasaur
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
              marginTop: 6,
            }}
          >
            <Badge
              image={require("@/assets/images/grass.png")}
              label="Grass"
              backgroundColor="#62B957"
            />
            <Badge
              image={require("@/assets/images/poison.png")}
              label="Poison"
              backgroundColor="#A552CC"
              style={{ marginLeft: 6 }}
            />
          </View>
        </View>
        <Image source={require("@/assets/images/pokeball_transparent.png")} />
      </View>
      
      <Image
        source={require("@/assets/images/card_pattern.png")}
        style={{
          position: "absolute",
          left: 90,
          top: 30,
        }}
      />
      <Image
        source={require("@/assets/images/bulbasaur.png")}
        style={{
          width: 130,
          height: 130,
          position: "absolute",
          right: 10,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  invisibleCardContainer: {
    position: "relative",
    marginHorizontal: 32,
  },
  cardContainer: {
    backgroundColor: "#8BBE8A",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
});
