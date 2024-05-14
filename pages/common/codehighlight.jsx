import React, { useEffect, useRef } from 'react';
import Prism from '@/public/prism/prism';

export const CodeHighlight = (props) => {
  const codeElement = useRef();
  const languageClassName = `language-${props.lang || 'jsx'}`;

  useEffect(() => {
    Prism.highlightElement(codeElement.current);
  }, []);

  return (
    <pre style={props.style} tabIndex="-1">
      <code ref={codeElement} className={languageClassName}>
        {props.children}&nbsp;
      </code>
    </pre>
  );
}
