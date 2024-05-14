import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { RbDialog } from '@components/rbdialog/RbDialog';

const Inner = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button label="show" onClick={() => setVisible(true)} />
      <RbDialog visible={visible} modal={props.modal} onHide={() => setVisible(false)}>
        {props.children}
        <Button label="inner" onClick={() => setVisible(false)}></Button>
      </RbDialog>
    </>
  )
}

const Component = (props) => {

  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const appendref = useRef();
  return (
    <>
      <div id="area" ref={appendref} style={{width: '20em', height: '20em'}}>

      </div>
      <div>
        <Button label="show" onClick={() => {
          
          setVisible(true)
        }} />
        <RbDialog visible={visible} modal={true} appendref={appendref.current} onHide={() => setVisible(false)}>
          <Inner {...props}><Inner {...props}><Inner {...props}></Inner></Inner></Inner>
          <Button label="inner" onClick={() => setVisible(false)}></Button>
        </RbDialog>
      </div>
      <div>
        <Button label="show1" onClick={() => setVisible1(true)} />
        <RbDialog visible={visible1} modal={true} onHide={() => setVisible1(false)}>
          <Inner {...props}><Inner {...props}><Inner {...props}></Inner></Inner></Inner>
          <Button label="inner1" onClick={() => setVisible1(false)}></Button>
        </RbDialog>
      </div>
      <div>
        <Button label="show2" onClick={() => setVisible2(true)} />
        <RbDialog visible={visible2} modal={true} onHide={() => setVisible2(false)}>
          <Inner {...props}><Inner {...props}><Inner {...props}></Inner></Inner></Inner>
          <Button label="inner2" onClick={() => setVisible2(false)}></Button>
        </RbDialog>
      </div>
    </>
  )
}

export default Component;