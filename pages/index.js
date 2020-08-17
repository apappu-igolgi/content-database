import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Popup from 'reactjs-popup';
import { Button, Chip } from '@material-ui/core';

import styles from '../styles/Home.module.scss';
import VideoTable from '../components/VideoTable';
import { getNumVideos, getVideos, addVideo, deleteVideos, updateVideo, comparisonOptions, getFields, addField, deleteField, reorderFields, updateField } from '../util/videos';
import AddVideoPopup from '../components/AddVideoPopup';
import AddFieldPopup from '../components/AddFieldPopup';
import FilterPopup from '../components/FilterPopup';

export default function Home() {
  const [fields, setFields] = useState([]);
  const [numVideos, setNumVideos] = useState(0);
  const [videos, setVideos] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const infiniteLoaderRef = useRef(null);

  // filters has the following format:
  // { [key]: { [comparison]: value, [comparison2]: value2, ... }, ...}
  const [filters, setFilters] = useState({});

  const fetchNumVideos = useCallback(() => getNumVideos(filters).then(num => setNumVideos(num)), [filters]);
  const fetchFields = useCallback(() => getFields().then(newFields => setFields(newFields)), []);

  useEffect(() => {
    fetchNumVideos();
    fetchFields();
  }, [fetchNumVideos, fetchFields]);

  const loadVideos = (start, end = start, filtersToUse = filters) => {
    return getVideos(start, end, filtersToUse).then(retrievedVideos => {
      const newVideos = videos.slice(0);
      retrievedVideos.forEach((video, index) => newVideos[start + index] = video);
      setVideos(newVideos);
    })
  }

  // const handleTableCheckbox = (e, index) => {
  //   if (e.target.checked) {
  //     if (!selectedRows.includes(index)) {
  //       setSelectedRows(selectedRows.concat(index));
  //     }
  //   } else {
  //     setSelectedRows(selectedRows.filter(rowIndex => rowIndex != index));
  //   }
  // }

  const toggleSelection = index => {
    if (!selectedRows.includes(index)) {
      setSelectedRows(selectedRows.concat(index));
    } else {
      setSelectedRows(selectedRows.filter(rowIndex => rowIndex != index));
    }
  }

  const unselectAllRows = () => setSelectedRows([]);

  const deleteSelected = async () => {
    const firstRowIndex = Math.min(...selectedRows);
    console.log(videos[selectedRows[0]]);
    const idsToDelete = selectedRows.map(rowIndex => videos[rowIndex]._id);
    await deleteVideos(idsToDelete);
    await loadVideos(firstRowIndex, videos.length);
    await fetchNumVideos();
    unselectAllRows();
  }

  const addFilter = async ({ key, comparison, value }) => {
    const newFilters = JSON.parse(JSON.stringify(filters)); // deep copy
    newFilters[key] = newFilters[key] || {};
    newFilters[key][comparison] = value;
    console.log(newFilters);
    setFilters(newFilters);
    setVideos([]);
    await loadVideos(0, videos.length, newFilters);
  }

  const removeFilter = async (key, comparison) => {
    const newFilters = JSON.parse(JSON.stringify(filters));
    delete newFilters[key][comparison];
    if (Object.keys(newFilters[key]).length === 0) {
      delete newFilters[key];
    }
    setFilters(newFilters);
    setVideos([]);
    await loadVideos(0, videos.length, newFilters);
  }

  const handleReorderFields = newFields => {
    const newKeys = newFields.map(({ key }) => key);
    const oldKeys = fields.map(({ key }) => key);
    if (newKeys.join(',') !== oldKeys.join(',') && newFields.length > 0) {
      reorderFields(newKeys).then(reorderedFields => setFields(reorderedFields));
    }
  }

  const resetTable = () => {
    setVideos([]);
    infiniteLoaderRef.current.resetloadMoreItemsCache(true);
  }

  return (
    <div className={styles.home}>
      <Head>
        <title>Content Database</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>

      <div className={styles['table-container']}>
        <h1 className={styles.title}>Content Database</h1>
        
        <div className={styles.buttons}>
          <Popup modal trigger={<Button className={styles.button} variant="contained" color="primary">Add Field</Button>}>
            {close => <AddFieldPopup close={close} onSubmit={field => addField(field).then(fetchFields)} />}
          </Popup>

          <Popup modal trigger={<Button className={styles.button} variant="contained" color="primary">Add Video</Button>}>
            {close => <AddVideoPopup fields={fields} close={close} onSubmit={video => addVideo(video).then(fetchNumVideos)} />}
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
                fields={fields}
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
            fields={fields}
            loadMoreVideos={loadVideos}
            selectedRows={selectedRows}
            // onCheckbox={handleTableCheckbox}
            onRowSelect={toggleSelection}
            // onDeleteField={key => deleteField(key).then(fetchFields)}
            editField={field => setEditingField(field)}
            onReorderFields={handleReorderFields}
            infiniteLoaderRef={infiniteLoaderRef}
            // onUpdateField={field => updateField(field).then(fetchFields)}
          />

          <div className={styles.filters}>
            <Popup modal trigger={<Button className={styles['filter-button']} variant="outlined">Add Filter</Button>}>
              {close => <FilterPopup fields={fields} onSubmit={addFilter} close={close} />}
            </Popup>

            {Object.entries(filters).map(([key, filter]) => (
              Object.entries(filter).map(([comparison, value]) => (
                // <div className={styles.filter}>{key} {comparisonOptions[comparison]} {value}</div>
                <Chip
                  className={styles.filter}
                  label={`${key} ${comparisonOptions[comparison]} ${value}`}
                  color="primary"
                  size="small"
                  onDelete={() => removeFilter(key, comparison)}
                />
              ))
            ))}
          </div>
        </div>
      </div>

      <Popup open={!!editingField} modal onClose={() => setEditingField(null)}>
        {close => (
          <AddFieldPopup
            close={close}
            onSubmit={field => updateField({ oldKey: editingField.key, ...field }).then(fetchFields).then(resetTable)}
            field={editingField}
            editMode
          />
        )}
      </Popup>
    </div>
  )
}
