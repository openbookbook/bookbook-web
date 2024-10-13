import React from 'react';
import styles from './ToggleText.module.css';

const ToggleText = ({ onClick, children }) => {
  return (
    <span
      className={`ToggleText ${styles.ToggleText}`}
      role="button"
      onClick={onClick}
    >{children}</span>
  );
};

export default ToggleText;
