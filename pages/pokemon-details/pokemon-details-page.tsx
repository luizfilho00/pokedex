import { OutlinedText } from "@/components/ui/outlined_text";
import PokemonInfo from "@/components/ui/pokemon-info";
import { TextColors } from "@/constants/theme";
import useFetchPokemonById from "@/features/fetch-pokemon-by-id/use-fetch-pokemon-by-id";
import { AppFonts } from "@/shared/ui/fonts";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ImageBackground, Text, useWindowDimensions, View } from "react-native";
import { SceneMap, TabBar, TabBarItem, TabView } from "react-native-tab-view";
import AboutPage from "./about-page";
import StatsPage from "./stats-page";
import EvolutionPage from "./evolution-page";

const routes = [
  { key: "about", title: "About" },
  { key: "stats", title: "Stats" },
  { key: "evolution", title: "Evolution" },
];

const renderTabItem = (props: any) => {
  const { key, ...tabBarItemProps } = props;
  const routeIndex = props.navigationState.routes.findIndex(
    (r: any) => r.key === props.route.key
  );
  const isSelected = props.navigationState.index === routeIndex;

  return isSelected ? (
    <ImageBackground
      source={require("@/assets/images/mask_pokeball.png")}
      imageStyle={{
        resizeMode: "center",
      }}
    >
      <TabBarItem
        {...tabBarItemProps}
        labelStyle={{
          color: TextColors.white,
          fontSize: 16,
          fontFamily: AppFonts.bold,
          opacity: 1, // Full opacity for selected
        }}
      />
    </ImageBackground>
  ) : (
    <TabBarItem
      {...tabBarItemProps}
      labelStyle={{
        color: TextColors.white,
        fontSize: 16,
        fontFamily: AppFonts.bold,
        opacity: 0.5, // Reduced opacity for non-selected
      }}
    />
  );
};

const renderTabBar = (props: any) => {
  const { key, ...tabBarProps } = props;
  return (
    <TabBar
      {...tabBarProps}
      indicatorStyle={{ backgroundColor: "transparent" }}
      renderTabBarItem={renderTabItem}
      style={{
        backgroundColor: "transparent",
      }}
    />
  );
};

export default function PokemonDetailsPage() {
  const { id } = useLocalSearchParams();
  const { pokemon } = useFetchPokemonById(String(id));
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderScene = useCallback(({ route }: any) => {
    switch (route.key) {
      case "about":
        return <AboutPage pokemon={pokemon!} />;
      case "stats":
        return <StatsPage pokemon={pokemon!} />;
      case "evolution":
        return <EvolutionPage pokemon={pokemon!} />;
      default:
        return null;
    }
  }, [pokemon]);
  
  return (
    pokemon && (
      <View
        style={{
          backgroundColor: pokemon?.types[0].backgroundColor,
          paddingTop: 50,
          flex: 1,
        }}
      >
        <View style={{ position: "relative", height: 240 }}>
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
            }}
          >
            <OutlinedText
              text={pokemon.name.toUpperCase()}
              fontSize={100}
              strokeColor="white"
              strokeWidth={2}
              fontFamily={AppFonts.bold}
            />
          </View>
          <ImageBackground
            source={require("@/assets/images/horizontal_pattern.png")}
            style={{
              position: "absolute",
              right: 0,
              top: "55%",
              width: 65,
              height: 140,
            }}
            imageStyle={{
              resizeMode: "contain",
            }}
          />
          <View
            style={{
              marginTop: 16,
              marginStart: 40,
              flexDirection: "row",
              alignItems: "center",
              height: "100%",
            }}
          >
            <ImageBackground
              source={require("@/assets/images/circle.png")}
              style={{ marginEnd: 24 }}
            >
              <Image source={{ uri: pokemon.image }} width={125} height={125} />
            </ImageBackground>
            <PokemonInfo
              id={`#${pokemon.id}`}
              name={pokemon.name}
              types={pokemon.types}
              style={{
                alignSelf: "center",
              }}
            />
          </View>
        </View>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          pagerStyle={{
            backgroundColor: pokemon.types[0].backgroundColor,
            flex: 1,
          }}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </View>
    )
  );
}
