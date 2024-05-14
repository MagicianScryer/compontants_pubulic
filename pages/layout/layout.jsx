import { Footer } from './footer';
import { Menu } from './menu';
import { Topbar } from './topbar';

export const Layout = (props) => {

  return (
    <div className="layout-wrapper layout-light">
      <Topbar />
      <div className="layout-content">
        <Menu />
        <div className="layout-content-slot">{props.children}</div>
      </div>
      <Footer /> 
    </div>
  );
}
