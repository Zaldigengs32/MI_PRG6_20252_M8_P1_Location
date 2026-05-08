import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { AuthProvider, AuthContext } from './AuthContext';

import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import DetailScreen from './DetailScreen';
import AboutScreen from './AboutScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTabIcon = ({ color }) => <MaterialIcons name="home" size={24} color={color} />;
HomeTabIcon.propTypes = { color: PropTypes.string.isRequired };

const HistoryTabIcon = ({ color }) => <MaterialIcons name="history" size={24} color={color} />;
HistoryTabIcon.propTypes = { color: PropTypes.string.isRequired };

const ProfileTabIcon = ({ color }) => <MaterialIcons name="person" size={24} color={color} />;
ProfileTabIcon.propTypes = { color: PropTypes.string.isRequired };
function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistoryList"
        component={HistoryScreen}
        options={{ title: 'Riwayat Absensi' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Detail Informasi' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#0056A0', headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: HomeTabIcon
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{
          tabBarLabel: 'Riwayat',
          tabBarIcon: HistoryTabIcon
        }}
      />

      <Tab.Screen
        name="AboutTab"
        component={AboutScreen}
        options={{
          tabBarLabel: 'Tentang',
          tabBarIcon: ProfileTabIcon
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function MainApp() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}