import React, { useContext, useState } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import useHeader from '../../hooks/useHeader';
import AccessibilityPopup from './settings';
import UserContext from '../../contexts/UserContext'; // Adjust the path to your AccountContext

/**
 * Header component with live search functionality.
 */
const Header = () => {
  const { val, handleInputChange } = useHeader();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const userContextValue = useContext(UserContext);
  const account = userContextValue?.account;
  const setAccount = userContextValue?.setAccount;

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
      {isPopupOpen && account && setAccount && (
        <AccessibilityPopup
          account={account} // Ensure account is defined and accessible in this scope
          setAccount={setAccount} // Ensure setAccount is a function updating the account state
          onClose={togglePopup}
        />
      )}
    </div>
  );
};

export default Header;
