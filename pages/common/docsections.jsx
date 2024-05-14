import { DocSectionText } from './docsectiontext';

export const DocSections = (props) => {

  const renderDocChildren = (doc, level = 2) => {
    return (
      <React.Fragment key={doc.id + '_' + level}>
        <DocSectionText {...doc} level={level}>
          {doc.description ? <p>{doc.description}</p> : null}
        </DocSectionText>
        {doc.children.map((d) => {
          const { id, label, component, children } = d;
          const Component = component;

          return component ? <Component id={id} key={id} label={label} level={level + 1} /> : children ? renderDocChildren(d, level + 1) : null;
        })}
      </React.Fragment>
    );
  };

  const renderDocs = () => {
    return props.docs.map((doc, i) => {
      const { component: Comp, id, label, children } = doc;

      const props = {
        id,
        label,
      };

      return (
        <section key={`${label}_${i}`} className="py-4">
          {children ? renderDocChildren(doc) : Comp ? <Comp {...props} /> : null}
        </section>
      );
    });
  };

  return renderDocs();
}