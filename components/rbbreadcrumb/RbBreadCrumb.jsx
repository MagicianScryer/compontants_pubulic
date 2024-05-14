import { useState, useEffect } from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import { RuiBaiTabPageContext } from '@commons/rbcontext/RuiBaiTabPageContext';

export const RbBreadCrumb = (props) => {
  const { home, model, onChange, ...prop } = props;
  const { pageState, pageStateDispatch } = useContext(RuiBaiTabPageContext);
  
  return (
    <BreadCrumb home={home} model={model} onChange={onChange} {...prop} />
  );
};
