import { View, Text } from 'react-native';
import React from 'react';
import { LineLayer, ShapeSource } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

type Props = {
  coordinates: Position[];
};

const LineRoute = ({ coordinates }: Props) => {
  return (
    <ShapeSource
      id="routeSource"
      lineMetrics
      shape={{
        properties: {},
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
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
  );
};

export default LineRoute;
