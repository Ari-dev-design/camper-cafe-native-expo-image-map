import { Slot } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <ImageBackground
      source={{ uri: "https://cdn.freecodecamp.org/curriculum/css-cafe/beans.jpg" }}
      style={styles.bg}
    >
      <Slot />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
