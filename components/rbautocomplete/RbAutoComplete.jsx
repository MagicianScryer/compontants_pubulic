import { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { RbPost } from "../rbutils/RbUtils";
import { RbLabel } from "../rblabel/RbLabel";
import { classNames } from "primereact/utils";
import { useFormRulesUtil, errorStatusCode } from "../rbformutils/RbFormUtils";
import PropTypes from "prop-types";
import { FormContext } from "../rbformcontext/rbformcontext";

let clearTimeouts = null;
let tiemOutStatu = null;

export const RbAutoComplete = forwardRef(
  (
    {
      field,
      dropdown = true,
      label,
      api,
      value,
      editable = true,
      nullTip,
      onChange,
      resourceId,
      resourceAccessKey,
      className,
      rules,
      name,
      paramsObj = {},
      valueFields = ["value"],
      labelFields = ["label"],
      joinTagLabel = "-",
      joinTagValue = "-",
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState();
    const [suggestions, setSuggestions] = useState([]);
    const [returnData, setRetunData] = useState(undefined);

    const { formItemRef, formChange } = React.useContext(FormContext);
    const [verify, isRequired, errorInfo] = useFormRulesUtil({ rules, type: null });

    const getvalueFields = (data) => {
      let strValue = "";
      valueFields.forEach((i) => {
        strValue = strValue ? `${strValue}${joinTagValue}${data[i]}` : `${data[i]}`;
      });
      return strValue;
    };

    const getlabelFields = (data) => {
      let strLabel = "";
      labelFields.forEach((i) => {
        strLabel = strLabel ? `${strLabel}${joinTagLabel}${data[i]}` : `${data[i]}`;
      });
      return strLabel;
    };

    useImperativeHandle(
      formItemRef
        ? formItemRef[name]
          ? formItemRef[name]
          : (formItemRef[name] = { current: null })
        : { current: null },
      () => ({
        verify: () => {
          let status = verify(returnData);
          if (errorStatusCode === status) {
            return errorStatusCode;
          } else {
            return returnData;
          }
        },
        setFieldsValue: (value) => {
          setInputValue(value);
          setRetunData(value);
        },
        getValue: (data) => {
          return returnData;
        },
      })
    );

    useImperativeHandle(ref, () => ({
      setValue: (value) => {
        setInputValue(value);
        setRetunData(value);
      },
      getValue: () => {
        return returnData;
      },
    }));

    // 给下拉框赋值
    const funAutoComplete = (query = {}) => {
      let paramData = {
        parmResourceId: resourceId,
        parmResourceKey: resourceAccessKey,
        ...paramsObj,
      };
      RbPost(api, { ...paramData, ...query }).then((data) => {
        if (data && data.status === "success") {
          const { resultData } = data;
          const result = resultData.resultList || resultData.dataList;
          if (result && Array.isArray(result)) {
            let tempData = [];
            result.forEach((i) => {
              let strValue = getvalueFields(i);
              let strLabel = getlabelFields(i);
              tempData.push({ code: strValue, [field]: strLabel, _data_key_s: i });
            });
            setSuggestions(tempData);
          }
        } else {
          setSuggestions([]);
        }
      });
    };

    // 输入框值改变
    const completeMethod = (e) => {
      if (e.query) {
        clearTimeout(clearTimeouts);
        clearTimeouts = setTimeout(() => {
          funAutoComplete({ searchKey: e.query });
        }, 200);
      } else {
        funAutoComplete();
      }
    };

    // 找到id对应的哪个条数据
    const findItem = (val) => {
      if (val.code) {
        for (let i = 0; i < suggestions.length; i++) {
          let item = suggestions[i];
          if (item.code === val.code) {
            return item._data_key_s;
          }
        }
        return "";
      } else {
        return val;
      }
    };

    const _onChange = (e) => {
      let data = null;
      debugger;
      if (typeof e.value === "string") {
        if (field) {
          data = { [field]: e.value };
        } else {
          data = e.value;
        }
      } else {
        data = findItem(e.value);
      }
      if (typeof e.value !== "string") {
        //const strTemp = getvalueFields(data);
        const labeltemp1 = getlabelFields(data);
        setInputValue(labeltemp1);
        setRetunData(data);
        e.value = data;
        onChange && onChange(e);
        formChange && formChange({ [name || "null"]: data });
      } else if (typeof e.value === "string") {
        setInputValue(e.value);
        setRetunData(e.value);
        onChange && onChange(e);
        formChange && formChange({ [name || "null"]: e.value });
      } /*  else {
      const labeltemp2 = getlabelFields(data);
      const strTemp2 = getvalueFields(data);
      setRetunData(data);
      setInputValue(labeltemp2);
      formChange && formChange({ [name || 'null']: data });
    } */

      if (errorInfo) {
        clearTimeout(tiemOutStatu);
        tiemOutStatu = setTimeout(() => {
          verify(data ? getvalueFields(data) : data);
        }, 500);
      }
    };

    useEffect(() => {
      if (typeof value === "string") {
        setInputValue(value);
      } else if (value) {
        const labelField3 = getlabelFields(value);
        setInputValue(labelField3);
      } else {
        setInputValue(value);
      }
    }, [value]);

    if (editable) {
      return (
        <div className={classNames("p-rb-form", "p-inputtext-sm", { "p-rb-form-item": formItemRef })}>
          <span className={classNames("p-fluid", { "p-float-label": label })}>
            <AutoComplete
              completeMethod={completeMethod}
              onChange={_onChange}
              suggestions={suggestions}
              value={inputValue}
              field={field}
              dropdown={dropdown}
              className={classNames(`${className}`, { "p-invalid": errorInfo })}
              {...props}
            />
            {label && <label className={`${isRequired ? "p-rb-mandatory" : ""}`}>{label}</label>}
          </span>
          {errorInfo && <small className="p-error block p-rb-error">{errorInfo}</small>}
        </div>
      );
    } else {
      return <RbLabel label={label} content={inputValue ? inputValue[field] : ""} nullTip={nullTip} />;
    }
  }
);

RbAutoComplete.propTypes = {
  label: PropTypes.string,
  api: PropTypes.string,
  value: PropTypes.any,
  editable: PropTypes.bool,
  nullTip: PropTypes.string,
  onChange: PropTypes.func,
  resourceAccessKey: PropTypes.string,
  businessTypeId: PropTypes.string,
  resourceId: PropTypes.string,
  rules: PropTypes.array,
  name: PropTypes.string,
  isSearchId: PropTypes.bool,
  dropdown: PropTypes.bool,
  field: PropTypes.string.isRequired,
  valueFields: PropTypes.array,
  labelFields: PropTypes.array,
  joinTagValue: PropTypes.string,
  joinTagLabel: PropTypes.string,
};
