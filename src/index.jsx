import React from 'react';
import ReactDOM from 'react-dom/client';
import FormExample from './lib/form/example/FormExample';
import RunningListExample from './lib/running-list/example/RunningListExample';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
      <FormExample />
      <RunningListExample />
    </div>
  </React.StrictMode>
);
