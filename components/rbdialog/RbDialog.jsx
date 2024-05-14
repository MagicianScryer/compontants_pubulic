import { Dialog } from 'primereact/dialog';

export const RbDialog = (props) => {
  const { appendref } = props;
  const maskStyle = appendref ? { position: 'inherit' } : { position: 'fixed' };
  return (
    <Dialog maskStyle={maskStyle} appendTo={appendref} { ...props }></Dialog>
  );
};