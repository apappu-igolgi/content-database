import { Select, MenuItem, Input, TextField, Button } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';

import styles from '../../styles/FilterPopup.module.scss';
import { formatCamelCase, comparisonOptions } from '../../util/videos';

const FilterPopup = ({ keys, onSubmit, close }) => {
  return (
    <Formik initialValues={{ key: keys[0], comparison: 'equals' }} onSubmit={values => onSubmit(values).then(() => close())}>
      {({ isSubmitting }) => (
        <Form className={styles['filter-popup']}>
          <div className={styles.fields}>
            <Field className={styles.field} as={Select} name="key">
              {keys.map(key => (
                <MenuItem value={key}>{formatCamelCase(key)}</MenuItem>
              ))}
            </Field>

            <Field className={styles.field} as={Select} name="comparison">
              {Object.entries(comparisonOptions).map(([option, text]) => (
                <MenuItem value={option}>{text}</MenuItem>
              ))}
            </Field>

            <Field as={TextField} className={styles.field} name="value" label="Value" />
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
}

export default FilterPopup;