import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = '0px';
document.body.style.padding = '0px';

const div = document.createElement('div');

div.id = 'app-container';

const root = createRoot(div);

document.body.appendChild(div);

root.render(<App />);
