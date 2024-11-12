import { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

/**
 * Custom hook to manage the state and logic for a live search in the header.
 */
const useHeader = () => {
  const navigate = useNavigate();
  const [val, setVal] = useState<string>('');

  /**
   * Perform search by navigating to the search results page with updated query.
   *
   * @param query - the search query.
   */
  const performSearch = (query: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('search', query);

    navigate(`/home?${searchParams.toString()}`);
  };

  // Debounced version of performSearch to limit excessive navigation calls.
  const debouncedSearch = debounce(performSearch, 300);

  // Cleanup debounce on unmount
  useEffect(
    () => () => {
      debouncedSearch.cancel();
    },
    [],
  );

  /**
   * Function to handle changes in the input field and initiate live search.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    debouncedSearch(e.target.value);
  };

  return {
    val,
    setVal,
    handleInputChange,
  };
};

export default useHeader;
