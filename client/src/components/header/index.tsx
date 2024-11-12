import React, { useState } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import useHeader from '../../hooks/useHeader';
import AccessibilityPopup from './settings';

/**
 * Header component with live search functionality.
 */
const Header = () => {
  const { val, handleInputChange } = useHeader();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div id='header' className='header'>
      <div></div>
      <div className='title'>Fake Stack Overflow</div>
      <input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
      />
      <button onClick={togglePopup} aria-label='Open accessibility settings'>
        <FontAwesomeIcon icon={faCog} size='lg' />
      </button>
      {isPopupOpen && <AccessibilityPopup onClose={togglePopup} />}
    </div>
  );
};

export default Header;
