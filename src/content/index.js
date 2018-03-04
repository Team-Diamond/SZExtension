import React from 'react';
import { render } from 'react-dom';
import Container from './components/container'

const anchor = document.createElement('div');
anchor.id = 'container-anchor';

document.body.insertBefore(anchor, document.body.childNodes[0]);

render(<Container />, document.getElementById('container-anchor'));

if (module.hot) {
  module.hot.accept();
}