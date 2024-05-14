import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';

export const RbDataTable = forwardRef(
  (
    {
      dialog,
      addTableColumn,
      paginator = true,
      menuAuthCallback,
      closeBox,
      toolbar, column, menuModel = [], totalRecords, rows, onPageChange, value, editMode = 'row', dataKey = 'id', editComplete, setCheckboxData, checkboxData = null,
      first = 0,
      resourceCd,
      refFun,
      isCheckbox,
      isOrder = true,
      idGroup,
      onCellClick,
      selectionModeStr = 'multiple',
      selectionMode,
      linkRouterMap,
      dataTableSelectionMode,
      overlayPanelTableShow,
      overlayPanelTableParams,
      menuAuthCallbackAsync,
      ContextMenuHide,
      columnProps={},
      onCellEditComplete=null,
      // size='small',
      rowClassName = null,
      rowClassNameString,
      ...props
    },
    reftable
  ) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [selectDatas, setSelectDatas] = useState(null);
    const [dataSourceEditRow, setDataSourceEditRow] = useState({});
    const [addData, setAddData] = useState([]);
    const [cellActive, setCellActive] = useState(true);
    const cm = useRef(null);
    const intl = useIntl();
    const { style, closeDialog, confirmDialog, visible, isBatchAdd = true, ...dialogProps } = dialog || {};
    const refDataId = useRef('');
    const refDataField = useRef('');
    const overlayRef = useRef(null);
    const currentValue = useRef(null);

    const getInput = (options, config) => {
      const {callbackData, showCallback} = config;
      let showStatus  = true;
      let obj = {};
      if (callbackData) {
        obj = callbackData(options.rowData);
      }

      if (showCallback) {
        showStatus = showCallback(options.rowData)
      }
      return (
        showStatus ? <InputText value={options.value || ''} onChange={(e) => {
          currentValue.current = e.target.value;
          options.editorCallback(e.target.value);
        }} onKeyDown={(e) => e.stopPropagation()} {...config} {...obj} />
        : 
        options.value
      )
    }

    const _onCellEditComplete = (e) => {
      let { rowData, newValue, field, originalEvent } = e;
      if (originalEvent.code === 'Enter') {
        originalEvent.preventDefault();
        return;
      }
      const obj = {rowData, newValue: newValue, field, originalEvent};
      onCellEditComplete && onCellEditComplete(obj);
      currentValue.current = null;
    }

    const getDom = (type, config) => {
      switch(type) {
        case 'input' :
          return {editor: (options) =>  getInput(options, config) }
        }

    }

    const renderDom = (colu, temp) => {
      if (colu && Array.isArray(colu)) {
        colu.forEach(({ type, config,  key, field, addDefault, col, ...i }) => {
          if (i.customHeader) {
            temp.unshift(<Column key={key || field} field={field} {...i} />)
          } else if (type) {
            const tempConfig = config ? config : {};
            const obj =  getDom(type, tempConfig)
            temp.push( <Column key={key || field} field={field} {...i}  {...obj}/>)
          } else {
            temp.push( <Column key={key || field} field={field} {...i} />)
          }
        })
      } 
    };


    useEffect(() => {
      setSelectDatas(checkboxData);
    }, [checkboxData]);

    const renderColumn = () => {
      const columnTemp = []
      // field: 'section',
      if (isOrder) {
        columnTemp.unshift(
          <Column
            key={'000a012'}
            headerStyle={{ width: '5rem' }}
            field={'ordercustomdata'}
            header={intl.formatMessage({ id: 'comp.table.order' })}
            body={(a, b) => { return (b.rowIndex + first + 1); }}
          />); //
      }
      if (isCheckbox) {
        columnTemp.unshift(
        <Column
           exportable={false} 
           headerStyle={{ width: '2rem' }} 
           selectionMode={selectionMode || selectionModeStr} 
           key={'section'} 
           field={'sectioncol'} 
           {...columnProps}
        />
        ); //
      }

      renderDom(column, columnTemp);
      return columnTemp;
    };

    useEffect(() => {
      if (Array.isArray(value)) {
        if (Array.isArray(idGroup) && idGroup.length) {
          let temp = [];
          value.forEach(i => {
            let str = '';
            idGroup.forEach(j => str += i[j]);
            temp.push({ ...i, id: str });
          });
          setDataSource(temp);
        } else {
          setDataSource(value);
        }
      }
    }, [value]);

    const addTableData = () => {
      let temp = {};
      let len = addData.length + 1;
      let tempObj = {};
      if (addTableColumn && Array.isArray(addTableColumn)) {
        addTableColumn.forEach(i => {
          temp[i.field] = i.addDefault;
        });
        temp.id = len;
        setAddData([...addData, temp]);
        setEditId(`${len}`);
      }
    };

    useEffect(() => {
      if (visible && addData.length === 0) {
        addTableData();
      }
    }, [visible]);


    const setMenuData = async (e) => {
      let dataMap = null;
      if (menuAuthCallbackAsync) {
        dataMap = await menuAuthCallbackAsync(e.value, e);
      } else {
        dataMap = menuAuthCallback(e.value, e);//已经修改
      }
      let tempArray = [];
      // getContextmenuData(dataMap, tempArray, e.value, linkRouterMap, intl.formatMessage({ id: 'comp.no' }), e);
      setMenuList([...tempArray]);
      cm.current && cm.current.show(e.originalEvent);
    };

    const onRowEditComplete = (e) => {
      let dataSources = [...dataSource];
      let { newData, index } = e;
      dataSources[index] = newData;
      editComplete && editComplete(e);
      setDataSource(dataSources);
    };

    const isSameRef = useRef();
    const onSelectionChange = (e) => {
      let str = '';
      e.value.forEach(i => str = str + `${i[dataKey]}`);
      if (isSameRef.current !== str) {
        setSelectDatas(e.value);
        setCheckboxData && setCheckboxData(e.value);
      } else if (e.value.length === 0) {
        setSelectDatas(e.value);
        setCheckboxData && setCheckboxData(e.value);
      }
      isSameRef.current = str;
    };

    const currentRefField = useRef();
    const allHide = () => {
      setSelectDatas(null);
      currentRefField.current = '';
      overlayRef && overlayRef.current.hide();
      refDataId.current = '';
      refDataField.current = '';
    };

    const onSelectionChange3 = (e) => {
      e.originalEvent.stopPropagation();
      e.originalEvent.nativeEvent.stopImmediatePropagation();
      const overlayStatus = overlayPanelTableShow(e);
      if (overlayStatus) {
        if (e.value[0].field !== 'ordercustomdata' && e.value[0].field !== 'sectioncol') {
          if (refDataId.current === '' || (refDataId.current && (refDataId.current !== e.value[0]['rowData'][dataKey])) || (refDataField.current !== e.value[0].field)) {
            // overlayRef.current.hide();
            /* setTimeout(() => {
            }, 360); */
            // overlayRef.current.hide();
            // overlayRef.current.show(e.originalEvent);

            overlayRef.current.show(e.originalEvent);
            refDataId.current = e.value[0]['rowData'][dataKey];
            refDataField.current = e.value[0].field;
          } else {
            overlayRef.current.hide();
            refDataId.current = '';
            refDataField.current = '';
          }
          // debugger

          if (!selectDatas) {
            setSelectDatas(e.value);
            currentRefField.current = e.value[0];
          } else if (!selectDatas || e.value[0]['rowData'][dataKey] !== selectDatas[0]['rowData'][dataKey] || e.value[0].field !== currentRefField.current.field) {
            setSelectDatas(e.value);
            currentRefField.current = e.value[0];
          } else if (selectDatas && e.value[0]['rowData'][dataKey] === selectDatas[0]['rowData'][dataKey] && e.value[0].field === currentRefField.current.field) {
            setSelectDatas(null);
            currentRefField.current = '';
          } else {
            setSelectDatas(e.value);
            currentRefField.current = e.value[0];
          }
        } else if (e.value[0].field === 'ordercustomdata' || e.value[0].field === 'sectioncol') {
          allHide();
        }
      } else {
        allHide();
      }

    };

    const _rowClassName = (data) => {
      return rowClassName(data) || {'bg-primary': true };
    };
  
    const onRowEditChangeData = (e) => {
      setDataSourceEditRow(e.data);
    };


    const _onCellClick = (e) => {
      e.originalEvent.stopPropagation();
      e.originalEvent.nativeEvent.stopImmediatePropagation();

      if (onCellClick) {
        onCellClick(e);
      }
      const { rowData } = e;
      setCellIndex(rowData[dataKey]);
      setCellContent(e.field);
    };


    const clickFunc = useCallback(() => {
      setCellContent('');
    }, []);

    const onSelectDatas = useCallback(() => {
      // setSelectDatas('');
      allHide();
    }, []);

    useEffect(() => {
      if (onCellClick) {
        window.addEventListener('click', clickFunc, false);
      }
      let domroot = null;
      if (overlayPanelTableShow) {
        domroot = document.getElementById('root');
        domroot.addEventListener('click', onSelectDatas, false);
      }
      return () => {
        window.removeEventListener('click', clickFunc, false);
        if (domroot) {
          domroot.removeEventListener('click', onSelectDatas, false);
        }
      };
    }, []);


    return (
      <>
        <DataTable
          rowClassName={ rowClassName && _rowClassName}
          showGridlines
          ref={refFun}
          value={dataSource}
          scrollable
          //responsiveLayout="scroll"
          // pt={{thead:{style: {background: "#fff"}} }}
          cellSelection={(cellActive && !!onCellClick) || (cellActive && overlayPanelTableShow)}
          onCellClick={_onCellClick}

          selection={selectDatas}
          onSelectionChange={setCheckboxData ? onSelectionChange : overlayPanelTableShow ? onSelectionChange3 : null}

          paginator={false}

          editMode={editMode}
          dataKey={dataKey}
          onRowEditComplete={onRowEditComplete}
          onRowEditChange={onRowEditChangeData}
          editingRows={dataSourceEditRow}

          contextMenuSelection={selectedProduct}
          onContextMenuSelectionChange={e => {
            if ((menuAuthCallback || menuAuthCallbackAsync) && cm.current) {
              setCellActive(false);
              setMenuData(e);
              setSelectedProduct(e.value);
            }
          }}

          selectionMode={dataTableSelectionMode}
          size={"small"}
          {...props}
        >
          {
            renderColumn()
          }
        </DataTable>
      </>
    );
  });


RbDataTable.propTypes = {
  column: PropTypes.array.isRequired,
  totalRecords: PropTypes.number,
  onPageChange: PropTypes.func,
  editComplete: PropTypes.func,
  setCheckboxData: PropTypes.func,
  dialog: PropTypes.object,
  closeDialog: PropTypes.func,
  confirmDialog: PropTypes.func,
  paginator: PropTypes.bool,
  menuAuthCallback: PropTypes.func,
  // overlayRef:PropTypes.any,
  isBatchAdd: PropTypes.bool //是否批量添加 默认可以批量添加
};
