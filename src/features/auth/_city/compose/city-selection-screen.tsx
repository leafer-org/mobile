import { useRegistrationState } from '../../model/registration-store';
import { useCompleteRegistration } from '../../model/use-complete-registration';
import { useCities } from '../model/use-cities';
import { useCitySelection } from '../model/use-city-selection';
import { useUserLocation } from '../model/use-user-location';
import { CityList } from '../ui/city-list';
import { CitySearchInput } from '../ui/city-search-input';
import { CitySelectionLayout } from '../ui/city-selection-layout';
import { Button } from '@/kernel/ui/button';

export function CitySelectionScreen({ onComplete }: { onComplete: () => void }) {
  const citiesQuery = useCities();
  const location = useUserLocation();
  const { registrationSessionId } = useRegistrationState();

  const completeRegistration = useCompleteRegistration({
    onSuccess: onComplete,
  });

  const { search, setSearch, filteredCities, selectedCity, setSelectedCity, handleProceed } =
    useCitySelection({
      cities: citiesQuery.data ?? [],
      lat: location.lat,
      lng: location.lng,
      onProceed: (cityId, lat, lng) => {
        completeRegistration.complete({
          registrationSessionId: registrationSessionId ?? '',
          cityId,
          lat,
          lng,
        });
      },
    });

  return (
    <CitySelectionLayout
      search={<CitySearchInput value={search} onChangeText={setSearch} />}
      list={
        <CityList
          cities={filteredCities}
          selectedCityId={selectedCity?.id}
          onSelect={setSelectedCity}
          isLoading={citiesQuery.isPending}
        />
      }
      actions={
        <Button
          onPress={handleProceed}
          disabled={!selectedCity || completeRegistration.isPending}
          loading={completeRegistration.isPending}
        >
          Продолжить
        </Button>
      }
    />
  );
}
