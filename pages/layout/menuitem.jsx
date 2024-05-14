import { useRef } from 'react';
import { classNames } from 'primereact/utils';
import { StyleClass } from 'primereact/styleclass';
import { NavLink, useLocation } from 'react-router-dom';

export const MenuItem = (props) => {

  const location = useLocation();
  const { menuItem, root } = props;

  const btnRef = useRef(null);

  const isActiveRootmenuItem = (rootItem) => {
    return rootItem.children && !rootItem.children.some((item) => item.to === location.pathname || (item.children && item.children.some((it) => it.to === location.pathname)));
  };

  return (
    <li>
      {menuItem.children && root && (
        <StyleClass nodeRef={btnRef} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
          <button ref={btnRef} type="button" className="px-link">
            <span>{menuItem.name}</span>
            <i className="menu-toggle-icon pi pi-angle-down"></i>
          </button>
        </StyleClass>
      )}
      {menuItem?.to && (
        <NavLink to={menuItem?.to} end={menuItem.to === location.pathname}>
          {menuItem?.icon && root && (
            <span className="menu-icon">
              <i className={menuItem.icon}></i>
            </span>
          )}
          <span>{menuItem?.name}</span>
        </NavLink>
      )}
      {!root && menuItem.children && <span className="menu-child-category">{menuItem?.name}</span>}
      {menuItem?.children && (
        <div className={classNames('overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out', { hidden: menuItem.children && root && isActiveRootmenuItem(menuItem) })}>
          <ol>
            {menuItem.children.map((item, index) => (
              <MenuItem root={false} menuItem={item} key={`_root${index}`}></MenuItem>
            ))}
          </ol>
        </div>
      )}
    </li>
  );
}
