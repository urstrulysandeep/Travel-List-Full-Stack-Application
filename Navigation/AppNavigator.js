import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Createtripscreen from "../Screens/Createtripscreen";
import Mytripscreen from "../Screens/Mytripscreen";
import TripDetailScreen from "../Screens/TripDetailScreen";
import EditTripscreen from "../Screens/EditTripscreen";
import SignupScreen from "../Screens/SignupScreen";
import LoginScreen from "../Screens/LoginScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Sign Up" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="My Trips" component={Mytripscreen} />
        <Stack.Screen name="Trip Details" component={TripDetailScreen} />
        <Stack.Screen name="Create Trip" component={Createtripscreen} />
        <Stack.Screen name="Edit Trip" component={EditTripscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
