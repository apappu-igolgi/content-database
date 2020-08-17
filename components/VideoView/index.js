
import styles from '../../styles/VideoView.module.scss';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useState, useEffect, useMemo } from 'react';
import { IconButton } from '@material-ui/core';

const hardcodedFields = ['Filename', 'Description'];

const VideoView = ({ videos, fields }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedVideo = videos[selectedIndex] || {};

  const remainingFields = useMemo(() => fields.filter(field => !hardcodedFields.includes(field.key)), [fields]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [videos]);

  if (videos.length == 0) {
    return <></>
  }

  return (
    <div className={styles['video-view']}>
      <div className={styles['video-select']}>
        <IconButton color="primary" disabled={selectedIndex === 0} onClick={() => setSelectedIndex(selectedIndex - 1)}>
          <ChevronLeft className={styles.icon} />
        </IconButton>
        <span>{selectedIndex + 1}/{videos.length}</span>
        <IconButton color="primary" disabled={selectedIndex === videos.length - 1} onClick={() => setSelectedIndex(selectedIndex + 1)}>
          <ChevronRight className={styles.icon} />
        </IconButton>
      </div>

      <div className={styles.video}>
        <div className={styles.filename}>{selectedVideo['Filename']}</div>
        <div className={styles.description}>{selectedVideo['Description']}</div>
        <div className={styles.fields}>
          {remainingFields.filter(({ key }) => ![undefined, ''].includes(selectedVideo[key])).map(({ key, type }) => (
            <div className={styles.field} key={key}>
              <div className={styles.name}>{key}</div>
              <div className={styles.value}>{selectedVideo[key]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoView