import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Mapbox, {
  Camera,
  CircleLayer,
  Images,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
// @ts-ignore
import pin from '~/assets/pin.png';
import scooters from '~/data/scooters.json';
import { featureCollection, point } from '@turf/helpers';
import * as Location from 'expo-location';
import getDirections from '~/services/directions';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
type Props = {};
const accessToken = process.env.EXPO_PUBLIC_MAPBOX_KEY || '';
Mapbox.setAccessToken(accessToken);
const Map = (props: Props) => {
  const points = scooters.map((scooter) => point([scooter.long, scooter.lat]));
  const [direction, setDirection] = useState(null);
  const directionCoordinates = direction?.routes?.[0]?.geometry?.coordinates;

  const onPointPress = async (event: OnPressEvent) => {
    const myLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
    });
    const newDirection = await getDirections(
      [myLocation.coords.longitude, myLocation.coords.latitude],
      [event.coordinates.longitude, event.coordinates.latitude]
    );
    setDirection(newDirection);
  };
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={16} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
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
      {directionCoordinates && (
        <ShapeSource
          id="routeSource"
          lineMetrics
          shape={{
            properties: {},
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: directionCoordinates,
            },
          }}>
          <LineLayer
            id="exampleLineLayer"
            style={{
              lineColor: '#42A209',
              lineCap: 'round',
              lineJoin: 'round',
              lineWidth: 7,
              lineDasharray: [1, 2],
            }}
          />
        </ShapeSource>
      )}
    </MapView>
  );
};

export default Map;
