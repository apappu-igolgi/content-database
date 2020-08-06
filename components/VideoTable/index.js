import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { Checkbox } from '@material-ui/core';
import { useMemo } from 'react';
import clsx from 'clsx';
import InfiniteLoader from 'react-window-infinite-loader';

import styles from '../../styles/VideoTable.module.scss';
import { Message } from '../Message';
import StickyList from '../StickyList';
import { formatCamelCase } from '../../util/videos';

const VideoTable = ({ numVideos, videos, keys, loadMoreVideos, selectedRows, onCheckbox }) => {
  const widths = useMemo(() => {
    const widthsByKey = {};
    keys.forEach(key => {
      const maxValueLength = Math.max(...videos.map(video => String(video[key]).length), formatCamelCase(key).length);
      widthsByKey[key] = maxValueLength * 10 + 30;
    });
    return widthsByKey;
  }, [videos]);

  if (numVideos === 0) {
    return <div className={styles['video-table']}>No videos found.</div>
  }

  const Row = ({ index, style }) => (
    <div style={style} className={styles.row}>
      <div className={clsx(styles.element, styles.checkbox)}>
        <Checkbox checked={selectedRows.includes(index)} onChange={e => onCheckbox(e, index)} />
      </div>
      {videos[index] ? (
        keys.map(key => (
          <div className={styles.element} style={{ width: widths[key] }}>{videos[index][key] || ''}</div>
        ))
      ) : (
        'Loading...'
      )}
    </div>
  )

  const getHeaderRows = () => ([
    <div className={clsx(styles.row, styles.header)}>
      <div className={clsx(styles.element, styles.checkbox)} />
      {keys.map(key => <div className={styles.element} style={{ width: widths[key] }}>{formatCamelCase(key)}</div>)}
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