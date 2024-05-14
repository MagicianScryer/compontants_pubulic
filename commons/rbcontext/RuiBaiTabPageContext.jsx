import { createContext, useState, useReducer } from 'react';

/**
 * 标签页 Context
 */
export const RuiBaiTabPageContext = createContext();

export const RuiBaiTabPageProvider = (props) => {
  const [pageState, pageStateDispatch] = useReducer(pageStateReducer, { activeMenu: 0 });

  const funcSwitchMenu = (menu) => {
    setActiveMenu(menu);
  };

  const value = {
    funcSwitchMenu,
    pageState,
    pageStateDispatch
  };

  return (
    <>
      <RuiBaiTabPageContext.Provider value={value}>
        {props.children}
      </RuiBaiTabPageContext.Provider>
    </>
  );
};

export const pageStateReducer = (_pageState, action) => {
  // action.type
  // 01 -- initialize
  // 02 -- add page
  // 11 -- change page
  // 12 -- change bread
  // 21 -- open page
  // 22 -- open bread
  // 31 -- close page
  // 32 -- reset close
  switch (action.type) {
    case '01': {
      // 01 -- initialize
      return {
        activeMenu: action.activeIndex,
        closeMenu: -1,
        activeBread: [],
        pages: [],
        chains: []
      };
    }
    case '02': {
      // 02 -- add page
      _pageState.pages.push(action.page);
      _pageState.chains.push(action.chain);
      _pageState.activeBread.push(0);
      return _pageState;
    }
    case '11': {
      // 11 -- change page
      return {
        ..._pageState,
        activeMenu: action.activeIndex
      };
    }
    case '12': {
      // 12 -- change bread
      _pageState.chains[_pageState.activeMenu].length = action.activeIndex + 1;
      _pageState.activeBread[_pageState.activeMenu] = action.activeIndex;
      return _pageState;
    }
    case '21': {
      // 21 -- open page
      _pageState.activeMenu = _pageState.pages.length;
      _pageState.pages.push(action.page);
      _pageState.chains.push(action.chain);
      _pageState.activeBread.push(0);
      return _pageState;
    }
    case '22': {
      // 22 -- open bread
      _pageState.chains[_pageState.activeMenu].push(action.chain);
      _pageState.activeBread[_pageState.activeMenu] += 1;
      return _pageState;
    }
    case '31': {
      // 31 -- close page
      _pageState.pages.splice(action.index, 1);
      _pageState.chains.splice(action.index, 1);
      _pageState.activeBread.splice(action.index, 1);
      _pageState.closeMenu = action.index;
      return _pageState;
    }
    case '32': {
      // 32 -- reset close
      _pageState.closeMenu = -1;
      return _pageState;
    }
  }
}