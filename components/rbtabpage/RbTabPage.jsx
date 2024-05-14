import { PrimeReactContext, ariaLabel } from 'primereact/api';
import { ComponentBase, useHandleStyle } from 'primereact/componentbase';
import { useMergeProps, useMountEffect, useUpdateEffect } from 'primereact/hooks';
import { ChevronLeftIcon } from 'primereact/icons/chevronleft';
import { ChevronRightIcon } from 'primereact/icons/chevronright';
import { TimesIcon } from 'primereact/icons/times';
import { Ripple } from 'primereact/ripple';
import { classNames, DomHandler, IconUtils, ObjectUtils, UniqueComponentId, mergeProps } from 'primereact/utils';
import { Children, useContext, useImperativeHandle, useState, useEffect, useRef, forwardRef} from 'react';
import { WmfModule } from '@components/rbwmf/RbWmf';
import { RuiBaiTabPageContext } from '@commons/rbcontext/RuiBaiTabPageContext';

const classes = {
  navcontent: 'p-tabview-nav-content',
  nav: 'p-tabview-nav',
  inkbar: 'p-tabview-ink-bar',
  panelcontainer: ({ props }) => classNames('p-tabview-panels', props.panelContainerClassName),
  prevbutton: 'p-tabview-nav-prev p-tabview-nav-btn p-link',
  nextbutton: 'p-tabview-nav-next p-tabview-nav-btn p-link',
  root: ({ props }) =>
      classNames(
          'p-tabview p-component',
          {
              'p-tabview-scrollable': props.scrollable
          },
          props.className
      ),
  navcontainer: 'p-tabview-nav-container',
  tab: {
      header: ({ selected, disabled, headerClassName, _className }) => classNames('p-unselectable-text', { 'p-tabview-selected p-highlight': selected, 'p-disabled': disabled }, headerClassName, _className),
      headertitle: 'p-tabview-title',
      headeraction: 'p-tabview-nav-link',
      content: ({ props, selected, getTabProp, tab, isSelected, shouldUseTab, index }) =>
          shouldUseTab(tab, index) && (!props.renderActiveOnly || isSelected(index)) ? classNames(getTabProp(tab, 'contentClassName'), getTabProp(tab, 'className'), 'p-tabview-panel', { 'p-hidden': !selected }) : undefined
  }
};

const styles = `
@layer primereact {
  .p-tabview-nav-container {
      position: relative;
  }
  
  .p-tabview-scrollable .p-tabview-nav-container {
      overflow: hidden;
  }
  
  .p-tabview-nav-content {
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      scrollbar-width: none;
      overscroll-behavior: contain auto;
      position: relative;
  }
  
  .p-tabview-nav {
      display: flex;
      margin: 0;
      padding: 0;
      list-style-type: none;
      flex: 1 1 auto;
  }
  
  .p-tabview-nav-link {
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      position: relative;
      text-decoration: none;
      overflow: hidden;
  }
  
  .p-tabview-ink-bar {
      display: none;
      z-index: 1;
  }
  
  .p-tabview-nav-link:focus {
      z-index: 1;
  }
  
  .p-tabview-close {
      z-index: 1;
  }
  
  .p-tabview-title {
      line-height: 1;
      white-space: nowrap;
  }
  
  .p-tabview-nav-btn {
      position: absolute;
      top: 0;
      z-index: 2;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  
  .p-tabview-nav-prev {
      left: 0;
  }
  
  .p-tabview-nav-next {
      right: 0;
  }
  
  .p-tabview-nav-content::-webkit-scrollbar {
      display: none;
  }
}
`;

const inlineStyles = {
  tab: {
      header: ({ headerStyle, _style }) => ({ ...(headerStyle || {}), ...(_style || {}) }),
      content: ({ props, getTabProp, tab, isSelected, shouldUseTab, index }) =>
          shouldUseTab(tab, index) && (!props.renderActiveOnly || isSelected(index)) ? { ...(getTabProp(tab, 'contentStyle') || {}), ...(getTabProp(tab, 'style') || {}) } : undefined
  }
};

export const TabViewBase = ComponentBase.extend({
  defaultProps: {
      __TYPE: 'TabView',
      id: null,
      model: null,
      activeIndex: 0,
      className: null,
      onBeforeTabOpen: null,
      onBeforeTabChange: null,
      onBeforeTabClose: null,
      onTabOpen: null,
      onTabChange: null,
      onTabClose: null,
      panelContainerClassName: null,
      panelContainerStyle: null,
      renderActiveOnly: true,
      scrollable: false,
      style: null,
      children: undefined
  },
  css: {
      classes,
      styles,
      inlineStyles
  }
});

export const TabPanelBase = ComponentBase.extend({
  defaultProps: {
      __TYPE: 'TabPanel',
      wmf: null,
      className: null,
      closable: false,
      contentClassName: null,
      contentStyle: null,
      disabled: false,
      header: null,
      headerClassName: null,
      headerStyle: null,
      headerTemplate: null,
      leftIcon: null,
      rightIcon: null,
      prevButton: null,
      nextButton: null,
      closeIcon: null,
      style: null,
      children: undefined,
      visible: true
  },
  getCProp: (tab, name) => ObjectUtils.getComponentProp(tab, name, TabPanelBase.defaultProps),
  getCProps: (tab) => ObjectUtils.getComponentProps(tab, TabPanelBase.defaultProps),
  getCOtherProps: (tab) => ObjectUtils.getComponentDiffProps(tab, TabPanelBase.defaultProps)
});

export const RbTabPanel = () => {};

export const RbTabPage = forwardRef((inProps, ref) => {
    const mergeProps = useMergeProps();
    const context = useContext(PrimeReactContext);
    const props = TabViewBase.getProps(inProps, context);
    const { pageState, pageStateDispatch } = useContext(RuiBaiTabPageContext);

    const [idState, setIdState] = useState(props.id);
    const [tabs, setTabs] = useState([]);
    const [backwardIsDisabledState, setBackwardIsDisabledState] = useState(true);
    const [forwardIsDisabledState, setForwardIsDisabledState] = useState(false);
    const [activeIndexState, setActiveIndexState] = useState(props.activeIndex);
    const elementRef = useRef(null);
    const contentRef = useRef(null);
    const navRef = useRef(null);
    const inkbarRef = useRef(null);
    const prevBtnRef = useRef(null);
    const nextBtnRef = useRef(null);
    const tabsRef = useRef({});
    const activeIndex = props.onTabChange ? props.activeIndex : activeIndexState;
    const count = Children.count(props.children);

    const metaData = {
        props,
        state: {
            id: idState,
            isPrevButtonDisabled: backwardIsDisabledState,
            isNextButtonDisabled: forwardIsDisabledState,
            activeIndex: activeIndexState
        }
    };

    const { ptm, ptmo, cx, sx, isUnstyled } = TabViewBase.setMetaData({
        ...metaData
    });

    useHandleStyle(TabViewBase.css.styles, isUnstyled, { name: 'tabpage' });

    const getTabPT = (tab, key, index) => {
      const tabMetaData = {
          props: tab.props,
          parent: metaData,
          context: {
              index,
              count,
              first: index === 0,
              last: index === count - 1,
              active: index == activeIndexState,
              disabled: getTabProp(tab, 'disabled')
          }
      };

      return mergeProps(ptm(`tab.${key}`, { tab: tabMetaData }), ptm(`tabpanel.${key}`, { tabpanel: tabMetaData }), ptm(`tabpanel.${key}`, tabMetaData), ptmo(getTabProp(tab, 'pt'), key, tabMetaData));
    };
  
    const isSelected = (index) => index === activeIndex;
    const getTabProp = (tab, name) => TabPanelBase.getCProp(tab, name);

    const shouldUseTab = (tab) => {
      return tab && getTabProp(tab, 'visible') && ObjectUtils.isValidChild(tab, 'TabPanel');
    };

    const initialModel = () => {
      let id = idState;
      if (!id) {
        id = UniqueComponentId();
        setIdState(id);
      };
      pageStateDispatch(
        {
          type: '01',
          activeIndex: activeIndex
        }
      );
      if (props.model) {
        setTabs(props.model.map((tab) => {
          tab.key = tab.key || tab.id || id + "_key_" + UniqueComponentId();
          const _page = {
            id: tab.key,
            header: tab.header,
            schema: tab.schema,
            module: tab.module,
            wmf: tab.wmf
          };
          const _chain = [_page];
          pageStateDispatch(
            {
              type: '02',
              page: _page,
              chain: _chain
            }
          );
          return { ...tab };
        }));
      } else {
        setTabs(Children.map(props.children, (tab) => {
          if (shouldUseTab(tab)) {
            const tabitem = TabPanelBase.getCProps(tab);
            tabitem.key = tabitem.key || tabitem.id || id + "_key_" + UniqueComponentId();
            const _page = {
              id: tabitem.key,
              header: tabitem.header,
              schema: tabitem.schema,
              module: tabitem.module,
              wmf: tabitem.wmf
            };
            const _chain = [_page];
            pageStateDispatch(
              {
                type: '02',
                page: _page,
                chain: _chain
              }
            );
            return { ...tabitem };
          }
        }));
      }
    };

    const findVisibleActiveTab = (i) => {
      const tabsInfo = tabs.map((tab, index) => {
        return { tab, index };
      });
      return tabsInfo.reverse().find(({ tab, index }) => !getTabProp(tab, 'disabled') && i > index) || tabsInfo.reverse().find(({ tab, index }) => !getTabProp(tab, 'disabled') && index >= i);
    };

    const onTabHeaderOpen = (event, tab) => {
        event.preventDefault();

        const { onBeforeTabOpen, onTabOpen } = props;

        // give caller a chance to stop the selection
        if (onBeforeTabOpen && onBeforeTabOpen({ originalEvent: event, index }) === false) {
          return;
        }

        tab.key = tab.key || tab.id || id + "_key_" + UniqueComponentId();
        const _page = {
          id: tab.key,
          header: tab.header,
          schema: tab.schema,
          module: tab.module,
          wmf: tab.wmf
        };
        const _chain = [_page];
        pageStateDispatch(
          {
            type: '21',
            page: _page,
            chain: _chain
          }
        );

        setTabs([...tabs, tab]);
        setActiveIndexState(_activeIndex);

        if (onTabOpen) {
          onTabOpen({ originalEvent: event, index });
        }
    }

    const onTabHeaderClose = (event, index) => {
        event.preventDefault();

        const { onBeforeTabClose, onTabClose } = props;

        // give caller a chance to stop the selection
        if (onBeforeTabClose && onBeforeTabClose({ originalEvent: event, index }) === false) {
            return;
        }

        tabs.splice(index, 1);
        setTabs([...tabs]);

        pageStateDispatch(
          {
            type: '31',
            index: index
          }
        );

        if (onTabClose) {
            onTabClose({ originalEvent: event, index });
        }
    };

    const onTabHeaderClick = (event, tab, index) => {
      changeActiveIndex(event, tab, index);
    };

    const changeActiveIndex = (event, tab, index) => {
        event.preventDefault();

        if (!getTabProp(tab, 'disabled')) {
            // give caller a chance to stop the selection
            if (props.onBeforeTabChange && props.onBeforeTabChange({ originalEvent: event, index }) === false) {
                return;
            }

            if (props.onTabChange) {
              props.onTabChange({ originalEvent: event, index });
              pageStateDispatch(
                {
                  type: '11',
                  activeIndex: index
                }
              );
            } else {
              setActiveIndexState(index);
            }
        }

        updateScrollBar({ index });
    };

    const onKeyDown = (event, tab, index) => {
      switch (event.code) {
          case 'ArrowLeft':
              onTabArrowLeftKey(event);
              break;

          case 'ArrowRight':
              onTabArrowRightKey(event);
              break;

          case 'Home':
              onTabHomeKey(event);
              break;

          case 'End':
              onTabEndKey(event);
              break;

          case 'PageDown':
              onPageDownKey(event);
              break;

          case 'PageUp':
              onPageUpKey(event);
              break;

          case 'Enter':
          case 'Space':
              onTabEnterKey(event, tab, index);
              break;

          default:
              break;
      }
    };

    const onTabArrowRightKey = (event) => {
        const nextHeaderAction = findNextHeaderAction(event.target.parentElement);

        nextHeaderAction ? changeFocusedTab(nextHeaderAction) : onTabHomeKey(event);
        event.preventDefault();
    };

    const onTabArrowLeftKey = (event) => {
        const prevHeaderAction = findPrevHeaderAction(event.target.parentElement);

        prevHeaderAction ? changeFocusedTab(prevHeaderAction) : onTabEndKey(event);
        event.preventDefault();
    };

    const onTabHomeKey = (event) => {
        const firstHeaderAction = findFirstHeaderAction();

        changeFocusedTab(firstHeaderAction);
        event.preventDefault();
    };

    const onTabEndKey = (event) => {
        const lastHeaderAction = findLastHeaderAction();

        changeFocusedTab(lastHeaderAction);
        event.preventDefault();
    };

    const onPageDownKey = (event) => {
        updateScrollBar({ index: React.Children.count(props.children) - 1 });
        event.preventDefault();
    };

    const onPageUpKey = (event) => {
        updateScrollBar({ index: 0 });
        event.preventDefault();
    };

    const onTabEnterKey = (event, tab, index) => {
        changeActiveIndex(event, tab, index);
        event.preventDefault();
    };

    const findNextHeaderAction = (tabElement, selfCheck = false) => {
        const headerElement = selfCheck ? tabElement : tabElement.nextElementSibling;

        return headerElement
            ? DomHandler.getAttribute(headerElement, 'data-p-disabled') || DomHandler.getAttribute(headerElement, 'data-pc-section') === 'inkbar'
                ? findNextHeaderAction(headerElement)
                : DomHandler.findSingle(headerElement, '[data-pc-section="headeraction"]')
            : null;
    };

    const findPrevHeaderAction = (tabElement, selfCheck = false) => {
        const headerElement = selfCheck ? tabElement : tabElement.previousElementSibling;

        return headerElement
            ? DomHandler.getAttribute(headerElement, 'data-p-disabled') || DomHandler.getAttribute(headerElement, 'data-pc-section') === 'inkbar'
                ? findPrevHeaderAction(headerElement)
                : DomHandler.findSingle(headerElement, '[data-pc-section="headeraction"]')
            : null;
    };

    const findFirstHeaderAction = () => {
        return findNextHeaderAction(navRef.current.firstElementChild, true);
    };

    const findLastHeaderAction = () => {
        return findPrevHeaderAction(navRef.current.lastElementChild, true);
    };

    const changeFocusedTab = (element) => {
        if (element) {
            DomHandler.focus(element);
            updateScrollBar({ element });
        }
    };

    const updateInkBar = () => {
        const tabHeader = tabsRef.current[`tab_${activeIndex}`];

        inkbarRef.current.style.width = DomHandler.getWidth(tabHeader) + 'px';
        inkbarRef.current.style.left = DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(navRef.current).left + 'px';
    };

    const updateScrollBar = ({index, element}) => {
        let tabHeader = element || tabsRef.current[`tab_${index}`];

        if (tabHeader && tabHeader.scrollIntoView) {
            tabHeader.scrollIntoView({ block: 'nearest' });
        }
    };

    const updateButtonState = () => {
        const { scrollLeft, scrollWidth } = contentRef.current;
        const width = DomHandler.getWidth(contentRef.current);

        setBackwardIsDisabledState(scrollLeft === 0);
        setForwardIsDisabledState(scrollLeft === scrollWidth - width);
    };

    const onScroll = (event) => {
        props.scrollable && updateButtonState();
        event.preventDefault();
    };

    const getVisibleButtonWidths = () => {
        return [prevBtnRef.current, nextBtnRef.current].reduce((acc, el) => (el ? acc + DomHandler.getWidth(el) : acc), 0);
    };

    const navBackward = () => {
        const width = DomHandler.getWidth(contentRef.current) - getVisibleButtonWidths();
        const pos = contentRef.current.scrollLeft - width;

        contentRef.current.scrollLeft = pos <= 0 ? 0 : pos;
    };

    const navForward = () => {
        const width = DomHandler.getWidth(contentRef.current) - getVisibleButtonWidths();
        const pos = contentRef.current.scrollLeft + width;
        const lastPos = contentRef.current.scrollWidth - width;

        contentRef.current.scrollLeft = pos >= lastPos ? lastPos : pos;
    };

    const reset = () => {
        setBackwardIsDisabledState(true);
        setForwardIsDisabledState(false);

        if (props.onTabChange) {
          props.onTabChange({ index: activeIndex });
          pageStateDispatch(
            {
              type: '11',
              activeIndex: activeIndex
            }
          );
        } else {
          setActiveIndexState(props.activeIndex);
        }
    };

    useEffect(() => {
        updateInkBar();
        updateButtonState();
    });

    useMountEffect(() => {
        initialModel();
    });

    useUpdateEffect(() => {
      updateScrollBar(activeIndexState);
      pageStateDispatch(
        {
          type: '11',
          activeIndex: activeIndexState
        }
      );
    }, [activeIndexState]);

    useUpdateEffect(() => {
      if (pageState.closeMenu >= 0) {
        if (pageState.closeMenu <= activeIndex) {
          const tabInfo = findVisibleActiveTab(activeIndex);
          if (tabInfo) {
            setActiveIndexState(tabInfo.index);
          }
        }
        pageStateDispatch(
          {
            type: '32'
          }
        );
      }
    }, [tabs]);

    useUpdateEffect(() => {
        if (props.activeIndex !== activeIndexState) {
            updateScrollBar(props.activeIndex);
        }
    }, [props.activeIndex]);

    useImperativeHandle(ref, () => ({
        props,
        reset,
        openTab: onTabHeaderOpen,
        getElement: () => elementRef.current
    }));

    const createTabHeader = (tab, index) => {
        const selected = isSelected(index);
        const { headerStyle, headerClassName, style: _style, className: _className, disabled, leftIcon, rightIcon, header, headerTemplate, closable, closeIcon } = tab;
        const headerId = idState + '_header_' + index;
        const ariaControls = idState + '_content_' + index;
        const tabIndex = disabled || !selected ? -1 : 0;
        const leftIconElement = leftIcon && IconUtils.getJSXIcon(leftIcon, undefined, { props });
        const headerTitleProps = mergeProps(
            {
                className: cx('tab.headertitle')
            },
            getTabPT(tab, 'headertitle', index)
        );
        const titleElement = <span {...headerTitleProps}>{header}</span>;
        const rightIconElement = rightIcon && IconUtils.getJSXIcon(rightIcon, undefined, { props });
        const iconClassName = 'p-tabview-close';
        const icon = closeIcon || <TimesIcon className={iconClassName} onClick={(e) => onTabHeaderClose(e, index)} />;
        const closableIconElement = closable ? IconUtils.getJSXIcon(icon, { className: iconClassName, onClick: (e) => onTabHeaderClose(e, index) }, { props }) : null;

        const headerActionProps = mergeProps(
            {
                id: headerId,
                role: 'tab',
                className: cx('tab.headeraction'),
                tabIndex,
                'aria-controls': ariaControls,
                'aria-selected': selected,
                'aria-disabled': disabled,
                onClick: (e) => onTabHeaderClick(e, tab, index),
                onKeyDown: (e) => onKeyDown(e, tab, index)
            },
            getTabPT(tab, 'headeraction', index)
        );

        let content = (
            // eslint-disable /
            <a {...headerActionProps}>
                {leftIconElement}
                {titleElement}
                {rightIconElement}
                {closableIconElement}
                <Ripple />
            </a>
            // eslint-enable /
        );

        if (headerTemplate) {
            const defaultContentOptions = {
                className: 'p-tabview-nav-link',
                titleClassName: 'p-tabview-title',
                onClick: (e) => onTabHeaderClick(e, tab, index),
                onKeyDown: (e) => onKeyDown(e, tab, index),
                leftIconElement,
                titleElement,
                rightIconElement,
                element: content,
                props,
                index,
                selected,
                ariaControls
            };

            content = ObjectUtils.getJSXElement(headerTemplate, defaultContentOptions);
        }

        const headerProps = mergeProps(
            {
                key: tab.key,
                ref: (el) => (tabsRef.current[`tab_${index}`] = el),
                className: cx('tab.header', { selected, disabled, headerClassName, _className }),
                style: sx('tab.header', { headerStyle, _style }),
                role: 'presentation'
            },
            getTabPT(tab, 'root', index),
            getTabPT(tab, 'header', index)
        );

        return <li {...headerProps}>{content}</li>;
    };

    const createNavigator = () => {
        const headers = tabs.map((tab, index) => {
          return createTabHeader(tab, index);
        });

        const navContentProps = mergeProps(
            {
                id: idState,
                ref: contentRef,
                className: cx('navcontent'),
                style: props.style,
                onScroll
            },
            ptm('navcontent')
        );

        const navProps = mergeProps(
            {
                ref: navRef,
                className: cx('nav'),
                role: 'tablist'
            },
            ptm('nav')
        );

        const inkbarProps = mergeProps(
            {
                ref: inkbarRef,
                'aria-hidden': 'true',
                role: 'presentation',
                className: cx('inkbar')
            },
            ptm('inkbar')
        );

        return (
            <div {...navContentProps}>
                <ul {...navProps}>
                    {headers}
                    <li {...inkbarProps}></li>
                </ul>
            </div>
        );
    };

    const createContent = () => {
        const panelContainerProps = mergeProps(
            {
                className: cx('panelcontainer'),
                style: props.panelContainerStyle
            },
            ptm('panelcontainer')
        );

        const contents = tabs.map((tab, index) => {
          if (!props.renderActiveOnly || isSelected(index)) {
            const selected = isSelected(index);
            const contentId = idState + '_content_' + index;
            const ariaLabelledBy = idState + '_header_' + index;
            const contentProps = mergeProps(
              {
                  id: contentId,
                  key: tab.key,
                  className: cx('tab.content', { props, selected, tab, isSelected, shouldUseTab, index }),
                  style: sx('tab.content', { props, tab, isSelected, shouldUseTab, index }),
                  role: 'tabpanel',
                  'aria-labelledby': ariaLabelledBy,
                  'aria-hidden': !selected
              },
              TabPanelBase.getCOtherProps(tab),
              getTabPT(tab, 'root', index),
              getTabPT(tab, 'content', index)
            );

            if (tab.wmf) {
              return <div {...contentProps}>{!props.renderActiveOnly ? <WmfModule { ...tab.wmf }></WmfModule> : selected && <WmfModule { ...tab.wmf }></WmfModule>}</div>
            } else {
              return <div {...contentProps}>{!props.renderActiveOnly ? tab.children : selected && tab.children }</div>
            }
          }
        });
        
        return <div {...panelContainerProps}>{contents}</div>;
    };

    const createPrevButton = () => {
        const prevIconProps = mergeProps(
            {
                'aria-hidden': 'true'
            },
            ptm('previcon')
        );
        const icon = props.prevButton || <ChevronLeftIcon {...prevIconProps} />;
        const leftIcon = IconUtils.getJSXIcon(icon, { ...prevIconProps }, { props });
        const prevButtonProps = mergeProps(
            {
                ref: prevBtnRef,
                type: 'button',
                className: cx('prevbutton'),
                'aria-label': ariaLabel('previousPageLabel'),
                onClick: (e) => navBackward(e)
            },
            ptm('prevbutton')
        );

        if (props.scrollable && !backwardIsDisabledState) {
            return (
                <button {...prevButtonProps}>
                    {leftIcon}
                    <Ripple />
                </button>
            );
        }
    };

    const createNextButton = () => {
        const nextIconProps = mergeProps(
            {
                'aria-hidden': 'true'
            },
            ptm('nexticon')
        );
        const icon = props.nextButton || <ChevronRightIcon {...nextIconProps} />;
        const rightIcon = IconUtils.getJSXIcon(icon, { ...nextIconProps }, { props });
        const nextButtonProps = mergeProps(
            {
                ref: nextBtnRef,
                type: 'button',
                className: cx('nextbutton'),
                'aria-label': ariaLabel('nextPageLabel'),
                onClick: (e) => navForward(e)
            },
            ptm('nextbutton')
        );

        if (props.scrollable && !forwardIsDisabledState) {
            return (
                <button {...nextButtonProps}>
                    {rightIcon}
                    <Ripple />
                </button>
            );
        }
    };

    const rootProps = mergeProps(
        {
            id: idState,
            ref: elementRef,
            style: props.style,
            className: cx('root')
        },
        TabViewBase.getOtherProps(props),
        ptm('root')
    );

    const navContainerProps = mergeProps(
        {
            className: cx('navcontainer')
        },
        ptm('navcontainer')
    );
    const navigator = createNavigator();
    const content = createContent();
    const prevButton = createPrevButton();
    const nextButton = createNextButton();

    return (
        <div {...rootProps}>
            <div {...navContainerProps}>
                {prevButton}
                {navigator}
                {nextButton}
            </div>
            {content}
        </div>
    );
});

RbTabPanel.displayName = 'TabPanel';
RbTabPage.displayName = 'TabPage';
