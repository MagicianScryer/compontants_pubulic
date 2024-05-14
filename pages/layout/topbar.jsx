import { useEffect, useRef } from 'react';
import Logo from '@/public/logo.png';

export const Topbar = (props) => {

  const containerElement = useRef(null);
  const scrollListener = useRef();

  const bindScrollListener = () => {
    scrollListener.current = () => {
      if (containerElement && containerElement.current) {
        if (window.scrollY > 0) containerElement.current.classList.add('layout-topbar-sticky');
        else containerElement.current.classList.remove('layout-topbar-sticky');
      }
    };

    window.addEventListener('scroll', scrollListener.current);
  };

  const unbindScrollListener = () => {
    if (scrollListener.current) {
      window.removeEventListener('scroll', scrollListener.current);
      scrollListener.current = null;
    }
  };

  useEffect(() => {
    bindScrollListener();

    return function unbind() {
      unbindScrollListener();
    };
  }, []);

  return (
    <div ref={containerElement} className="layout-topbar">
      <div className="layout-topbar-inner">
        <div className="layout-topbar-logo-container">
          <a className="layout-topbar-logo" aria-label="RuiBai logo">
            <img src={Logo} className="w-5rem"/>
          </a>
        </div>
      </div>
    </div>
  );
}
