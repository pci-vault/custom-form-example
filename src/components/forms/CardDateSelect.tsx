import { useEffect, useMemo, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Form from 'react-bootstrap/Form';

import { Field, useField } from 'formik';

type SelectOption = {
  name: string;
  value: string;
  disabled?: boolean;
};

type DateSelectProps = {
  name: string;
  label?: string;
  value?: string;
  validate?: (value: string) => string | undefined;
}

const CardDateSelect = (props: DateSelectProps) => {
  const { name, label, value, validate } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_field, meta, helpers] = useField(name);

  const [cardYear, setCardYear] = useState<string | null>()
  const [cardMonth, setCardMonth] = useState<string | null>()

  const minCardYear = new Date().getFullYear()
  const minCardMonth = cardYear && parseInt(cardYear) === minCardYear ? new Date().getMonth() + 1 : 1

  const monthOptions = useMemo(() => {
    const result: SelectOption[] = [];

    result.push({
      name: "MM",
      value: "MM",
    });

    for (let i = 0; i < 12; i++) {
      result.push({
        name: (i + 1) < 10 ? '0' + (i + 1) : (i + 1) + '',
        value: (i+1) < 10 ? '0' + (i+1) : (i+1) + '',
        disabled: (i+1) < minCardMonth,
      });
    }
    return result;
  }, []);

  const yearOptions = useMemo(() => {
    const result: SelectOption[] = [];

    result.push({
      name: "YYYY",
      value: "YY",
    });

    for (let i = 0; i < 12; i++) {
      result.push({
        name: (i + minCardYear).toString(10),
        value: (i + minCardYear).toString(10).slice(2, 4),
      });
    }
    return result;
  }, []);

  useEffect(() => {
    const fullValue = `${cardMonth || "MM"}/${cardYear ? cardYear : "YY"}`;

    if (cardYear != null && cardMonth != null) {
      helpers.setValue(fullValue);
    }
  }, [cardMonth, cardYear]);


  useEffect(() => {
    if (value) {
      const [month, year] = value.split("/")

      setCardMonth(month)
      setCardYear(year)
    }
  }, [value]);

  const handleMonthChange = (e: React.FormEvent<HTMLSelectElement>) => {
    helpers.setTouched(true)
    setCardMonth(e.currentTarget.value)
  }

  const handleYearChange = (e: React.FormEvent<HTMLSelectElement>) => {
    helpers.setTouched(true)
    setCardYear(e.currentTarget.value)
  }

  const handleValidate = (value: string): string | undefined => {
    if (value && (value.indexOf('MM') != -1 || value.indexOf('YY') != -1 )) {
      return "Please select a valid expiry date"
    }
    if (validate) {
      return validate(value);
    }
  }

  return (
    <Row className="mb-3">
      { label && (
        <Form.Label>{ label }</Form.Label>
      )}
      <Field name={name} validate={handleValidate}>
        {() => (
          <>
            <Form.Group className="mb-3" as={Col}>
              <Form.Select
                name="expiry_month"
                aria-label="Month"
                onChange={handleMonthChange}
                isInvalid={!!meta.error && meta.touched}
              >
                { monthOptions.map((option) => {
                  return (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      { option.name }
                    </option>
                  );
                }) }
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" as={Col}>
              <Form.Select
                name="expiry_year"
                aria-label="Year"
                onChange={handleYearChange}
                isInvalid={!!meta.error && meta.touched}
              >
                { yearOptions.map((option) => {
                  return (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      { option.name }
                    </option>
                  );
                }) }
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                { !!meta.error && meta.touched && meta.error }
              </Form.Control.Feedback>
            </Form.Group>
          </>
        )}
      </Field>
    </Row>
  );
}

export default CardDateSelect;
