import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Popup from 'reactjs-popup';
import { Button } from '@material-ui/core';
import styles from '../styles/Home.module.scss';
import VideoTable from '../components/VideoTable';
import { getKeys, getNumVideos, getVideos, addVideo, deleteVideos, updateVideo } from '../util/videos';
import AddVideoPopup from '../components/AddVideoPopup';
import FilterPopup from '../components/FilterPopup';

export default function Home() {
  const [numVideos, setNumVideos] = useState(0);
  const [videos, setVideos] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({});

  const refetchNumVideos = useCallback(() => getNumVideos(filters).then(num => setNumVideos(num)), [filters]);

  useEffect(() => {
    refetchNumVideos();
  }, [filters]);

  const loadVideos = (start, end = start, filtersToUse = filters) => {
    return getVideos(start, end, filtersToUse).then(retrievedVideos => {
      const newVideos = videos.slice(0);
      retrievedVideos.forEach((video, index) => newVideos[start + index] = video);
      setVideos(newVideos);
    })
  }

  const handleTableCheckbox = (e, index) => {
    if (e.target.checked) {
      if (!selectedRows.includes(index)) {
        setSelectedRows(selectedRows.concat(index));
      }
    } else {
      setSelectedRows(selectedRows.filter(rowIndex => rowIndex != index));
    }
  }

  const unselectAllRows = () => setSelectedRows([]);

  const deleteSelected = async () => {
    const firstRowIndex = Math.min(...selectedRows);
    const idsToDelete = selectedRows.map(rowIndex => videos[rowIndex]._id);
    await deleteVideos(idsToDelete);
    await loadVideos(firstRowIndex, videos.length);
    await refetchNumVideos();
    unselectAllRows();
  }

  const addFilter = async ({ key, comparison, value }) => {
    const newFilters = { ...filters };
    newFilters[key] = newFilters[key] || {};
    newFilters[key][comparison] = value;
    console.log(newFilters);
    setFilters(newFilters);
    setVideos([]);
  }

  const keys = getKeys(videos, ['_id']);

  return (
    <div className={styles.home}>
      <Head>
        <title>Video Organizer</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>

      <div className={styles['table-container']}>
        <div className={styles.buttons}>
          <Popup modal trigger={<Button className={styles.button} variant="contained" color="primary">Add Video</Button>}>
            {close => <AddVideoPopup keys={keys} close={close} onSubmit={video => addVideo(video).then(refetchNumVideos)} />}
          </Popup>

          <Popup
            modal
            trigger={(
              <Button
                className={styles.button}
                variant="contained"
                color="primary"
                disabled={selectedRows.length !== 1}
              >
                Edit
              </Button>
            )}
          >
            {close => (
              <AddVideoPopup
                editMode
                video={videos[selectedRows[0]]}
                keys={keys}
                close={close}
                onSubmit={video => updateVideo(video).then(() => loadVideos(selectedRows[0])).then(unselectAllRows)}
              />
            )}
          </Popup>

          <Button
            className={styles.button}
            variant="contained"
            onClick={deleteSelected}
            color="secondary"
            disabled={selectedRows.length === 0}
          >
            Delete
          </Button>
        </div>

        <div className={styles['filter-table']}>
          
          <VideoTable
            numVideos={numVideos}
            videos={videos}
            keys={keys}
            loadMoreVideos={loadVideos}
            selectedRows={selectedRows}
            onCheckbox={handleTableCheckbox}
          />

          <div className={styles.filters}>
            <Popup modal trigger={<Button className={styles['filter-button']} variant="outlined">Add Filter</Button>}>
              {close => <FilterPopup keys={keys} onSubmit={addFilter} close={close} />}
            </Popup>

            {/* {Object.entries(filters).map(([key, filter]) => (
              Object.entries(filter).map(([comparison, value]) => (
                <div className={styles.filter}></div>
              ))
            ))} */}
          </div>
        </div>
      </div>
    </div>
  )
}
