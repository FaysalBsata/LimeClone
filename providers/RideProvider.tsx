import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { useAuth } from './AuthProvider';
import { Alert } from 'react-native';
type RideContextProps = {
  ride?: any;
  startRide?: (scooterId: number) => Promise<void>;
  finishRide?: () => Promise<void>;
};
const RideContext = createContext<RideContextProps>({});
export default function RideProvider({ children }: PropsWithChildren) {
  const [ride, setRide] = useState();
  const { userId } = useAuth();
  useEffect(() => {
    const fetchActiveRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .is('finished_at', null)
        .single();
      if (data) {
        setRide(data);
      }
    };
    fetchActiveRide();
  }, []);
  const startRide = async (scooterId: number) => {
    if (ride) return;
    const { data, error } = await supabase
      .from('rides')
      .insert({
        user_id: userId,
        scooter_id: scooterId,
      })
      .select();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setRide(data?.[0]);
    }
  };
  const finishRide = async () => {
    if (!ride) return;
    const { data, error } = await supabase
      .from('rides')
      .update({ finished_at: new Date() })
      .eq('id', ride?.id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setRide(undefined);
    }
  };
  console.log('current ride', ride);
  return (
    <RideContext.Provider value={{ ride, startRide, finishRide }}>{children}</RideContext.Provider>
  );
}
export const useRide = () => useContext(RideContext);
