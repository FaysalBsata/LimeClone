import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import getDirections from '~/services/directions';
import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import { Route, Scooter } from '~/types/types';
type AuthContextProps = {
  selectedScooter: Scooter;
  setSelectedScooter: (scooter: Scooter) => void;
  direction: Route;
  directionCoordinates: Array<number[]>;
  duration: number;
  distance: number;
  isNearby: boolean;
};
const ScooterContext = createContext<AuthContextProps | null>(null);
export default function ScooterProvider({ children }: PropsWithChildren) {
  const [selectedScooter, setSelectedScooter] = useState<Scooter>();
  const [direction, setDirection] = useState<Route>();
  const [isNearby, setIsNearby] = useState(false);
  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const watchLocation = async () => {
      subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
        const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
        const to = point([selectedScooter!.long, selectedScooter!.lat]);
        const distance = getDistance(from, to, { units: 'meters' });
        if (distance < 100) {
          setIsNearby(true);
        }
      });
    };

    if (selectedScooter) {
      watchLocation();
    }

    // unsubscribe
    return () => {
      subscription?.remove();
    };
  }, [selectedScooter]);
  useEffect(() => {
    const fetchDirections = async () => {
      const myLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });
      const newDirection = await getDirections(
        [myLocation.coords.longitude, myLocation.coords.latitude],
        [selectedScooter!.long, selectedScooter!.lat]
      );
      setDirection(newDirection);
    };
    if (selectedScooter) {
      fetchDirections();
    }
  }, [selectedScooter]);
  return (
    <ScooterContext.Provider
      value={{
        selectedScooter,
        setSelectedScooter,
        direction,
        directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates,
        duration: direction?.routes?.[0]?.duration,
        distance: direction?.routes?.[0]?.distance,
        isNearby,
      }}>
      {children}
    </ScooterContext.Provider>
  );
}
export function useScooter() {
  const context = useContext(ScooterContext);
  if (!context) {
    throw new Error('Scooter must be used with ScooterProvider');
  }

  return context;
}
