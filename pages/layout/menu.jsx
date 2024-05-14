import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import MenuData from '@/public/menu.json';
import { MenuItem } from './menuitem';

export const Menu = memo((props) => {

  const location = useLocation();

  const menu = MenuData.data.map((data) => {
    data.expanded = data.children && data.children.some((item) => item.to === location.pathname || (item.children && item.children.some((it) => it.to === location.pathname)));
    return data;
  });

  const scrollToActiveItem = () => {
    const activeItem = document.querySelector('.router-link-active');

    if (activeItem) {
      activeItem.scrollIntoView({ block: 'center' });
    }
  };

  useEffect(() => {
    scrollToActiveItem();
  }, []);

  const sidebarClassName = classNames('layout-sidebar');

  return (
    <aside className={sidebarClassName}>
      <nav>
        <ol className="layout-menu">
          {menu.map((item, index) => (
            <MenuItem menuItem={item} root={true} key={`_root${index}`} />
          ))}
        </ol>
      </nav>
    </aside>
  );
});
