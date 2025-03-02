import { ExpoRoot } from "expo-router";
import { registerRootComponent } from "expo";

function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

export default App;

registerRootComponent(App);
