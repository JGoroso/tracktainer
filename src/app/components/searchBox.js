import { Combobox } from '@headlessui/react'
import { useState } from 'react'
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete'


export default function Searchbox({ onSelectAddress }) {
  return (
    <ReadySearchBox
      onSelectAddress={onSelectAddress}
    />
  )
}

function ReadySearchBox({ onSelectAddress }) {

  const cba = { lat: -31.408, lng: -64.192 }
  // Create a bounding box with sides from the center point
  const defaultBounds = {
    north: cba.lat + 0.1,
    south: cba.lat - 0.1,
    east: cba.lng + 0.1,
    west: cba.lng - 0.1,
  }

  const {
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutoComplete({
    debounce: 300,
    requestOptions: {
      bounds: defaultBounds,
      componentRestrictions: { country: "ar" }
    }
  })

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
    <Combobox onChange={handleSelect}>
      <Combobox.Input className="mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" onChange={handleChange} placeholder='Agregue una direccion 📍' />
      <Combobox.Options className="max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {status == "OK" && data.slice(0, 2).map(({ place_id, description }) => <Combobox.Option className="cursor-default select-none py-1 pl-5 pr-2" key={place_id} value={description}>
          {description}
        </Combobox.Option>)}
      </Combobox.Options>
    </Combobox>
  )
}
