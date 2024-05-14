import { DocSectionCode } from "@pages/common/docsectioncode";
import { DocSectionText } from "@pages/common/docsectiontext";

export const ImportDoc = (props) => {
  const code = {
    basic: `
import { AutoComplete } from 'primereact/autocomplete';
    `,
  };

  return (
    <>
      <DocSectionText {...props}></DocSectionText>
      <DocSectionCode code={code} />
    </>
  );
};
