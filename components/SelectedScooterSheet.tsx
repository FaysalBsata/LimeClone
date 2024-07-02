import { View, Text, Image } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useScooter } from '~/providers/ScooterProvider';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Button } from './Button';

const SelectedScooterSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const { selectedScooter, duration, distance, isNearby } = useScooter();
  useEffect(() => {
    if (selectedScooter) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [selectedScooter]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={[250]}
      enableDynamicSizing
      index={-1}
      backgroundStyle={{ backgroundColor: '#414442' }}
      enablePanDownToClose>
      <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
        <View style={{ flexDirection: 'row', padding: 10, gap: 10, alignItems: 'center' }}>
          <Image source={require('~/assets/scooter.png')} style={{ width: 75, height: 75 }} />
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Lime - S</Text>
            <Text style={{ color: 'gray', fontSize: 18 }}>
              id-{selectedScooter?.id} · Kind Abdullah Avenue
            </Text>
          </View>
          <View style={{ gap: 5 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                alignSelf: 'flex-start',
              }}>
              <FontAwesome6 name="flag-checkered" size={18} color="#42E100" />
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                {(distance / 1000).toFixed(1)} km
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                alignSelf: 'flex-start',
              }}>
              <FontAwesome6 name="clock" size={18} color="#42E100" />
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                {(duration / 60).toFixed(0)} min
              </Text>
            </View>
          </View>
        </View>
        {/* Buttons */}
        <View>
          <Button title="Start Journey" onPress={() => {}} disabled={!isNearby} />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default SelectedScooterSheet;
