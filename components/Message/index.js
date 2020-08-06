import React from 'react';
import styles from '../../styles/Message.module.scss'

export const Message = ({ text, className, style }) => (
  <div className={styles.message}>
    <span className={className} style={style}>{text}</span>
  </div>
);