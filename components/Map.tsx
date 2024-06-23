import { View, Text } from 'react-native';
import React from 'react';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
type Props = {};
const accessToken = process.env.EXPO_PUBLIC_MAPBOX_KEY || '';
Mapbox.setAccessToken(accessToken);
const Map = (props: Props) => {
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={16} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
    </MapView>
  );
};

export default Map;
