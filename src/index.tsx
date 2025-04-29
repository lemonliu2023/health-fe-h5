import ReactDOM from 'react-dom/client';
import App from './App';
// Import Framework7 Core
import Framework7 from 'framework7/lite';

import 'framework7/css/bundle';
/*
Or import bundle with all components:
import Framework7 from 'framework7/lite-bundle';
*/

// Import Framework7 React
import Framework7React from 'framework7-react';
import ActionsComponent from 'framework7/components/actions';
import ToastComponent from 'framework7/components/toast';

// Init plugin
Framework7.use([Framework7React, ActionsComponent, ToastComponent]);

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}
