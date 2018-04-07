import React from 'react';
import {render} from 'react-dom';

import App from './App';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = 0;
document.body.style.padding = 0;

const renderApp = (container) => {
  render(<App />, container);
};

const div = document.createElement('div');

div.id = 'app-container';

renderApp(div);

document.body.appendChild(div);
