import { Select, MenuItem, Input, TextField, Button, InputLabel, FormControl } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';

import styles from '../../styles/AddFieldPopup.module.scss';
import { capitalize } from '../../util/videos';

const types = ['number', 'string', 'image'];

const AddFieldPopup = ({ onSubmit, close, field, editMode = false, onDelete }) => (
  <Formik initialValues={editMode ? field : { key: '', type: types[0] }} onSubmit={values => onSubmit(values).then(close)}>
    {({ isSubmitting }) => (
      <Form className={styles['add-field-popup']}>
        <div className={styles.fields}>
          <Field as={TextField} className={styles.field} name="key" label="Field Name" />

          <Field className={styles.field} as={Select} name="type">
            {types.map(type => (
              <MenuItem value={type}>{capitalize(type)}</MenuItem>
            ))}
          </Field>
        </div>

        <div className={styles.buttons}>
          <Button className={styles.button} type="button" variant="outlined" onClick={close}>Cancel</Button>
          <div className={styles.spacer} />

          {editMode && (
            <Button
              className={styles.button}
              variant="outlined"
              color="secondary"
              onClick={() => confirm('Are you sure you want to delete this field?') && onDelete(field.key).then(close)}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          )}

          <Button
            className={styles.button}
            type="submit"
            variant="outlined"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Submit'}
          </Button>
        </div>
      </Form>
    )}
  </Formik>
);

export default AddFieldPopup;