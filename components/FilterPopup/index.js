import { useState } from 'react';
import { Select, MenuItem, Input, TextField, Button } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { Alert } from '@material-ui/lab'

import styles from '../../styles/FilterPopup.module.scss';
import { comparisonOptions } from '../../util/videos';

const allowedOperatorsByType = {
  number: ['gt', 'lt', 'equals'],
  string: ['equals', 'contains'],
}

const FilterPopup = ({ fields, onSubmit, close }) => {
  const filterableFields = fields.filter(
    ({ type }) => allowedOperatorsByType[type] && allowedOperatorsByType[type].length > 0
  );

  if (filterableFields.length === 0) {
    return <Alert severity="error" onClose={close}>No filterable fields.</Alert>
  }
  const firstField = filterableFields[0];

  const [allowedOperations, setAllowedOperations] = useState(allowedOperatorsByType[firstField.type]);

  return (
    <Formik
      initialValues={{ key: firstField.key, comparison: allowedOperatorsByType[firstField.type][0] }}
      onSubmit={values => onSubmit(values).then(() => close())}
    >
      {({ isSubmitting }) => (
        <Form className={styles['filter-popup']}>
          <div className={styles.fields}>
            <Field className={styles.field} as={Select} name="key">
              {filterableFields.map(({ key, type }) => (
                <MenuItem value={key} onClick={() => setAllowedOperations(allowedOperatorsByType[type])}>{key}</MenuItem>
              ))}
            </Field>

            <Field className={styles.field} as={Select} name="comparison">
              {Object.entries(comparisonOptions).filter(([option]) => allowedOperations.includes(option)).map(([option, text]) => (
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