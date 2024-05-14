import { classNames } from 'primereact/utils';
import { DocSections } from './docsections';

export const DocComponent = (props) => {

  return (
    <div className={classNames(props.className, 'doc-component')}>
      <div className="doc-main">
        <div className="doc-intro">
          <h1>{props.header}</h1>
          <p dangerouslySetInnerHTML={{ __html: props.description }}></p>
        </div>
        <DocSections docs={props.componentDocs} />
      </div>
    </div>
  );
}
