import React from "react";
import { AutoCompletePassThroughOptions, AutoCompleteChangeEvent } from "primereact/autocomplete";

export interface RbAutoCompleteProps {
  id?: string;
  name?: string;
  field?: string;
  className?: string;
  label?: string;
  value?: Object;
  dropdown?: boolean;
  editable?: boolean;
  nullTip?: Object;
  api?: string;
  onChange(event: AutoCompleteChangeEvent): void;
  paramsObj?: Object;
  resourceId?: string;
  resourceAccessKey?: string;
  valueFields?: string;
  labelFields?: string;
  joinTagLabel?: string;
  joinTagValue?: string;
  pt?: AutoCompletePassThroughOptions;
  children?: RbAutoCompleteTemplateTypes;
  [prop: string]: any;
}

type RbAutoCompleteTemplateTypes = React.ReactNode | ((props: RbAutoCompleteProps) => React.ReactNode);

// tslint:disable-next-line:max-classes-per-file
export declare class RbAutoComplete extends React.Component<RbAutoCompleteProps, any> {}
