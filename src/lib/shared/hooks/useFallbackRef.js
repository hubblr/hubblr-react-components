import { useRef } from 'react';

export default function useFallbackRef(givenRef) {
  const fallbackRef = useRef();
  return givenRef || fallbackRef;
}
