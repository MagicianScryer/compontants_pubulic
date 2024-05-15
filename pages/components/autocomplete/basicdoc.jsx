import { DocSectionCode } from "@pages/common/docsectioncode";
import { DocSectionText } from "@pages/common/docsectiontext";
import { AutoComplete } from "primereact/autocomplete";
import { getRelativePath } from "@utils/pathUtils";
import { useState } from "react";

export const BasicDoc = (props) => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);

  const search = (event) => {
    setItems([...Array(10).keys()].map((item) => event.query + "-" + item));
  };

  const code = {
    basic: `
<AutoComplete value={value} suggestions={items} completeMethod={search} onChange={(e) => setValue(e.value)}  />
      `,
    javascript: `
import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

export default function BasicDemo() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
      setItems([...Array(10).keys()].map(item => event.query + '-' + item));
  }

  return (
      <div className="card flex justify-content-center">
          <AutoComplete value={value} suggestions={items} completeMethod={search} onChange={(e) => setValue(e.value)} />
      </div>
  )
}
      `,
    typescript: `
import React, { useState } from "react";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";

export default function BasicDemo() {
  const [value, setValue] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);

  const search = (event: AutoCompleteCompleteEvent) => {
      setItems([...Array(10).keys()].map(item => event.query + '-' + item));
  }

  return (
      <div className="card flex justify-content-center">
          <AutoComplete value={value} suggestions={items} completeMethod={search} onChange={(e) => setValue(e.value)} />
      </div>
  )
}
      `,
  };

  return (
    <>
      <DocSectionText {...props}>
        <p>
          AutoComplete is used as a controlled component with <i>value</i> and <i>onChange</i> properties. In addition,{" "}
          <i>suggestions</i> and a <i>completeMethod</i> are required to query the results.
        </p>
      </DocSectionText>
      <div className="card flex justify-content-center align-items-center">
        <AutoComplete value={value} suggestions={items} completeMethod={search} onChange={(e) => setValue(e.value)} />
      </div>
      <DocSectionCode code={code} codeUrl={getRelativePath("pages", import.meta.url)} />
    </>
  );
};
