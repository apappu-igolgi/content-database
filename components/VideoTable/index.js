import AutoSizer from 'react-virtualized-auto-sizer';
import { Checkbox, IconButton } from '@material-ui/core';
import { CancelOutlined } from '@material-ui/icons';
import { useMemo } from 'react';
import clsx from 'clsx';
import InfiniteLoader from 'react-window-infinite-loader';
import { ReactSortable } from 'react-sortablejs';

import styles from '../../styles/VideoTable.module.scss';
import StickyList from '../StickyList';

const findMax = arr => arr.reduce((max, current) => Math.max(max, current), -Infinity)

const VideoTable = ({ numVideos, videos, fields, loadMoreVideos, selectedRows, onCheckbox, onDeleteField, setFields }) => {
  const widths = useMemo(() => {
    const widthsByKey = {};
    fields.forEach(({ key, name }) => {
      const maxValueLength = findMax(videos.map(video => String(video[key] || '').length).concat(name.length));
      widthsByKey[key] = maxValueLength * 10 + 30;
    });
    return widthsByKey;
  }, [videos, fields]);

  if (numVideos === 0) {
    return <div className={styles['video-table']}>No videos found.</div>
  }

  const rowNumberWidth = String(videos.length).length * 9;
  const checkboxWidth = 50;

  const Row = ({ index, style }) => (
    <div style={style} className={styles.row}>
      <div className={clsx(styles.element, styles['row-number'])} style={{ width: rowNumberWidth }}>{index + 1}</div>
      <div className={clsx(styles.element, styles.checkbox)} style={{ width: checkboxWidth }}>
        <Checkbox checked={selectedRows.includes(index)} onChange={e => onCheckbox(e, index)} />
      </div>
      {videos[index] ? (
        fields.map(({ key }) => (
          <div className={styles.element} style={{ width: widths[key] }}>{videos[index][key] || ''}</div>
        ))
      ) : (
        'Loading...'
      )}
    </div>
  )

  const getHeaderRows = () => ([
    <div className={clsx(styles.row, styles.header)}>
      <ReactSortable list={fields} setList={setFields}>
        {fields.map(({ key, name }) => (
          <div className={styles.element} style={{ width: widths[key], left: checkboxWidth + rowNumberWidth }} key={key}>
            {name}
            <IconButton className={styles['delete-icon']} aria-label="delete" onClick={() => onDeleteField(key)}>
              <CancelOutlined style={{ fontSize: '.8em' }} />
            </IconButton>
          </div>
        ))}
      </ReactSortable>
      
    </div>
  ]);

  return (
    <div className={styles['video-table']}>
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isItemLoaded={index => !!videos[index]}
            itemCount={numVideos}
            loadMoreItems={loadMoreVideos}
            minimumBatchSize={100}
          >
            {({ onItemsRendered, ref}) => (
              <StickyList
                height={height}
                width={width}
                itemCount={numVideos}
                itemSize={35}
                onItemsRendered={onItemsRendered}
                ref={ref}
                stickyRows={getHeaderRows()}
              >
                {Row}
              </StickyList>
            )}
          </InfiniteLoader>
          
        )}
      </AutoSizer>
    </div>
  );
}

export default VideoTable;