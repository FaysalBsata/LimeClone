import { Stack, Link } from 'expo-router';
import Map from '~/components/Map';
import { StatusBar } from 'expo-status-bar';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { Text } from 'react-native';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';
export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <Map />
      <SelectedScooterSheet />
      <StatusBar style="inverted" />
    </>
  );
}
