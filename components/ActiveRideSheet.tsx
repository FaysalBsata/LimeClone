import { View, Text } from 'react-native';
import React, { useEffect, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRide } from '~/providers/RideProvider';
import { Button } from './Button';

type ActiveRideSheetProps = {};

const ActiveRideSheet = (props: ActiveRideSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { ride, finishRide } = useRide();
  useEffect(() => {
    if (ride) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [ride]);
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={[250]}
      enableDynamicSizing
      index={-1}
      backgroundStyle={{ backgroundColor: '#414442' }}
      enablePanDownToClose>
      <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
        <Text>ActiveRideSheet</Text>
        <View>
          <Button
            title="Finish Journey"
            onPress={() => {
              finishRide();
            }}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ActiveRideSheet;
