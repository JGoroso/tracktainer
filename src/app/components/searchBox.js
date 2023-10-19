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
  // Create a bounding box with sides ~10km away from the center point
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
      <Combobox.Input className={"w-full border-2 border-b-stone-800 mt-2"} onChange={handleChange} placeholder='Agregue una direccion' />
      <Combobox.Options>
        {status == "OK" && data.slice(0, 2).map(({ place_id, description }) => <Combobox.Option key={place_id} value={description}>
          {description}
        </Combobox.Option>)}
      </Combobox.Options>
    </Combobox>
  )
}
