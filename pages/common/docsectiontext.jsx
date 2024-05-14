import { createElement } from 'react';

export const DocSectionText = (props) => {
  const { label, level = 2, children } = props;

  const Title = (titleProps) => {
    return createElement(`h${level}`, { className: 'doc-section-label' }, titleProps.children);
  };

  return (
    <>
      <Title>{label}</Title>
      <div className="doc-section-description">{children}</div>
    </>
  );
}
