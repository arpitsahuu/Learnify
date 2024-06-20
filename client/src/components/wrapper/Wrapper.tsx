"use client";
import React, { ReactNode } from 'react';
import { store } from '@/Store/store';
import { Provider } from 'react-redux';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <Provider store={store}>
        {children}
      </Provider>
    </>
  );
}

export default Wrapper;
