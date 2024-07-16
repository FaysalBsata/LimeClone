import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { useAuth } from './AuthProvider';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { point } from '@turf/helpers';
import { fetchDirectionBasedOnCoords } from '~/services/directions';
type RideContextProps = {
  ride?: any;
  startRide?: (scooterId: number) => Promise<void>;
  finishRide?: () => Promise<void>;
  rideRoute?: any;
};
const RideContext = createContext<RideContextProps>({});
export default function RideProvider({ children }: PropsWithChildren) {
  const [ride, setRide] = useState<any>();
  const [rideRoute, setRideRoute] = useState<any>([]);
  const { userId } = useAuth();
  useEffect(() => {
    const fetchActiveRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .is('finished_at', null)
        .limit(1)
        .single();
      if (data) {
        setRide(data);
      }
    };
    fetchActiveRide();
  }, []);
  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const watchLocation = async () => {
      subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
        if (ride) {
          setRideRoute((prev: any) => [
            ...prev,
            [newLocation?.coords?.longitude, newLocation?.coords?.latitude],
          ]);
        }
      });
    };

    if (ride) {
      watchLocation();
    }

    // unsubscribe
    return () => {
      subscription?.remove();
    };
  }, [ride]);
  const startRide = async (scooterId: number) => {
    if (ride) return;
    const { data, error } = await supabase
      .from('rides')
      .insert({
        user_id: userId,
        scooter_id: scooterId,
      })
      .select();
    console.log(data);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setRide(data?.[0]);
    }
  };
  const finishRide = async () => {
    if (!ride) return;
    const actualRoute = await fetchDirectionBasedOnCoords(rideRoute);
    const rideRouteCoords = actualRoute.matchings[0].geometry.coordinates;
    const rideRouteDuration = actualRoute.matchings[0].duration;
    const rideRouteDistance = actualRoute.matchings[0].distance;
    setRideRoute(actualRoute.matchings[0].geometry.coordinates);
    const { data, error } = await supabase
      .from('rides')
      .update({
        finished_at: new Date(),
        duration: rideRouteDuration,
        distance: rideRouteDistance,
        routeCoords: rideRouteCoords,
      })
      .eq('id', ride?.id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setRide(undefined);
    }
  };
  return (
    <RideContext.Provider value={{ ride, startRide, finishRide, rideRoute }}>
      {children}
    </RideContext.Provider>
  );
}
export const useRide = () => useContext(RideContext);
