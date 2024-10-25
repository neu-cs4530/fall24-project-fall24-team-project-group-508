// AccessibilityPopup.js
import React from 'react';
import './index.css';

interface AccessibilityPopupProps {
  onClose: () => void;
}

const AccessibilityPopup: React.FC<AccessibilityPopupProps> = ({ onClose }) => (
  <div className='popup'>
    <div className='popup-content'>
      <h2>Accessibility Options</h2>

      {/* Accessibility options, each on its own line */}
      <div className='setting-option'>
        <label>
          Text Size:
          <select>
            <option value='small'>Small</option>
            <option value='medium'>Medium</option>
            <option value='large'>Large</option>
          </select>
        </label>
      </div>

      <div className='setting-option'>
        <label className='checkbox-label'>
          <input type='checkbox' className='checkbox' />
          High Contrast Mode
        </label>
      </div>

      <div className='setting-option'>
        <label className='checkbox-label'>
          <input type='checkbox' className='checkbox' />
          Screen Reader Mode
        </label>
      </div>

      <button onClick={onClose} className='close-btn'>
        Close
      </button>
    </div>
  </div>
);

export default AccessibilityPopup;
