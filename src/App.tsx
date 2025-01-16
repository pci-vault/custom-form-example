import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { Formik } from 'formik'
import * as yup from 'yup'
import luhn from "luhn-js"

import Input from "./components/forms/Input"
import CardDateSelect from "./components/forms/CardDateSelect"
import Card from "react-bootstrap/esm/Card"

import "./scss/styles.scss"
import axios from "axios"
import Alert from "react-bootstrap/esm/Alert"
import { useState } from "react"

type FormData = {
  card_holder: string;
  card_number: string;
  expiry: string;
  cvv: string;
  [key:string]: unknown; // `extra_data` configured on the hosted form
}

type FieldOption = {
  validate?: boolean;
  visible?: boolean;
};

type AlertOptions = {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  message: string;
}

export type AppProps = {
  submit_secret: string;
  submit_url: string;
  force_keypad: boolean;
  show_card: boolean;
  disable_luhn: boolean;
  strip_spaces: boolean;
  field_options: Record<string, FieldOption>;
  reference: string;
  extra_data: Record<string, unknown>;
  testing: boolean;
};

const pciVaultAddressTesting = "https://api-stage.pcivault.io";
const pciVaultAddressProduction = "https://api.pcivault.io";

function App(props: AppProps) {
  const [alertMessage, setAlertMessage] = useState<AlertOptions | null>();

  const validateCardNumber = (value: string): string | undefined => {
    let validationMessage

    if (!props.disable_luhn && value?.length > 1 && !luhn.isValid(value.replaceAll(' ', ''))) {
      validationMessage = "Please enter a valid card number"
    }
    return validationMessage
  }

  const submitToVault = async (formData: FormData) => {
    if (!props.submit_url || !props.submit_secret || !props.submit_url.startsWith("/v1/capture/")) {
      throw new Error("Submit info not set correctly")
    }

    // Switch the URL that we post to depending on the `testing` options our app is initialised with
    const pciVaultAddress = props.testing ? pciVaultAddressTesting : pciVaultAddressProduction

    try {
      const response = await axios({
        method: 'post',
        params: props.reference ? { reference: props.reference } : undefined,
        url: pciVaultAddress + props.submit_url,
        data: {
          ...formData,
          "card_number": props.strip_spaces ? formData.card_number.replace(/\s/g, "") : formData.card_number,
        },
        headers: {
          "X-PCIVault-Capture-Secret": props.submit_secret
        }
      })

      if (response.status != 200) {
        setAlertMessage({
          variant: "danger",
          message: "Something went wrong, please try again",
        });
        return;
      } 

      setAlertMessage({
        variant: "success",
        message: "Card saved successfully",
      });

      // Redirect back to your site here

    } catch (e: unknown) {
      console.error(e)

      setAlertMessage({
        variant: "danger",
        message: "Something went wrong, please try again",
      });
    }
  }

  const schema = yup.object().shape({
    card_holder: yup.string().required("Please enter the card holder name on the card"),
    card_number: yup.string().required("Please enter a valid card number"),
    cvv: yup.string().required("Please enter the CVV as found on the back of the card"),
    expiry: yup.string().required("Please select a valid expiry date"),
  });

  return (
    <div className="container">
      <Formik
        validationSchema={schema}
        onSubmit={submitToVault}
        validateOnBlur={true}
        validateOnChange={false}
        initialValues={{
          card_holder: '',
          card_number: '',
          cvv: '',
          expiry: '',
          ...props.extra_data,
        }}
      >
        {({ handleSubmit, handleChange, values }) => (
          <Card className="shadow mt-5">
            <Card.Body>
              <h1>
                Example Custom Form in React{" "}
                <img src="/src/assets/react.svg" alt="logo" />
              </h1>

              <Form noValidate onSubmit={handleSubmit}>
                <Input
                  name="card_holder"
                  label="Name on card"
                  placeholder="e.g. John Smith"
                  onChange={handleChange}
                  required={true}
                />
                <Input
                  name="reference"
                  label="Reference"
                  defaultValue={props.reference}
                  disabled={true}
                  required={true}
                />
                <Input
                  name="card_number"
                  label="Card Number"
                  validate={validateCardNumber}
                  onChange={handleChange}
                  required={true}
                />
                <Input
                  name="cvv"
                  label="CVV"
                  onChange={handleChange}
                  required={true}
                  maxLength={3}
                />
                <CardDateSelect
                  name="expiry"
                  label="Expires"
                  value={values.expiry}
                />
                <Button type="submit">Submit</Button>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Formik>
      { alertMessage && (
        <Alert className="mt-2" key={alertMessage.variant} variant={alertMessage.variant}>
          { alertMessage.message }
        </Alert>
      ) }
    </div>
  );
}

export default App;
