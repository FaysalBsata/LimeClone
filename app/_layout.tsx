import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '~/providers/AuthProvider';
import RideProvider from '~/providers/RideProvider';
import ScooterProvider from '~/providers/ScooterProvider';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ScooterProvider>
          <RideProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </RideProvider>
        </ScooterProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
