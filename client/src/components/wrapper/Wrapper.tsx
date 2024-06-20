"use client";
import React, { ReactNode } from 'react';
import { Store } from '@/Store/store';
import { Provider } from 'react-redux';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <Provider store={Store}>
        {children}
      </Provider>
    </>
  );
}

export default Wrapper;
