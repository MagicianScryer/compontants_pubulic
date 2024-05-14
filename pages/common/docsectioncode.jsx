import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { CodeHighlight } from "./codehighlight";

export const DocSectionCode = (props) => {
  const [codeMode, setCodeMode] = useState("basic");
  const [codeLang, setCodeLang] = useState(props.code["javascript"] ? "javascript" : "basic");

  const toggleCodeMode = (content) => {
    if (codeMode === "data") {
      setCodeMode("javascript");
    } else {
      setCodeMode(codeMode === "basic" ? content : "basic");
    }

    setCodeLang("javascript");
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(props.code[codeLang]);
  };

  return (
    <div className="doc-section-code">
      <div className="doc-section-code-buttons scalein animation-duration-300">
        {!props.hideToggleCode && (
          <Button
            type="button"
            onClick={() => toggleCodeMode("javascript")}
            className="h-2rem w-2rem p-0 inline-flex align-items-center justify-content-center shadow-none"
            tooltip="Toggle Full Code"
            tooltipOptions={{ position: "bottom", className: "doc-section-code-tooltip" }}
          >
            <i className="pi pi-code"></i>
          </Button>
        )}
        <Button
          type="button"
          onClick={copyCode}
          className="h-2rem w-2rem p-0 inline-flex align-items-center justify-content-center shadow-none"
          tooltip="Copy Code"
          tooltipOptions={{ position: "bottom", className: "doc-section-code-tooltip" }}
        >
          <i className="pi pi-copy"></i>
        </Button>
      </div>

      {codeMode === "basic" && (
        <div className={props.codeClassName}>
          <CodeHighlight code {...props}>
            {props.code.basic}
          </CodeHighlight>
        </div>
      )}

      {codeMode !== "basic" && codeLang === "javascript" && (
        <div className={props.codeClassName}>
          <CodeHighlight code>{props.code.javascript}</CodeHighlight>
        </div>
      )}
    </div>
  );
};
