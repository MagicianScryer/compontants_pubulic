import { Splitter, SplitterPanel} from 'primereact/splitter';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { RbTabPage, RbTabPanel } from '@components/rbtabpage/RbTabPage';
import { RbText } from '../../../components/rbtext/RbText';
import { useState } from 'react';

const Component = (props) => {

  const [selectCity, setSelectCity] = useState(null);
  const [filterCity, setFilterCity] = useState(null);
  const cities = [
    { label: 'Berlin', value: 'Berlin' },
    { label: 'Frankfurt', value: 'Frankfurt' },
    { label: 'Hamburg', value: 'Hamburg' },
    { label: 'Munich', value: 'Munich' },
    { label: 'Chicago', value: 'Chicago' },
    { label: 'Los Angeles', value: 'Los Angeles' },
    { label: 'New York', value: 'New York' },
    { label: 'San Francisco', value: 'San Francisco' },
    { label: 'Kyoto', value: 'Kyoto' },
    { label: 'Osaka', value: 'Osaka' },
    { label: 'Tokyo', value: 'Tokyo' },
    { label: 'Yokohama', value: 'Yokohama' }
  ];

  const search = (event) => {

  }

  const items = [
    { header: '产品', leftIcon: 'fa fa-fog', id:'0000001181', schema: 'pjaa002a01', module: 'AA002009U01', wmf: {
      remoteName: 'pjaa002a01', moduleName: 'AA002009U01', remoteUrl: 'http://192.168.110.49', uiProxyMode: '1', parameter: null
    } },
    // { header: 'TR管理', leftIcon: 'fa fa-fog', id:'0000001181', schema: 'pjbb002i02', module: 'BB002097U01', wmf: {
    //   remoteName: 'pjbb002i02', moduleName: 'BB002097U01', remoteUrl: 'http://192.168.110.49', uiProxyMode: '1', parameter: null
    // } },
    // { header: 'MTiS数据源', leftIcon: 'fa fa-fog', id:'0000001182', schema: 'pjbd001a01', module: 'BD001001U01', wmf: {
    //   remoteName: 'pjbd001a01', moduleName: 'BD001001U01', remoteUrl: 'http://192.168.110.49', uiProxyMode: '1', parameter: null
    // } },
    // { header: 'MTA维修任务汇总', leftIcon: 'fa fa-fog', id:'0000001180', schema: 'pjbd002a01', module: 'BD002004U01', wmf: {
    //   remoteName: 'pjbd002a01', moduleName: 'BD002004U01', remoteUrl: 'http://192.168.110.49', uiProxyMode: '1', parameter: null
    // } },
    // { header: 'MTA维修任务库', leftIcon: 'fa fa-fog', id:'0000001179', schema: 'pjbd002a01', module: 'BD002007U01', wmf: {
    //   remoteName: 'pjbd002a01', moduleName: 'BD002007U01', remoteUrl: 'http://192.168.110.49', uiProxyMode: '1', parameter: null
    // } },
    // { header: '计划维修要求', leftIcon: 'fa fa-fog', id:'0000001177', schema: 'pjbb002i02', module: 'BB002096U01', wmf: {
    //   remoteName: 'pjbb002i02', moduleName: 'BB002096U01', remoteUrl: 'http://192.168.110.49', uiProxyMode: '1', parameter: null
    // } }
  ];

  return (
    <Splitter className='layout-splitter'>
      <SplitterPanel className='layout-splitter-panel' >
        <RbTabPage scrollable>
          <RbTabPanel header='tr' leftIcon='fa fa-fog' key='0000001181' closable>
            <RbText>12341</RbText>
          </RbTabPanel>
          <RbTabPanel header='mtis' leftIcon='fa fa-fog' key='0000001182' closable>
            <RbText>12342</RbText>
          </RbTabPanel>
          <RbTabPanel header='mta' leftIcon='fa fa-fog' key='0000001180' closable>
            <RbText>12343</RbText>
          </RbTabPanel>
          <RbTabPanel header='mtatask' leftIcon='fa fa-fog' key='0000001179' closable>
            <RbText>12344</RbText>
          </RbTabPanel>
          <RbTabPanel header='plan' leftIcon='fa fa-fog' key='0000001177' closable>
            <RbText>12345</RbText>
          </RbTabPanel>
        </RbTabPage>
      </SplitterPanel>
      <SplitterPanel className='layout-splitter-panel'><Button>2</Button>
        <AutoComplete value={selectCity} suggestions={filterCity} completeMethod={search}></AutoComplete>
      </SplitterPanel>
    </Splitter>
  )
}

export default Component;