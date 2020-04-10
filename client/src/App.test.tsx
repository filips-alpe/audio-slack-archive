import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders the app', () => {
  expect(render(<App />)).not.toThrow();
});
