import React from 'react';
import ReactDOM from 'react-dom';
import { SearchFrame } from './components/search-frame';
import 'typeface-roboto/index.css';
import { error, catchErrors } from 'electron-log';

ReactDOM.render(<SearchFrame />, document.querySelector('#app'));

// window.onerror = (ev, s, err) => {
//   error(err);
// }
catchErrors({});
