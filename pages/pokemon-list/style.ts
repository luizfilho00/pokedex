import { TextColors } from '@/constants/theme';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  imageBackground: {
    height: "80%",
    width: "100%",
    resizeMode: "contain",
    position: "absolute",
    top: -30,
  },
  header: {
    flex: 1,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    paddingHorizontal: 16,
    color: TextColors.black,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    paddingHorizontal: 16,
    paddingTop: 10,
    color: TextColors.grey,
  },
  iconButtons: {
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 48,
    gap: 8,
  },
  searchBar: {
    marginTop: 24,
    // marginBottom: 20,
    marginHorizontal: 16,
  },
  list: {
    flex: 1,
    marginBottom: 16,
  },
  error: {
    flex: 1,
    alignSelf: "center",
  },
  progress: {
    flex: 1,
    alignSelf: "center",
  },
});
