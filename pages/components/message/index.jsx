import { useState, useEffect, useRef } from 'react';
import { RbToast, toast } from '../../../components/rbmessage/RbMessage';
import { rollup } from 'rollup';

const Component = (props) => {


  useEffect(() => {
    toast({
      sticky: true,
      severity: 'info',
      detail: <ul>
        <li>耸耸耸</li>
        <li>mmmmm</li>
        <li>mmm耸耸耸耸耸耸耸耸耸耸耸耸mm</li>
        <li>mmm发放娜德斯菲尼拉斯奎莱菲卡拉瑟夫克拉斯即离开房间mm</li>
        <li>mmm耸耸耸耸耸耸mm</li>
        <li>///；mwsmglgdsgagawegaergawerlgmmmmm</li>
        <li>XXXXX</li>
      </ul>
    });
    toast({
      sticky: true,
      severity: 'info',
      detail: <ul>
        <li>耸耸耸</li>
        <li>mmmmm</li>
        <li>mmm耸耸耸耸耸耸耸耸耸耸耸耸mm</li>
      </ul>
    });
  }, []);

  return (
    <>
      <RbToast />
    </>
  )
}

export default Component;