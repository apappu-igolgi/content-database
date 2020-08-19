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

const rowHeight = 40;
const maxImageSize = rowHeight - 5;

const rowElementByType = {
  number: value => value,
  string: value => value,
  image: value => <div style={{ backgroundImage: `url("${value}")`, width: maxImageSize, height: maxImageSize, backgroundSize: 'contain' }} />
}

const elementWidthByType = {
  number: value => String(value || '').length * 10,
  string: value => String(value || '').length * 10,
  image: () => maxImageSize,
}

// Thumbnail is special field that doesn't follow the normal rules specified for the other fields
const thumbnailException = (key, normal, alternate) => key === 'Thumbnail' ? alternate : normal;

const findMax = arr => arr.reduce((max, current) => Math.max(max, current), -Infinity)

const VideoTable = ({ numVideos, videos, fields, loadMoreVideos, selectedRows, onRowSelect, editField, onReorderFields, infiniteLoaderRef, unselectAll }) => {
  const widths = useMemo(() => {
    const widthsByKey = {};
    // for each field, finds the value with the maximum width and sets all the element widths for that field to that width
    fields.forEach(({ key, type }) => {
      widthsByKey[key] = thumbnailException(
        key,
        findMax(
          videos.map(video => elementWidthByType[type](video[key]))
          .concat(elementWidthByType.string(key)) // add the header element as well (which displays the key)
        ) + 30, // add 30 for margin between fields
        maxImageSize, // if this is the thumbnail field, we want the field width to just be the image width (not going to display header element)
      );
    });
    return widthsByKey;
  }, [videos, fields]);

  if (numVideos === 0) {
    return <div className={styles['video-table']}>No videos found.</div>
  }

  const rowNumberWidth = String(videos.length).length * 9;
  const checkboxWidth = 50;

  const handleCheckboxKeyPress = (e, index) => {
    if (e.key === 'Enter') {
    console.log(e.which);
      onRowSelect(index)
    }
  }

  const Row = ({ index, style }) => (
    <div style={style} className={clsx(styles.row, selectedRows.includes(index) && styles.selected)} onMouseDown={() => onRowSelect(index)}>
      <div className={clsx(styles.element, styles['row-number'])} style={{ width: rowNumberWidth }}>{index + 1}</div>
      <div className={clsx(styles.element, styles.checkbox)} style={{ width: checkboxWidth }}>
        <Checkbox checked={selectedRows.includes(index)} onKeyPress={e => handleCheckboxKeyPress(e, index)} />
      </div>
      {videos[index] ? (
        fields.map(({ key, type }) => (
          <div
            className={clsx(styles.element, styles.normal)}
            style={{ width: widths[key] }}
            title={rowElementByType[type](videos[index][key] || '')}
            key={key}
          >
            {rowElementByType[type](videos[index][key] || '')}
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
        {fields.map(({ key, type, locked }) => (
          <div className={clsx(styles.element, styles.normal)} style={{ width: widths[key], left: checkboxWidth + rowNumberWidth }} key={key}>
            {thumbnailException(key, key, '')}

            {!locked && ( // only display option to edit field if it's not locked
              <IconButton className={styles['edit-icon']} aria-label="edit" onClick={() => editField({ key, type })}>
                <EditOutlined style={{ fontSize: '.8em' }} />
              </IconButton>
            )}
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
                itemSize={rowHeight}
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