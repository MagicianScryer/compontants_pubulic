import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { Application } from './Application';

import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@styles/themes/ruibai/theme.scss';

const rootDomElement = document.getElementById('root');
const rootElement = createRoot(rootDomElement);

const primeState = {
  zIndex: {
    modal: 900,
    overlay: 1000,
    menu: 800,
    tooltip: 1100
  },
  autoZIndex: true
};
rootElement.render(
  <PrimeReactProvider value={primeState}>
    <Application />
  </PrimeReactProvider>
);
