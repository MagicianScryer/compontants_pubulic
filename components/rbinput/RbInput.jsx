import React, { forwardRef, memo, useState, useEffect, useImperativeHandle, useRef, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import PropTypes from 'prop-types';
import { classNames } from 'primereact/utils';
import { RbLabel } from '../rblabel/RbLabel';

const sizeMap = {
  'small': 'p-inputtext-sm',
  'lgrge': 'p-inputtext-lg',
  'middle': ''
};

let tiemOutStatu = null;

export const RbInput = memo(
  forwardRef(
    (
      {
        wrap=true,
        styles,
        minFractionDigits,
        nullTip,
        editable = true,
        trim = true,
        size = 'middle',
        type = 'text',
        onChange,
        label,
        iconLeft,
        iconRight,
        isRotate,
        name = 'name_custom',
        className,
        rules,
        rows = 3,
        onBlur,
        onIconRight,
        initialValue='',
        widthFull = false,
        deleteTop = false,
        tooltipStatus = false,
        ...props
      },
      ref
    ) => {
      const [inputValue, setInputValue] = useState(initialValue);
      const [errorInfo, setErrorInfo] = useState();
      const inputRef = useRef();
      const isValue = () => {
        return props.hasOwnProperty('value');
      };

      useEffect(() => {
        if (isValue()) {
          setInputValue(props.value);
        }
      }, [props.value]);

      const _onChange = (e) => {
       if (wrap === false) {
          e.target.value = e.target.value.replace(/\n/g, '')
        }
        if (!onChange) {
          setInputValue(e.target.value);
        } else {
          onChange(e);
        }
      };

      const getValue = () => {
        return isValue() ? props.value : inputValue;
      };

      useImperativeHandle(ref, () => ({
        setValue: (value) => {
          setInputValue(value);
        }
      }));

      const _onBlur = (e) => {
        if (minFractionDigits) {
          let v = e.target.value;
          if (isEmpty(v)) {
            v = v ? toNumber(v) : v;
            setInputValue(v.toFixed(minFractionDigits));
          }
        }
        onBlur && onBlur(e);
      };

      const { value, ...propsData } = props;
      return (
        <>
          {
            editable ?
              (
                <div className={classNames('p-rb-form', 'inputtextCustom', { 'p-rb-form-no-margin-bottom': deleteTop, 'flex-1': widthFull })} >
                  <span
                    className={
                      classNames(
                        { 'p-float-label': label, 'p-input-icon-left': iconLeft, 'p-input-icon-righr': iconRight, 'disabledCursorStyle': props.disabled }
                      )
                    }
                  // className={`${label && 'p-float-label'} ${iconLeft ? 'p-input-icon-left' : ''} ${iconRight ? 'p-input-icon-righr' : ''} ${props.disabled ? 'disabledCursorStyle' : ''}`}
                  >
                    {(iconLeft) && (<i className={`pi ${isRotate && 'pi-spin'} ${iconLeft ? iconLeft : ''}`} />)}
                    {
                      type === 'textarea' ?
                        (
                          <InputTextarea
                            {...propsData} ref={inputRef} onChange={_onChange} value={getValue()} className={classNames(`w-full  ${className} `, { 'p-invalid': errorInfo })}
                            rows={rows}
                            style={styles}
                          />
                        )
                        :
                        (
                          <InputText
                            onBlur={_onBlur}
                            {...propsData} ref={inputRef} onChange={_onChange} className={classNames(`w-full ${className}`, 'p-inputtext-sm', { 'p-invalid': errorInfo })} value={getValue()}
                            type={type}
                            style={styles}
                          />
                        )
                    }
                    {label && <label className={`${isRequired ? 'p-rb-mandatory' : ''}`}>{label}</label>}
                    {(iconRight) && (<i className={`pi rightIcon ${isRotate ? 'pi-spin' : ''} ${iconRight ? iconRight : ''}`} onClick={onIconRight} />)}
                  </span>
                  {
                    errorInfo && <small className="p-error block p-rb-error">{errorInfo}</small>
                  }
                </div>
              )
              :
              (
                <RbLabel label={label} tooltipStatus={tooltipStatus} content={getValue()} nullTip={nullTip} />
              )
          }
        </>

      );
    }
  )
);

RbInput.propTypes = {
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['number', 'text', 'password', 'textarea']),
  label: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  isRotate: PropTypes.bool,
  name: PropTypes.string,
  className: PropTypes.string,
  rules: PropTypes.array,
  value: PropTypes.any,
  trim: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'lgrge', 'middle']),
  editable: PropTypes.bool,
  nullTip: PropTypes.string
};
