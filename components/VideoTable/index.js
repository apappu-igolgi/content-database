import AutoSizer from 'react-virtualized-auto-sizer';
import { Checkbox, IconButton } from '@material-ui/core';
import { EditOutlined } from '@material-ui/icons';
import { useMemo } from 'react';
import clsx from 'clsx';
import InfiniteLoader from 'react-window-infinite-loader';
import { ReactSortable } from 'react-sortablejs';

import styles from '../../styles/VideoTable.module.scss';
import StickyList from '../StickyList';
import AddFieldPopup from '../AddFieldPopup';


const imageWidth = 40;

const rowElementByType = {
  number: value => value,
  string: value => value,
  image: value => <img src={value} width={imageWidth} />
}

const elementWidthByType = {
  number: value => String(value || '').length * 10,
  string: value => String(value || '').length * 10,
  image: () => imageWidth,
}

const findMax = arr => arr.reduce((max, current) => Math.max(max, current), -Infinity)

const VideoTable = ({ numVideos, videos, fields, loadMoreVideos, selectedRows, onRowSelect, editField, onReorderFields, infiniteLoaderRef }) => {
  const widths = useMemo(() => {
    const widthsByKey = {};
    fields.forEach(({ key, type }) => {
      widthsByKey[key] = findMax(
        videos.map(video => elementWidthByType[type](video[key]))
        .concat(elementWidthByType.string(key))
      ) + 30;
    });
    return widthsByKey;
  }, [videos, fields]);

  if (numVideos === 0) {
    return <div className={styles['video-table']}>No videos found.</div>
  }

  const rowNumberWidth = String(videos.length).length * 9;
  const checkboxWidth = 50;

  const Row = ({ index, style }) => (
    <div style={style} className={styles.row} onClick={() => onRowSelect(index)}>
      <div className={clsx(styles.element, styles['row-number'])} style={{ width: rowNumberWidth }}>{index + 1}</div>
      <div className={clsx(styles.element, styles.checkbox)} style={{ width: checkboxWidth }}>
        <Checkbox checked={selectedRows.includes(index)} />
      </div>
      {videos[index] ? (
        fields.map(({ key, type }) => (
          <div className={clsx(styles.element, styles.normal)} style={{ width: widths[key] }}>
            { rowElementByType[type](videos[index][key] || '')}
          </div>
        ))
      ) : (
        'Loading...'
      )}
    </div>
  )

  const getHeaderRows = () => ([
    <div className={clsx(styles.row, styles.header)}>
      <ReactSortable list={fields} setList={onReorderFields}>
        {fields.map(({ key, type }) => (
          <div className={clsx(styles.element, styles.normal)} style={{ width: widths[key], left: checkboxWidth + rowNumberWidth }} key={key}>
            {key}
            <IconButton className={styles['edit-icon']} aria-label="edit" onClick={() => editField({ key, type })}>
              <EditOutlined style={{ fontSize: '.8em' }} />
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
            minimumBatchSize={50}
            ref={infiniteLoaderRef}
          >
            {({ onItemsRendered, ref }) => (
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