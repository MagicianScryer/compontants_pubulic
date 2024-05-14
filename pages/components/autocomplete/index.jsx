import { AutoComplete } from "primereact/autocomplete";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { DocComponent } from "@pages/common/document";
import { RbButton } from "@components/rbbutton/RbButton";
import { ImportDoc } from "./importdoc";
import { BasicDoc } from "./basicdoc";
import { DropdownDoc } from "./dropdowndoc";
import { VirtualScrollDoc } from "./virtualscrolldoc";
import { useState, useEffect } from "react";

const Component = (props) => {
  const docs = [
    {
      id: "import",
      label: "Import",
      component: ImportDoc,
    },
    {
      id: "basic",
      label: "Basic",
      component: BasicDoc,
    },
    {
      id: "dropdown",
      label: "Dropdown",
      component: DropdownDoc,
    },
    {
      id: "virtualscroll",
      label: "Virtual Scroll",
      component: VirtualScrollDoc,
    },
  ];

  const [value, setValue] = useState("1");
  const [items, setItems] = useState([]);

  const search = (event) => {
    let _items = [...Array(10).keys()];
    // setItems(event.query ? [...Array(10).keys()].map(item => event.query + '-' + item) : _items);
    setItems(_items);
  };

  useEffect(() => {
    setValue("2");
  }, []);

  return (
    <Splitter className="layout-splitter">
      <SplitterPanel className="layout-splitter-panel" minSize={10}>
        <DocComponent
          title="React AutoComplete Component"
          header="AutoComplete"
          description="AutoComplete is an input component that provides real-time suggestions while being typed"
          componentDocs={docs}
        />
      </SplitterPanel>
    </Splitter>
  );
};

export default Component;
