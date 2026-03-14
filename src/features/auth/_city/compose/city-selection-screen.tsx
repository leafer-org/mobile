import { useRegistrationDispatch } from '../../model/registration-store';
import { useCities } from '../model/use-cities';
import { useCitySelection } from '../model/use-city-selection';
import { useUserLocation } from '../model/use-user-location';
import { CityList } from '../ui/city-list';
import { CitySearchInput } from '../ui/city-search-input';
import { CitySelectionLayout } from '../ui/city-selection-layout';
import { Button } from '@/kernel/ui/button';

export function CitySelectionScreen({ onCitySelected }: { onCitySelected: () => void }) {
  const citiesQuery = useCities();
  const location = useUserLocation();
  const registrationDispatch = useRegistrationDispatch();

  const { search, setSearch, filteredCities, selectedCity, setSelectedCity, handleProceed } =
    useCitySelection({
      cities: citiesQuery.data ?? [],
      lat: location.lat,
      lng: location.lng,
      onProceed: (cityId, lat, lng) => {
        registrationDispatch({ type: 'citySelected', cityId, lat, lng });
        onCitySelected();
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
        <Button onPress={handleProceed} disabled={!selectedCity}>
          Продолжить
        </Button>
      }
    />
  );
}
