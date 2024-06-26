import { View, Text } from 'react-native';
import React from 'react';
import Mapbox, {
  Camera,
  CircleLayer,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
// @ts-ignore
import pin from '~/assets/pin.png';
import scooters from '~/data/scooters.json';
import { featureCollection, point } from '@turf/helpers';
type Props = {};
const accessToken = process.env.EXPO_PUBLIC_MAPBOX_KEY || '';
Mapbox.setAccessToken(accessToken);
const Map = (props: Props) => {
  const points = scooters.map((scooter) => point([scooter.long, scooter.lat]));
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={16} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
      <ShapeSource id="scooters" cluster shape={featureCollection(points)}>
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
    </MapView>
  );
};

export default Map;
