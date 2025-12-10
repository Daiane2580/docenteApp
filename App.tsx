import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FormScreen from "./src/screens/FormScreen";
import SavedFormsScreen from "./src/screens/SavedFormsScreen";
import PreviewScreen from "./src/screens/PreviewScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Form">
        <Stack.Screen
          name="Form"
          component={FormScreen}
          options={{ title: "SENAI - Ação Docente" }}
        />
        <Stack.Screen
          name="Saved"
          component={SavedFormsScreen}
          options={{ title: "Formulários Salvos" }}
        />
        <Stack.Screen
          name="Preview"
          component={PreviewScreen}
          options={{ title: "Visualização" }}
        />
        {/* teste */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
