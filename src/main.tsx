import 'reflect-metadata';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';

import { registerSW } from 'virtual:pwa-register';

import { Toaster } from '@/components/atoms/sonner';

import { AppLayout } from './components/layouts/AppLayout';
import { CreateAlternativeCategoryPage } from './pages/categories/new/page';
import { AlternativeCategoryPage } from './pages/categories/{id}/page';
import { CategoriesPage } from './pages/categories/page';

// add this to prompt for a refresh
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      void updateSW(true);
    }
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='*' element='404' />
          <Route path='/'>
            <Route index element={<CategoriesPage />} />
            <Route path='new' element={<CreateAlternativeCategoryPage />} />
            <Route path=':id' element={<AlternativeCategoryPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
