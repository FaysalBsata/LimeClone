import React from 'react';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';

import { useScooter } from '~/providers/ScooterProvider';
import LineRoute from './LineRoute';
import ScooterMarker from './ScooterMarker';
const accessToken = process.env.EXPO_PUBLIC_MAPBOX_KEY || '';
Mapbox.setAccessToken(accessToken);
const Map = () => {
  const { directionCoordinates } = useScooter();
  console.log(process.env.EXPO_PUBLIC_MAPBOX_KEY);
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={16} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
      <ScooterMarker />
      {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
    </MapView>
  );
};

export default Map;
