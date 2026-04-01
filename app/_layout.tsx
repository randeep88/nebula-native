import RootNavigation from "@/components/RootNavigation";
import { OptionsSheetProvider } from "@/utils/OptionsSheetContext";
import { PlayerProvider } from "@/utils/usePlayer";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { ToastProvider } from "react-native-toast-notifications";
import "./global.css";

Sentry.init({
  dsn: "https://2b4e7cf84e0ea82735d50d345efd37da@o4511142153027584.ingest.de.sentry.io/4511142157615184",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

const theme = {
  ...MD3LightTheme,
  roundness: 6,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#00CDAC",
    secondary: "#00CDAC",
  },
};

const queryClient = new QueryClient();

export default Sentry.wrap(function RootLayout() {
  const path = usePathname();
  const isPlayerModal = path === "/player-modal";

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OptionsSheetProvider>
          <ThemeProvider value={DarkTheme}>
            <QueryClientProvider client={queryClient}>
              <ToastProvider
                offset={isPlayerModal ? 90 : 120}
                style={{ width: "100%" }}
                placement="bottom"
                animationType="zoom-in"
                normalColor="white"
                dangerColor="red"
                textStyle={{ color: "black" }}
              >
                <PlayerProvider>
                  <RootNavigation />
                  <StatusBar style="light" />
                </PlayerProvider>
              </ToastProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </OptionsSheetProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
});
