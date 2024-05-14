import { useState, useEffect } from 'react';
import { RbDataTable } from '../../../components/rbdatatable/RbDataTable';

const Component = (props) => {

  const data = [
    { 'id': '1000', rowIndex: '1000', rowData: '1000', 'code': '', 'name': 'Bamboo Watch', 'description': 'Product Description', 'image': 'bamboo-watch.jpg', 'price': 65, 'category': {cageCd: '', companyId: '005109', companyName: '测试', companyShortName: '测试'}, 'quantity': 24, 'inventoryStatus': '01', 'rating': 5 },
    { 'id': '10345',rowIndex: '10345', rowData: "10345",  'code': '', 'name': 'Bamboo Watch', 'description': 'Product Description', 'image': 'bamboo-watch.jpg', 'price': 65, 'category': {cageCd: '', companyId: '005109', companyName: '测试', companyShortName: '测试'}, 'quantity': 24, 'inventoryStatus': '01', 'rating': 5 },
    {'id': '1002', rowIndex: '1002', rowData: '1002','code': '0000000003','name': 'Blue Band','description': 'Product Description','image': 'blue-band.jpg','price': 79,'category':{cageCd: '', companyId: '005109', companyName: '测试', companyShortName: '测试'},'quantity': 2,'inventoryStatus': '01','rating': 3},
    {'id': '1003', rowIndex: '1003', rowData: '1003', 'code': '0000000003','name': 'Blue T-Shirt','description': 'Product Description','image': 'blue-t-shirt.jpg','price': 29,'category': {cageCd: '', companyId: '005109', companyName: '测试', companyShortName: '测试'},'quantity': 25,'inventoryStatus': '01','rating': 5},
  ];

  const column = [
    {
       field: 'inventoryStatus',
       header: '库存状态',
       addDefault: 'LOWSTOCK',
       type: 'input',
       config: {
          codeType:'SECURITY_CLASSIFICATION'
       }
    },
    {
       field: 'code',
       header: '代码',
       style:{width: '20%'},
       type: 'input',
       config: {
          api:'/api/pjaa002a01api/aa00200900api/queryProductionDp',
          isApi: true
       }
    },
    {
       field: 'name',
       header: '名字',
       style:{width: '20%'},
       type: 'input',
    },
    {
       field: 'category',
       header: '类别',
       key: 'category',
       style:{width: '20%'},
       type: 'input',
       body: (data) => {
          return data.category.companyName
       },
       config: {
          api: '/api/pjab001a01api/ab00100600api/fuzzySearchSupplierCpny',
          valueFields:['companyId'],
          labelFields:['companyName'],
          field:"companyName"

       }
    },
    {
       field: 'price',
       header: '价格',
       key: 'price',
       style:{width: '20%'}
    },

  ];

  const [products, setProducts] = useState(data);

  return (
    <div>
      <RbDataTable
        column={column}
        value={products}
        editMode='cellEdit'
        resizableColumns
        columnResizeMode='expand'
        onCellEditComplete={(e) => {
          let { rowData, newValue, field, originalEvent: event } = e;
          console.log("rowData =", rowData);
          console.log("newValue =", newValue);
          console.log("field =", field);
          console.log("event =", event)
        }}
      ></RbDataTable>
    </div>
  )
}

export default Component;