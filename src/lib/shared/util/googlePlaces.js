import { useState, useEffect } from "react";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import { isNumber } from "./helpers";

/* ---------------- FORMAT AUTOCOMPLETE SUGGESTIONS ---------------- */

export function trimAutocompleteSuggestion(suggestion) {
  const { description } = suggestion;
  // discards any following parts of the description (i.e., the land)
  const [street, city] = description.split(",");
  const cityWithoutZip = city.replace(/^\s*\d{5}\s/, "");
  return `${street}, ${cityWithoutZip}`;
}

/* ---------------- FORMAT GEOCODES OBJECTS ---------------- */

export function formatGeocodeObject(
  geocodeObject,
  { excludeStreet, excludeZip, excludeCity } = {}
) {
  if (!geocodeObject) {
    return "";
  }
  let result = "";

  if (!excludeStreet) {
    result += `${geocodeObject.streetWithoutNumber} ${geocodeObject.streetNumber}`;
  }
  if (!excludeStreet && !excludeCity) {
    result += ", ";
  }
  if (!excludeCity) {
    if (!excludeZip) {
      result += `${geocodeObject.zip} `;
    }
    result += geocodeObject.city;
  }

  return result;
}

/* ---------------- GET RESULTS OF GEOCODES ---------------- */

export function validateGeocodeResult(geocodeResult) {
  const missingComponents = [];

  if (
    geocodeResult.address_components.find((comp) =>
      comp.types.includes("route")
    ) === undefined &&
    geocodeResult.address_components.find((comp) =>
      comp.types.includes("street_address")
    ) === undefined
  ) {
    missingComponents.push("Straßenname");
  }

  if (
    geocodeResult.address_components.find((comp) =>
      comp.types.includes("street_number")
    ) === undefined
  ) {
    missingComponents.push("Hausnummer");
  }

  if (
    geocodeResult.address_components.find((comp) =>
      comp.types.includes("locality")
    ) === undefined
  ) {
    missingComponents.push("Stadt");
  }

  return missingComponents;
}

export function getNumber(str) {
  let numberWasHit = false;
  let numberString = "";

  str.split(" ").forEach((part) => {
    if (isNumber(part.charAt(0))) {
      numberWasHit = true;
    }

    if (numberWasHit && part !== undefined) {
      numberString += part;
    }
  });

  return numberString || undefined;
}

export function getCity(geocodeResult) {
  let city = null;

  geocodeResult.address_components.forEach(({ long_name: name, types }) => {
    if (types.includes("locality")) {
      city = name;
    }
  });

  return city;
}

export function getStreetWithoutNumber(geocodeResult) {
  for (
    let index = 0;
    index < geocodeResult.address_components.length;
    index += 1
  ) {
    const addressComponent = geocodeResult.address_components[index];
    if (
      addressComponent.types.includes("route") ||
      addressComponent.types.includes("street_address")
    ) {
      return addressComponent.long_name;
    }
  }

  return null;
}

export function getStreetNumber(geocodeResult) {
  for (
    let index = 0;
    index < geocodeResult.address_components.length;
    index += 1
  ) {
    const addressComponent = geocodeResult.address_components[index];
    if (addressComponent.types.includes("street_number")) {
      return addressComponent.long_name;
    }
  }

  return null;
}

export function getStreet(geocodeResult) {
  const street = getStreetWithoutNumber(geocodeResult);
  const streetNumber = getStreetNumber(geocodeResult);
  return streetNumber ? `${street} ${streetNumber}` : street;
}

export function getZipCode(geocodeResult) {
  let zipCode = null;

  geocodeResult.address_components.forEach(({ long_name: name, types }) => {
    if (types.includes("postal_code")) {
      zipCode = name;
    }
  });

  return zipCode;
}

export async function fetchGeocodeResultsByAddress(address) {
  const geocodeResults = await geocodeByAddress(address);
  if (geocodeResults.length < 1) {
    return null;
  }

  const [geocodeResult] = geocodeResults;
  const { lat: latitude, lng: longitude } = await getLatLng(geocodeResult);

  const streetWithoutNumber = getStreetWithoutNumber(geocodeResult);
  let streetNumber = getStreetNumber(geocodeResult);
  const zip = getZipCode(geocodeResult);
  const city = getCity(geocodeResult);

  // Hacky check if gecode cuts letter from number, if so use original address input, but only if check afterwards succeeds
  const enteredAddress = address.split(",")[0];
  const geocodeAddress = geocodeResult.formatted_address.split(",")[0];

  // if address matched now, change the number to input number
  if (enteredAddress !== geocodeAddress) {
    const enteredStreetNumber = getNumber(enteredAddress);

    if (`${streetWithoutNumber} ${enteredStreetNumber}` === enteredAddress) {
      streetNumber = enteredStreetNumber;
    }
  }

  return {
    streetWithoutNumber,
    streetNumber,
    zip,
    city,
    latitude,
    longitude,
    id: geocodeResult.place_id,
    ...geocodeResult,
  };
}

export async function fetchValidatedGeocodeResults({
  streetWithoutNumber: enteredStreetWithoutNumber,
  streetNumber: enteredStreetNumber,
  zip: enteredZip,
  city: enteredCity,
}) {
  const address = `${enteredStreetWithoutNumber} ${enteredStreetNumber}, ${enteredZip} ${enteredCity}`;

  const geocodeResults = await fetchGeocodeResultsByAddress(address);
  if (!geocodeResults) {
    return null;
  }

  // sanity check of results
  const {
    streetWithoutNumber: fetchedStreetWithoutNumber,
    streetNumber: fetchedStreetNumber,
    zip: fetchedZip,
    city: fetchedCity,
  } = geocodeResults;

  if (
    enteredStreetWithoutNumber !== fetchedStreetWithoutNumber ||
    enteredStreetNumber !== fetchedStreetNumber ||
    enteredZip !== fetchedZip ||
    enteredCity !== fetchedCity
  ) {
    return null;
  }

  return geocodeResults;
}

export async function fetchGeocodeResultsByPlaceId(placeId) {
  const geocodeResults = await geocodeByPlaceId(placeId);
  if (geocodeResults.length < 1) {
    return null;
  }

  const [geocodeResult] = geocodeResults;
  const zipCode = getZipCode(geocodeResult);
  const city = getCity(geocodeResult);
  const street = getStreet(geocodeResult);
  const { lat: latitude, lng: longitude } = await getLatLng(geocodeResult);

  return {
    ...geocodeResult,
    street,
    zip: zipCode,
    city,
    id: geocodeResult.place_id,
    description: geocodeResult.formatted_address,
    latitude,
    longitude,
  };
}

export async function reverseGeocode(latitude, longitude) {
  const geocoder = new window.google.maps.Geocoder();
  const { OK } = window.google.maps.GeocoderStatus;

  try {
    return await new Promise((resolve, reject) => {
      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if (status !== OK) {
            reject(status);
            return;
          }

          resolve(results);
        }
      );
    });
  } catch (e) {
    return null;
  }
}

// gets lat lng coordinates for a given address
export default function useGetLatLngFromAddress(address) {
  const [isLoading, setIsLoading] = useState(true);
  const [latLng, setLatLng] = useState({});

  useEffect(() => {
    const loadGeocodeResults = async () => {
      setIsLoading(true);
      try {
        const geocodeResults = await geocodeByAddress(address);

        const [geocodeResult] = geocodeResults;
        const latLngResult = await getLatLng(geocodeResult);

        setLatLng(latLngResult);
        setIsLoading(false);
      } catch (e) {
        setLatLng(undefined);
        setIsLoading(false);
      }
    };

    if (address) {
      loadGeocodeResults();
    }
  }, [address]);

  return {
    isLoading,
    latLng,
  };
}
