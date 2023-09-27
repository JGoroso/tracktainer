import { useGoogleMapsScript } from 'use-google-maps-script'
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"

const libraries = ["places"]

export default function Searchbox({ onSelectAddress, defaultValue }) {

  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "",
    libraries
  })

  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>

  // hasta aca
  return (
    <ReadySearchBox
      onSelectAddress={onSelectAddress}
      defaultValue={defaultValue}
    />
  )
}

function ReadySearchBox({ onSelectAddress, defaultValue }) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutoComplete({ debounce: 300, defaultValue })

  const handleChange = (e) => {
    setValue(e.target.value)
    if (e.target.value == "") {
      onSelectAddress("", null, null)
    }
  }

  const handleSelect = async (address) => {
    setValue(address, false)
    clearSuggestions()
    try {
      const results = await getGeocode({ address })
      const { lat, lng } = await getLatLng(results[0])
      onSelectAddress(address, lat, lng)
    } catch (error) {
      console.error("Error: ", error)
    }

  }

  return (
    <Combobox onSelect={handleSelect} className={"w-full border-4 border-r-4 mt-2"} >
      <ComboboxInput
        id="search"
        value={value}
        onChange={handleChange}
        disabled={!ready}
        className={"w-full"}
        placeholder='Buscar una direccion'
        autoComplete='off'
      />
      <ComboboxPopover className="relative bg-slate-200">
        <ComboboxList>
          {status == "OK" && data.slice(0, 2).map(({ place_id, description }) =>
            <ComboboxOption key={place_id} value={description} />)}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox >
  )
}
