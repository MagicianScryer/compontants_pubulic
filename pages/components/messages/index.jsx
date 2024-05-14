import { useState, useEffect, useRef } from 'react';
import { RbMessages } from '../../../components/rbmessages/RbMessages';

const Component = (props) => {

  const msgs = useRef(null);

  useEffect(() => {
    if (msgs.current) {
      msgs.current.show([
        {
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
        }
      ])
    }
  }, []);

  return (
    <div>
      <RbMessages ref={msgs} />
    </div>
  )
}

export default Component;