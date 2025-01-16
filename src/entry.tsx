import { AppProps } from './App';
import { createCustomForm } from './main'

export interface CustomWindow extends Window {
  custom_form: (element: HTMLElement, options: AppProps) => void;
}

declare let window: CustomWindow

window.custom_form = createCustomForm
