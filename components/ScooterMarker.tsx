import { View, Text, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { useScooter } from '~/providers/ScooterProvider';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
// @ts-ignore
import pin from '~/assets/pin.png';
import { featureCollection, point } from '@turf/helpers';
import { Scooter } from '~/types/types';
const ScooterMarker = () => {
  const { setSelectedScooter, nearByScooters } = useScooter();
  const points = nearByScooters.map((scooter: Scooter) =>
    point([scooter.long, scooter.lat], { scooter })
  );
  const onPointPress = async (event: OnPressEvent) => {
    if (event?.features?.[0]?.properties?.scooter) {
      setSelectedScooter(event.features[0].properties.scooter);
    }
  };

  return (
    <ShapeSource id="scooters" cluster shape={featureCollection(points)} onPress={onPointPress}>
      <SymbolLayer
        id="clusters-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 18,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />
      <CircleLayer
        id="clusters"
        belowLayerID="clusters-count"
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: 20,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />

      <SymbolLayer
        id="scooter-icons"
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'pin',
          iconSize: 0.5,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ pin }} />
    </ShapeSource>
  );
};

export default ScooterMarker;
