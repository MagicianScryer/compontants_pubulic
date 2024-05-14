import React, { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

export const toast = (message) => {
  if (React.Component.Toast) {
    React.Component.Toast.show(message);
  }
}

export const RbToast = () => {
  const toastRef = useRef(null);

  useEffect(() => {
    React.Component.Toast = toastRef.current;
  }, []);

  return <Toast ref={toastRef} />;
};

