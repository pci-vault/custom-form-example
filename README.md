# Custom PCI Vault form implemented with React + TypeScript + Vite

This is an example of how to create a custom hosted capture form for [PCI Vault](https://pcivault.io).
It uses React to render a form and post the data to the vault.

Vite is utilised to bundle your app as a library that can be loaded in the custom form.

## Installation

```sh
npm install
```
## Creating a Test Capture Endpoint in PCI Vault

In order to test the form we need to first create a capture endpoint using the PCI Vault API in the `staging` environment.
The process for creating the endpoint is as follows:

1. Go to [https://docs.pcivault.io] and make sure to select the `Staging` environment using the toggle on the bottom left of the page.
2. Generate a [capture endpoint](https://docs.pcivault.io/api/capture#method-post) and keep the `unique_id` and `secret` obtained from this step.

Now we have a test capture endpoint where the test data can be saved. 
Update `index.html` to use this new endpoint's details:
```js
window.custom_form(element, {
  "submit_secret": "{secret}",
  "submit_url": "/v1/capture/{unique_id}",
  "force_keypad": false,
  "show_card": true,
  ...
});
```

## Developing

While developing, we'll use Vite to package and serve our app, it will also do hot reloads which speed up development.
```sh
npm run dev
```
Any forms that get submitted will go to the capture endpoint in the staging environmet which was created in the previous step.

## Building for Production

### Building the JS and CSS artifacts

In order to load our custom react app in the hosted form, we first need to build the JavaScript and CSS artifacts
that will be loaded on the page.
```sh
npm run build
```
Vite will package the application and output the artifacts in `/dist/custom-form`.
These need to be publically accessible and hosted somewhere by you on a URL, for example:
- https://mydomain/custom-form/custom-form.js
- https://mydomain/custom-form/custom-form.css

### Creating a Custom Hosted Form in PCI Vault

1. Go to [https://docs.pcivault.io] and make sure to select the `Production` environment using the toggle on the bottom left of the page.
2. Generate a [capture endpoint](https://docs.pcivault.io/api/capture#method-post) and keep the `unique_id` and `secret` obtained from this step.
3. Create your [customised hosted form](/api/capture#method-post-iframe), making sure to keep the returned `id` value.
  - set the `form_type` to `custom`
  - set `js_links` and `css_links` to the URLs where your artifacts can be publically accessed
4. Load the configured form using a URL with the form `id`, the capture endpoint `unique_id` and `secret`.
   For example:
   https://api.pcivault.io/v1/capture/iframe/{id}?unique_id={unique_id}&secret={secret}

When you access the form with the URL,
you also have the following options that you can specify in the query string:
- `title` will set the page title if the form is displayed in a browser window or tab.
- `testing` gets passed to our app in the options to `window.custom_form(element, options)`.
- `reference` gets passed to our app in the options to `window.custom_form(element, options)` (our example app displays this as a disabled field)
- Any other query string parameter will be added to an `extra_data` object in `options`
