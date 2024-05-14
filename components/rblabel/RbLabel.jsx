import React from 'react';
import { classNames } from 'primereact/utils';
import PropTypes from 'prop-types';
import { Tooltip } from 'primereact/tooltip';

export const RbLabel = ({tooltipStatus = false, id, label, className, nullTip = 'N/A', content, options, inputValue, showField, valueField, style={} }) => {
  return (
    <>
      <div className="p-data-label w-full p-rb-label">
        {
          tooltipStatus && <Tooltip target=".p-rb-label-left" /> 
        }
        {
          Array.isArray(options) ? 
          (
            <>
            {
              options && Array.isArray(inputValue)  && options.map(i => {
                if (inputValue.includes(i[valueField])) {
                  return (
                    <span  key={i[valueField]} data-pr-tooltip={i ? i[showField] : nullTip} className={classNames('p-float-content', 'p-rb-label-left', className)} style={{ marginRight: 20 }}>
                      {i ? i[showField] : nullTip}
                    </span>
                  );
                } else {
                  return null;
                }
              })
            }
          </>
          )
          :
          (
            <>
                <span className="p-rb-label-text">
                  <span >{label}</span>
                </span>
                {
                  (
                    <span  className={classNames('p-float-content', 'p-rb-label-left', className)} style={{...style,  wordWrap: 'break-word'}} data-pr-tooltip={content ? content : nullTip}>
                      {content ? content : nullTip}
                    </span>
                  )
                }
           </>
          )
          
        }






      </div>
    </>
  );
};
RbLabel.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  nullTip: PropTypes.string,
  content: PropTypes.any,
  style: PropTypes.string
};
