import { OutlinedText } from "@/components/ui/outlined_text";
import PokemonInfo from "@/components/ui/pokemon-info";
import { LightColors, TextColors } from "@/constants/theme";
import useFetchPokemonById from "@/features/fetch-pokemon-by-id/use-fetch-pokemon-by-id";
import { AppFonts } from "@/shared/ui/fonts";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Image as ExpoImage } from "expo-image";
import {
  ActivityIndicator,
  ImageBackground,
  useWindowDimensions,
  View,
} from "react-native";
import { TabBar, TabBarItem, TabView } from "react-native-tab-view";
import AboutPage from "./about-page";
import StatsPage from "./stats-page";
import EvolutionPage from "./evolution-page";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const routes = [
  { key: "about", title: "About" },
  { key: "stats", title: "Stats" },
  { key: "evolution", title: "Evolution" },
];

const renderTabItem = (props: any) => {
  const { key, ...tabBarItemProps } = props;
  const routeIndex = props.navigationState.routes.findIndex(
    (r: any) => r.key === props.route.key,
  );
  const isSelected = props.navigationState.index === routeIndex;

  return isSelected ? (
    <ImageBackground
      source={require("@/assets/images/mask_pokeball.png")}
      imageStyle={{ resizeMode: "center" }}
    >
      <TabBarItem
        {...tabBarItemProps}
        labelStyle={{
          color: TextColors.white,
          fontSize: 16,
          fontFamily: AppFonts.bold,
          opacity: 1,
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
        opacity: 0.5,
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
      style={{ backgroundColor: "transparent" }}
    />
  );
};

export default function PokemonDetailsPage() {
  const { id } = useLocalSearchParams();
  const { pokemon, loading } = useFetchPokemonById(String(id));
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  const renderScene = useCallback(
    ({ route }: any) => {
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
    },
    [pokemon],
  );

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={LightColors.primary} />
        </View>
      )}
      {pokemon && (
        <View
          className="flex-1"
          style={{
            backgroundColor: pokemon.types[0].backgroundColor,
            paddingTop: insets.top,
          }}
        >
          <View className="relative h-[240px]">
            <View className="absolute top-0 right-0 left-0">
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
              className="absolute right-0 w-[65px] h-[140px]"
              style={{ top: "55%" }}
              imageStyle={{ resizeMode: "contain" }}
            />
            <View className="mt-4 ml-10 flex-row items-center h-full">
              <ImageBackground
                source={require("@/assets/images/circle.png")}
                className="mr-6"
              >
                <ExpoImage
                  source={{ uri: pokemon.image }}
                  placeholder={require("@/assets/images/silhouette.png")}
                  placeholderContentFit="contain"
                  style={{ width: 125, height: 125 }}
                  cachePolicy="memory-disk"
                />
              </ImageBackground>
              <PokemonInfo
                className="flex-1"
                id={`#${pokemon.id}`}
                name={pokemon.name}
                types={pokemon.types}
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
      )}
    </View>
  );
}
