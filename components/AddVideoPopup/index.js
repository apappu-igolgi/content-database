import { Formik, Form, Field } from 'formik';
import { Button, TextField } from '@material-ui/core';

import styles from '../../styles/AddVideoPopup.module.scss';
import FileUpload from '../ImageUpload';

const fieldPropsByType = {
  number: { as: TextField, variant: 'outlined' },
  string: { as: TextField, variant: 'outlined' },
  image: { as: FileUpload },
}

const AddVideoPopup = ({ fields, close, onSubmit, editMode, video }) => {
  return (
    <Formik
      initialValues={editMode ? video : {}}
      onSubmit={values => onSubmit(values).then(() => close())}
    >
      {({ isSubmitting }) => (
        <Form className={styles['add-video-popup']}>
          <div className={styles.title}>Add Video</div>

          <div className={styles.fields}>
            {fields.map(({ key, name, type }) => (
              <Field
                className={styles.field}
                name={key}
                label={name}
                {...fieldPropsByType[type]}
              />
            ))}
            {fields.length % 2 === 1 && (
              <div className={styles.field} />
            )}
          </div>

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