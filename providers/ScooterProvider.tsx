import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import getDirections from '~/services/directions';
import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import { Route, Scooter } from '~/types/types';
import { supabase } from '~/lib/supabase';
import { Alert } from 'react-native';

type AuthContextProps = {
  selectedScooter: Scooter | undefined;
  setSelectedScooter: (scooter: Scooter | undefined) => void;
  direction: Route | undefined;
  directionCoordinates: Array<number[]> | undefined;
  duration: number | undefined;
  distance: number | undefined;
  isNearby: boolean;
  nearByScooters: Scooter[];
};
const ScooterContext = createContext<AuthContextProps | null>(null);
export default function ScooterProvider({ children }: PropsWithChildren) {
  const [selectedScooter, setSelectedScooter] = useState<Scooter | undefined>(undefined);
  const [direction, setDirection] = useState<Route | undefined>(undefined);
  const [isNearby, setIsNearby] = useState(false);
  const [nearByScooters, setNearByScooters] = useState<Scooter[]>([]);
  useEffect(() => {
    const fetchScoters = async () => {
      const location = await Location.getCurrentPositionAsync({});
      const { data, error } = await supabase.rpc('nearby_scooters', {
        lat: location.coords.latitude,
        long: location.coords.longitude,
        max_dist_meters: 1000,
      });
      if (error) {
        Alert.alert('Error', error.message);
      }
      setNearByScooters(data);
    };
    fetchScoters();
  }, []);
  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const watchLocation = async () => {
      subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
        if (selectedScooter) {
          const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
          const to = point([selectedScooter.long, selectedScooter.lat]);
          const distance = getDistance(from, to, { units: 'meters' });
          if (distance < 100) {
            setIsNearby(true);
          }
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
      if (selectedScooter) {
        const newDirection = await getDirections(
          [myLocation.coords.longitude, myLocation.coords.latitude],
          [selectedScooter.long, selectedScooter.lat]
        );
        setDirection(newDirection);
      }
    };
    if (selectedScooter) {
      fetchDirections();
    }
  }, [selectedScooter]);
  return (
    <ScooterContext.Provider
      value={{
        nearByScooters,
        selectedScooter,
        setSelectedScooter,
        direction,
        directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates ?? undefined,
        duration: direction?.routes?.[0]?.duration ?? undefined,
        distance: direction?.routes?.[0]?.distance ?? undefined,
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
