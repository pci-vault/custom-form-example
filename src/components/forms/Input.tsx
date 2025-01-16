import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap';
import { Field, FieldProps } from 'formik';

type InputProps = Omit<FormControlProps, "name"> & {
  name: string;
  label?: string;
  validate?: (value: string) => string | undefined;
}

const Input = (props: InputProps) => {
  const {
    label,
    name,
    validate,
    ...otherProps
  } = props;

  return (
    <>
      <Form.Group className="mb-3">
        { label && (
          <Form.Label>{ label }</Form.Label>
        )}
        <Field name={name} validate={validate} >
          {({field, meta}: FieldProps) => (
            <>
              <Form.Control
                aria-label={label}
                isInvalid={!!meta.error && meta.touched}
                {...field}
                {...otherProps}
              />
              <Form.Control.Feedback type="invalid">
                { !!meta.error && meta.touched && meta.error }
              </Form.Control.Feedback>
            </>
          )}
        </Field>
      </Form.Group>
    </>
  );
}

export default Input;
