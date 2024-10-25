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

      {/* Accessibility options go here */}
      <label>
        Text Size:
        <select>
          <option value='small'>Small</option>
          <option value='medium'>Medium</option>
          <option value='large'>Large</option>
        </select>
      </label>

      <label>
        Dark Mode:
        <input type='checkbox' />
      </label>

      <label>
        High Contrast Mode:
        <input type='checkbox' />
      </label>

      <label>
        Screen Reader Mode:
        <input type='checkbox' />
      </label>

      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

export default AccessibilityPopup;
