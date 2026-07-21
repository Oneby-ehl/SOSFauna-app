import { Platform } from "react-native";

import HomeNative from "./Home.native";
import HomeWeb from "./Home.web";

const Home = Platform.OS === "web" ? HomeWeb : HomeNative;

export default Home;
