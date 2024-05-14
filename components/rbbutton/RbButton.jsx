import { Button } from 'primereact/button';
import { useEffect, memo, useMemo } from 'react';

export const RbButton = memo((props) => {

  console.log("button");

  return (
    <>
      <Button size={props.size || "small"} {...props}>{props.children}</Button>
    </>
  )
}, (pre, next) => {
  console.log("button1");
});

