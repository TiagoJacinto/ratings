import 'reflect-metadata';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';
import { AppLayout } from './components/layouts/AppLayout';
import { CreateRatingPage } from './pages/ratings/new/page';
import { UpdateRatingPage } from './pages/ratings/{id}/edit/page';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='*' element='404' />
          <Route path='/ratings'>
            <Route path='new' element={<CreateRatingPage />} />
            <Route path=':id'>
              <Route path='edit' element={<UpdateRatingPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
