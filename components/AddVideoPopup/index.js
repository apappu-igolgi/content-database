import { Formik, Form, Field } from 'formik';
import { Button, TextField } from '@material-ui/core';

import styles from '../../styles/AddVideoPopup.module.scss'
import { formatCamelCase } from '../../util/videos';

const AddVideoPopup = ({ keys, close, onSubmit, editMode, video }) => {
  return (
    <Formik
      initialValues={editMode ? video : {}}
      onSubmit={values => onSubmit(values).then(() => close())}
    >
      {({ isSubmitting }) => (
        <Form className={styles['add-video-popup']}>
          <div className={styles.title}>Add Video</div>

          {keys.map(key => (
            <Field
              className={styles.field}
              as={TextField}
              name={key}
              label={formatCamelCase(key)}
              variant="outlined"
            />
          ))}

          <div className={styles.buttons}>
            <Button type="button" variant="outlined" onClick={close}>Cancel</Button>
            <Button
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
  )
};

export default AddVideoPopup;