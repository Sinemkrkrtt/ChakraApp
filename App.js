// 1. React Navigation Ana Sağlayıcısı
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChakraProvider } from './src/ChakraContext';
import HomeScreen from './src/HomeScreen';
import RootChakraDetail from './src/RootChakraDetail';
import SacralChakraDetail from './src/SacralChakraDetail';
import SolarPlexusDetail from './src/SolarPlexusDetail';
import HeartChakraDetail from './src/HeartChakraDetail';
import ThroatChakraDetail from './src/ThroatChakraDetail';
import ThirdEyeChakraDetail from './src/ThirdEyeChakraDetail';
import CrownChakraDetail from './src/CrownChakraDetail';
import DailyMission from './src/DailyMission';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ChakraProvider>
      <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Kendi özel header'larımızı yaptığımız için varsayılan üst çubuğu gizliyoruz
          animation: 'fade',  // Premium bir geçiş efekti
        }}
      >
        {/* ANA SAYFA */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* DETAY SAYFALARI */}
        <Stack.Screen name="RootChakraDetail" component={RootChakraDetail} />
        <Stack.Screen name="SacralChakraDetail" component={SacralChakraDetail} />
         <Stack.Screen name="SolarPlexusDetail" component={SolarPlexusDetail} />
        <Stack.Screen name="HeartChakraDetail" component={HeartChakraDetail} />
        <Stack.Screen name="ThroatChakraDetail" component={ThroatChakraDetail} />
        <Stack.Screen name="ThirdEyeChakraDetail" component={ThirdEyeChakraDetail} />
        <Stack.Screen name="CrownChakraDetail" component={CrownChakraDetail} />
        <Stack.Screen name="DailyMission" component={DailyMission} />
        
      </Stack.Navigator>
    </NavigationContainer>
    </ChakraProvider>
  );
}