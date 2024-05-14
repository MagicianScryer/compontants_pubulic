import React from "react";
import { Messages } from 'primereact/messages';
import { classNames } from 'primereact/utils';

export const RbMessages = React.forwardRef((props, ref) => {

  const _className = classNames('p-messages-panel', props.className);

  return (
    <Messages {...props} className={_className} ref={ref} />
  )
})
