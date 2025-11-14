import PokemonInfo from "@/components/ui/pokemon-info";
import { Colors, TextColors } from "@/constants/theme";
import useFetchPokemonById from "@/features/fetch-pokemon-by-id/use-fetch-pokemon-by-id";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ImageBackground, Text, useWindowDimensions, View } from "react-native";
import { SceneMap, TabBar, TabBarItem, TabView } from "react-native-tab-view";

const renderScene = SceneMap({
  first: FirstPage,
  second: SecondPage,
  third: ThirdPage,
});

function FirstPage() {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 16,
        flex: 1,
      }}
    >
      <Text>First Page</Text>
    </View>
  );
}

function SecondPage() {
  return (
    <View>
      <Text>Second Page</Text>
    </View>
  );
}

function ThirdPage() {
  return (
    <View>
      <Text>Third Page</Text>
    </View>
  );
}

const routes = [
  { key: "first", title: "About" },
  { key: "second", title: "Stats" },
  { key: "third", title: "Evolution" },
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
        labelStyle={{ color: TextColors.white, fontSize: 16, fontWeight: 700 }}
      />
    </ImageBackground>
  ) : (
    <TabBarItem
      {...tabBarItemProps}
      labelStyle={{ color: TextColors.white, fontSize: 16, fontWeight: 700 }}
    />
  );
};

const renderTabBar = (props: any) => {
  const { key, ...tabBarProps } = props; 
  return (
    <TabBar
      {...tabBarProps}
      indicatorStyle={{ backgroundColor: Colors.light.primary }}
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

  return (
    pokemon && (
      <View
        style={{
          backgroundColor: pokemon?.types[0].backgroundColor,
          paddingTop: 96,
          flex: 1,
        }}
      >
        {/* FrameLayout equivalent - relative positioning container */}
        <View style={{ position: "relative", height: 140 }}>
          {/* Background pattern - positioned at the end */}
          <ImageBackground
            source={require("@/assets/images/card_pattern.png")}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              width: 200,
              height: 200,
              transform: [{ translateY: -100 }],
            }}
            imageStyle={{
              resizeMode: "contain",
            }}
          />

          {/* Content - centered */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
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
          style={{
            marginTop: 48,
          }}
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
