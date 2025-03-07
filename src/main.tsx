import 'reflect-metadata';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';
import { AppLayout } from './components/layouts/AppLayout';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='*' element='404' />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
