import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { RbButton } from "../rbbutton/RbButton";
import { BreadCrumb } from "primereact/breadcrumb";

export const RbText = (props) => {

  const [count, setCount] = useState(0);
  const [text, setText] = useState("你好，世界！");

  // 按钮点击事件
  const handleClick = () => {
      setCount(count + 1);
  }

  useEffect(() => {
    console.log(props.children);
  }, [])

  const Bt = () => {
    return (
      <RbButton>{props.children}</RbButton>
    )
  }
  return (
    <>
      <BreadCrumb></BreadCrumb>
      <div>
          <p>{count}</p>
          <p><Button onClick={handleClick}>点击+1</Button></p>
          {Bt()}
      </div>
    </>
  );




  // return (
  //   <div>{props.children}</div>
  // )
}

export default RbText;