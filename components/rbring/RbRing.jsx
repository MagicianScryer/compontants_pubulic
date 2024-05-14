import React from 'react';
import PrimeReact, { PrimeReactContext, localeOption } from 'primereact/api';
import { ComponentBase, useHandleStyle } from 'primereact/componentbase';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { ChevronLeftIcon } from 'primereact/icons/chevronleft';
import { ChevronRightIcon } from 'primereact/icons/chevronright';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { Ripple } from 'primereact/ripple';
import { useMergeProps, useMountEffect, usePrevious, useResizeListener, useUpdateEffect } from 'primereact/hooks';
import { DomHandler, IconUtils, ObjectUtils, UniqueComponentId, classNames } from 'primereact/utils';

const styles = `
@layer primereact {
    .p-ring {
        display: flex;
        flex-direction: column;
    }
    
    .p-ring-content {
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
    
    .p-ring-prev,
    .p-ring-next {
        align-self: center;
        flex-grow: 0;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
    }
    
    .p-ring-container {
        display: flex;
        flex-direction: row;
    }
    
    .p-ring-items-content {
        overflow: hidden;
        width: 100%;
    }
    
    .p-ring-items-container {
        display: flex;
        flex-direction: row;
    }
    
    .p-ring-items-group {
        flex: 1 0 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
    }
  
    .p-ring-indicators {
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .p-ring-indicator > button {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    /* Vertical */
    .p-ring-vertical .p-ring-container {
        flex-direction: column;
    }
    
    .p-ring-vertical .p-ring-items-container {
        flex-direction: column;
        height: 100%;
    }
    
    /* Keyboard Support */
    .p-items-hidden .p-ring-item {
        visibility: hidden;
    }
    
    .p-items-hidden .p-ring-item.p-ring-item-active {
        visibility: visible;
    }
}
`;

const classes = {
    root: ({ isVertical }) =>
        classNames('p-ring p-component', {
            'p-ring-vertical': isVertical,
            'p-ring-horizontal': !isVertical
        }),
    container: 'p-ring-container',
    content: 'p-ring-content',
    indicators: 'p-ring-indicators p-reset',
    header: 'p-ring-header',
    footer: 'p-ring-footer',
    itemsContainer: 'p-ring-items-container',
    itemsContent: 'p-ring-items-content',
    itemsGroup: 'p-ring-items-group',
    previousButton: ({ isDisabled }) =>
        classNames('p-ring-prev p-link', {
            'p-disabled': isDisabled
        }),
    previousButtonIcon: 'p-ring-prev-icon',
    nextButton: ({ isDisabled }) =>
        classNames('p-ring-next p-link', {
            'p-disabled': isDisabled
        }),
    nextButtonIcon: 'p-ring-next-icon',
    indicator: ({ isActive }) =>
        classNames('p-ring-indicator', {
            'p-highlight': isActive
        }),
    indicatorButton: 'p-link',
    itemCloned: ({ itemProps: props }) =>
        classNames(props.className, 'p-ring-item', {
            'p-ring-item-active': props.active,
            'p-ring-item-start': props.start,
            'p-ring-item-end': props.end,
            'p-ring-item-fix': props.fix
        }),
    item: ({ itemProps: props }) =>
        classNames(props.className, 'p-ring-item', {
            'p-ring-item-active': props.active,
            'p-ring-item-start': props.start,
            'p-ring-item-end': props.end,
            'p-ring-item-fix': props.fix
        })
};

const inlineStyles = {
    itemsContent: ({ height }) => ({ height })
};

export const RingBase = ComponentBase.extend({
    defaultProps: {
        __TYPE: 'Ring',
        id: null,
        value: null,
        page: 0,
        header: null,
        footer: null,
        style: null,
        className: null,
        itemTemplate: null,
        circular: false,
        showIndicators: true,
        showNavigators: true,
        autoplayInterval: 0,
        numVisible: 1,
        numScroll: 1,
        numColumn: 1,
        numRow: 1,
        prevIcon: null,
        nextIcon: null,
        responsiveOptions: null,
        orientation: 'horizontal',
        verticalViewPortHeight: '300px',
        contentClassName: null,
        containerClassName: null,
        indicatorsContentClassName: null,
        onPageChange: null,
        children: undefined
    },
    css: {
        classes,
        styles,
        inlineStyles
    }
});

const RingItem = React.memo((props) => {
    const { ptm, cx } = props;
    const key = props.className && props.className === 'p-ring-item-cloned' ? 'itemCloned' : 'item';
    const content = props.template(props.item);
    const mergeProps = useMergeProps();

    const itemClonedProps = mergeProps(
        {
            className: cx(key, { itemProps: props }),
            role: props.role,
            'aria-roledescription': props.ariaRoledescription,
            'aria-label': props.ariaLabel,
            'aria-hidden': props.ariaHidden,
            'data-p-ring-item-active': props.active,
            'data-p-ring-item-start': props.start,
            'data-p-ring-item-end': props.end
        },
        ptm(key)
    );

    return <div {...itemClonedProps}>{content}</div>;
});

export const RbRing = React.memo(
    React.forwardRef((inProps, ref) => {
        const context = React.useContext(PrimeReactContext);
        const props = RingBase.getProps(inProps, context);

        const mergeProps = useMergeProps();

        const [numVisibleState, setNumVisibleState] = React.useState(props.numVisible);
        const [numScrollState, setNumScrollState] = React.useState(props.numScroll);
        const [numColumnState, setNumColumnState] = React.useState(props.numColumn);
        const [numRowState, setNumRowState] = React.useState(props.numRow);
        const [totalShiftedItemsState, setTotalShiftedItemsState] = React.useState(props.page * props.numScroll * -1);
        const [pageState, setPageState] = React.useState(props.page);
        const { ptm, cx, sx, isUnstyled } = RingBase.setMetaData({
            props,
            state: {
                numVisible: numVisibleState,
                numScroll: numScrollState,
                numColumn: numColumnState,
                numRow: numRowState,
                totalShiftedItems: totalShiftedItemsState,
                page: pageState
            }
        });

        useHandleStyle(RingBase.css.styles, isUnstyled, { name: 'ring' });
        const elementRef = React.useRef(null);
        const itemsContainerRef = React.useRef(null);
        const remainingItems = React.useRef(0);
        const allowAutoplay = React.useRef(!!props.autoplayInterval);
        const attributeSelector = React.useRef('');
        const swipeThreshold = React.useRef(20);
        const startPos = React.useRef(null);
        const interval = React.useRef(null);
        const ringStyle = React.useRef(null);
        const indicatorContent = React.useRef(null);
        const isRemainingItemsAdded = React.useRef(false);
        const responsiveOptions = React.useRef(null);
        const prevNumScroll = usePrevious(numScrollState);
        const prevNumVisible = usePrevious(numVisibleState);
        const prevNumColumn = usePrevious(numColumnState);
        const prevNumRow = usePrevious(numRowState);
        const prevValue = usePrevious(props.value);
        const prevPage = usePrevious(props.page);
        const isVertical = props.orientation === 'vertical';
        const circular = props.circular || !!props.autoplayInterval;
        const isCircular = circular && props.value && Math.ceil(props.value.length / numColumnState / numRowState) >= numVisibleState;
        const totalIndicators = props.value ? Math.max(Math.ceil((props.value.length - numVisibleState * numColumnState * numRowState) / numScrollState / numColumnState / numRowState) + 1, 0) : 0;
        const isAutoplay = totalIndicators && props.autoplayInterval && allowAutoplay.current;
        const isControlled = props.onPageChange && !isAutoplay;
        const currentPage = isControlled ? props.page : pageState;

        const [bindWindowResizeListener] = useResizeListener({
            listener: () => {
                calculatePosition();
            },
            when: props.responsiveOptions
        });

        const step = (dir, page) => {
            let totalShiftedItems = totalShiftedItemsState;

            if (page != null) {
                totalShiftedItems = numScrollState * page * -1;

                if (isCircular) {
                    totalShiftedItems -= numVisibleState;
                }

                isRemainingItemsAdded.current = false;
            } else {
                totalShiftedItems += numScrollState * dir;

                if (isRemainingItemsAdded.current) {
                    totalShiftedItems += Math.ceil(remainingItems.current / numColumnState / numRowState) - numScrollState * dir;
                    isRemainingItemsAdded.current = false;
                }

                const originalShiftedItems = isCircular ? totalShiftedItems + numVisibleState : totalShiftedItems;

                page = Math.abs(Math.floor(originalShiftedItems / numScrollState));
            }

            if (isCircular && pageState === totalIndicators - 1 && dir === -1) {
                totalShiftedItems = -1 * (Math.ceil(props.value.length / numColumnState / numRowState) + numVisibleState);
                page = 0;
            } else if (isCircular && pageState === 0 && dir === 1) {
                totalShiftedItems = 0;
                page = totalIndicators - 1;
            } else if (page === totalIndicators - 1 && remainingItems.current > 0) {
                totalShiftedItems += Math.ceil(remainingItems.current / numColumnState / numRowState) * -1 - numScrollState * dir;
                isRemainingItemsAdded.current = true;
            }

            if (itemsContainerRef.current) {
                !isUnstyled() && DomHandler.removeClass(itemsContainerRef.current, 'p-items-hidden');
                changePosition(totalShiftedItems);
                itemsContainerRef.current.style.transition = 'transform 500ms ease 0s';
            }

            changePage(page);
            setTotalShiftedItemsState(totalShiftedItems);
        };

        const calculatePosition = () => {
            if (itemsContainerRef.current && responsiveOptions.current) {
                let windowWidth = window.innerWidth;
                let matchedResponsiveData = {
                    numColumn: props.numColumn,
                    numRow: props.numRow,
                    numVisible: props.numVisible,
                    numScroll: props.numScroll
                };

                for (let i = 0; i < responsiveOptions.current.length; i++) {
                    let res = responsiveOptions.current[i];

                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }

                if (numScrollState !== matchedResponsiveData.numScroll) {
                    let page = Math.floor((currentPage * numScrollState) / matchedResponsiveData.numScroll);
                    let totalShiftedItems = matchedResponsiveData.numScroll * page * -1;

                    if (isCircular) {
                        totalShiftedItems -= matchedResponsiveData.numVisible;
                    }

                    setTotalShiftedItemsState(totalShiftedItems);
                    setNumScrollState(matchedResponsiveData.numScroll);
                    changePage(page);
                }

                if (numVisibleState !== matchedResponsiveData.numVisible) {
                    setNumVisibleState(matchedResponsiveData.numVisible);
                }

                if (numColumnState !== matchedResponsiveData.numColumn) {
                    setNumColumnState(matchedResponsiveData.numColumn);
                }

                if (numRowState !== matchedResponsiveData.numRow) {
                    setNumRowState(matchedResponsiveData.numRow);
                }
            }
        };

        const navBackward = (e, page) => {
            if (circular || currentPage !== 0) {
                step(1, page);
            }

            allowAutoplay.current = false;

            if (e.cancelable) {
                e.preventDefault();
            }
        };

        const navForward = (e, page) => {
            if (circular || currentPage < totalIndicators - 1) {
                step(-1, page);
            }

            allowAutoplay.current = false;

            if (e.cancelable) {
                e.preventDefault();
            }
        };

        const onIndicatorClick = (e, page) => {
            if (page > currentPage) {
                navForward(e, page);
            } else if (page < currentPage) {
                navBackward(e, page);
            }
        };

        const onTransitionEnd = (e) => {
            if (itemsContainerRef.current && e.propertyName === 'transform') {
                DomHandler.addClass(itemsContainerRef.current, 'p-items-hidden');
                itemsContainerRef.current.style.transition = '';

                if ((pageState === 0 || pageState === totalIndicators - 1) && isCircular) {
                    changePosition(totalShiftedItemsState);
                }
            }
        };

        const onTouchStart = (e) => {
            const touchobj = e.changedTouches[0];

            startPos.current = {
                x: touchobj.pageX,
                y: touchobj.pageY
            };
        };

        const onTouchMove = (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
        };

        const onTouchEnd = (e) => {
            const touchobj = e.changedTouches[0];

            if (isVertical) {
                changePageOnTouch(e, touchobj.pageY - startPos.current.y);
            } else {
                changePageOnTouch(e, touchobj.pageX - startPos.current.x);
            }
        };

        const changePageOnTouch = (e, diff) => {
            if (Math.abs(diff) > swipeThreshold.current) {
                if (diff < 0) {
                    // left
                    navForward(e);
                } else {
                    // right
                    navBackward(e);
                }
            }
        };

        const onIndicatorKeydown = (event) => {
            switch (event.code) {
                case 'ArrowRight':
                    onRightKey();
                    break;

                case 'ArrowLeft':
                    onLeftKey();
                    break;

                case 'Home':
                    onHomeKey();
                    event.preventDefault();
                    break;

                case 'End':
                    onEndKey();
                    event.preventDefault();
                    break;

                case 'ArrowUp':
                case 'ArrowDown':
                    event.preventDefault();
                    break;

                case 'Tab':
                    onTabKey();
                    break;

                default:
                    break;
            }
        };

        const onRightKey = () => {
            const indicators = [...DomHandler.find(indicatorContent.current, '[data-pc-section="indicator"]')];
            const activeIndex = findFocusedIndicatorIndex();

            changedFocusedIndicator(activeIndex, activeIndex + 1 === indicators.length ? indicators.length - 1 : activeIndex + 1);
        };

        const onLeftKey = () => {
            const activeIndex = findFocusedIndicatorIndex();

            changedFocusedIndicator(activeIndex, activeIndex - 1 <= 0 ? 0 : activeIndex - 1);
        };

        const onHomeKey = () => {
            const activeIndex = findFocusedIndicatorIndex();

            changedFocusedIndicator(activeIndex, 0);
        };

        const onEndKey = () => {
            const indicators = [...DomHandler.find(indicatorContent.current, '[data-pc-section="indicator"]r')];
            const activeIndex = findFocusedIndicatorIndex();

            changedFocusedIndicator(activeIndex, indicators.length - 1);
        };

        const onTabKey = () => {
            const indicators = [...DomHandler.find(indicatorContent.current, '[data-pc-section="indicator"]')];
            const highlightedIndex = indicators.findIndex((ind) => DomHandler.getAttribute(ind, 'data-p-highlight') === true);

            const activeIndicator = DomHandler.findSingle(indicatorContent.current, '[data-pc-section="indicator"] > button[tabindex="0"]');

            const activeIndex = indicators.findIndex((ind) => ind === activeIndicator.parentElement);

            indicators[activeIndex].children[0].tabIndex = '-1';
            indicators[highlightedIndex].children[0].tabIndex = '0';
        };

        const findFocusedIndicatorIndex = () => {
            const indicators = [...DomHandler.find(indicatorContent.current, '[data-pc-section="indicator"]')];
            const activeIndicator = DomHandler.findSingle(indicatorContent.current, '[data-pc-section="indicator"] > button[tabindex="0"]');

            return indicators.findIndex((ind) => ind === activeIndicator.parentElement);
        };

        const changedFocusedIndicator = (prevInd, nextInd) => {
            const indicators = [...DomHandler.find(indicatorContent.current, '[data-pc-section="indicator"]')];

            indicators[prevInd].children[0].tabIndex = '-1';
            indicators[nextInd].children[0].tabIndex = '0';
            indicators[nextInd].children[0].focus();
        };

        const startAutoplay = () => {
            if (props.autoplayInterval > 0) {
                interval.current = setInterval(() => {
                    if (pageState === totalIndicators - 1) {
                        step(-1, 0);
                    } else {
                        step(-1, pageState + 1);
                    }
                }, props.autoplayInterval);
            }
        };

        const stopAutoplay = () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        };

        const createStyle = () => {
            if (!ringStyle.current) {
                ringStyle.current = DomHandler.createInlineStyle((context && context.nonce) || PrimeReact.nonce, context && context.styleContainer);
            }

            let innerHTML = `
                .p-ring[${attributeSelector.current}] .p-ring-item {
                    flex: 0 0 ${100 / numVisibleState / numColumnState}%
                }
                .p-ring[${attributeSelector.current}] .p-ring-item.p-ring-item-fix {
                    flex: 0 0 ${100 / numVisibleState / numColumnState + 0.1}%
                }
            `;

            if (props.responsiveOptions) {
                const comparator = ObjectUtils.localeComparator((context && context.locale) || PrimeReact.locale);

                responsiveOptions.current = [...props.responsiveOptions];
                responsiveOptions.current.sort((data1, data2) => {
                    const value1 = data1.breakpoint;
                    const value2 = data2.breakpoint;

                    return ObjectUtils.sort(value1, value2, -1, comparator, (context && context.nullSortOrder) || PrimeReact.nullSortOrder);
                });

                for (let i = 0; i < responsiveOptions.current.length; i++) {
                    let res = responsiveOptions.current[i];

                    innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        .p-ring[${attributeSelector.current}] .p-ring-item {
                            flex: 0 0 ${100 / res.numVisible / res.numColumn}%
                        }
                        .p-ring[${attributeSelector.current}] .p-ring-item.p-ring-item-fix {
                            flex: 0 0 ${100 / res.numVisible / res.numColumn + 0.1}%
                        }
                    }
                `;
                }

                calculatePosition();
            }

            ringStyle.current.innerHTML = innerHTML;
        };

        const destroyStyle = () => {
            ringStyle.current = DomHandler.removeInlineStyle(ringStyle.current);
        };

        const changePosition = (totalShiftedItems) => {
            if (itemsContainerRef.current) {
                itemsContainerRef.current.style.transform = isVertical ? `translate3d(0, ${totalShiftedItems * (100 / numVisibleState)}%, 0)` : `translate3d(${totalShiftedItems * (100 / numVisibleState)}%, 0, 0)`;
            }
        };

        const changePage = (page) => {
            !isControlled && setPageState(page);
            props.onPageChange && props.onPageChange({ page });
        };

        React.useImperativeHandle(ref, () => ({
            props,
            startAutoplay,
            stopAutoplay,
            getElement: () => elementRef.current
        }));

        useMountEffect(() => {
            if (elementRef.current) {
                attributeSelector.current = UniqueComponentId();
                elementRef.current.setAttribute(attributeSelector.current, '');
            }

            if (!ringStyle.current) {
                calculatePosition();
                changePosition(totalShiftedItemsState);
                bindWindowResizeListener();
            }
        });

        useUpdateEffect(() => {
            let stateChanged = false;
            let totalShiftedItems = totalShiftedItemsState;

            createStyle();

            if (props.autoplayInterval) {
                stopAutoplay();
            }

            if (prevNumScroll !== numScrollState || prevNumVisible !== numVisibleState
                || prevNumColumn !== numColumnState || prevNumRow !== numRowState
                || (props.value && prevValue && prevValue.length !== props.value.length)) {
                remainingItems.current = props.value.length % (numColumnState * numRowState * numScrollState);

                let page = currentPage;

                if (totalIndicators !== 0 && page >= totalIndicators) {
                    page = totalIndicators - 1;

                    changePage(page);

                    stateChanged = true;
                }

                totalShiftedItems = page * numScrollState * -1;

                if (isCircular) {
                    totalShiftedItems -= numVisibleState;
                }

                if (page === totalIndicators - 1 && remainingItems.current > 0) {
                    isRemainingItemsAdded.current = true;
                } else {
                    isRemainingItemsAdded.current = false;
                }

                if (totalShiftedItems !== totalShiftedItemsState) {
                    setTotalShiftedItemsState(totalShiftedItems);
                    stateChanged = true;
                }

                changePosition(totalShiftedItems);
            }

            if (isCircular) {
                if (pageState === 0) {
                    totalShiftedItems = -1 * numVisibleState;
                } else if (totalShiftedItems === 0) {
                    totalShiftedItems = -1 * Math.ceil(props.value.length / numVisibleState / numColumnState / numRowState);

                    if (remainingItems.current > 0) {
                        isRemainingItemsAdded.current = true;
                    }
                }

                if (totalShiftedItems !== totalShiftedItemsState) {
                    setTotalShiftedItemsState(totalShiftedItems);
                    stateChanged = true;
                }
            }

            if (prevPage !== props.page) {
                if (props.page > prevPage && props.page <= totalIndicators - 1) {
                    step(-1, props.page);
                } else if (props.page < prevPage) {
                    step(1, props.page);
                }
            }

            if (!stateChanged && isAutoplay) {
                startAutoplay();
            }

            return () => {
                if (props.autoplayInterval) {
                    stopAutoplay();
                }

                destroyStyle();
            };
        });

        const ariaSlideNumber = (value) => {
            return localeOption('aria') ? localeOption('aria').slideNumber.replace(/{slideNumber}/g, value) : undefined;
        };

        const createItems = () => {
            if (props.value && props.value.length) {
                let clonedItemsForStarting = null;
                let clonedItemsForFinishing = null;
                const numRemainder = props.value.length % (numColumnState * numRowState);
                const numfix = numRemainder > 0 && numRowState > 1 && numRemainder % numColumnState > 0
                    && numRemainder % numColumnState < numColumnState / 2
                    ? (numRowState - 2) * numColumnState : numRemainder > 0 ? numRemainder : numColumnState * numRowState;
                const numCount = Math.floor(props.value.length / numColumnState / numRowState);
                if (isCircular) {
                    const slice = numVisibleState > 1
                        ? (numVisibleState - 1) * numColumnState * numRowState + (numRemainder ? numRemainder : numColumnState * numRowState)
                        : numRemainder ? numRemainder : numColumnState * numRowState;
                    clonedItemsForStarting = createGroup(props.value.slice(-1 * slice)
                        .map((item, index) => {
                            const isActive = totalShiftedItemsState * -1 === numCount + numVisibleState;
                            const start = index === 0;
                            const end = index === numRemainder - 1;
                            const key = index + '_scloned';
                            const fix = index >= numfix;

                            return <RingItem key={key} className="p-ring-item-cloned" template={props.itemTemplate} item={item} active={isActive} start={start} end={end} fix={fix} ptm={ptm} cx={cx} />;
                        }), 'g_scloned', 'p-ring-group-cloned'
                    );

                    const clonedElements = props.value.slice(0, numVisibleState * numColumnState * numRowState);
                    clonedItemsForFinishing = createGroup(clonedElements
                        .map((item, index) => {
                            const isActive = totalShiftedItemsState === 0;
                            const start = index === 0;
                            const end = index === clonedElements.length - 1;
                            const key = index + '_fcloned';

                            return <RingItem key={key} className="p-ring-item-cloned" template={props.itemTemplate} item={item} active={isActive} start={start} end={end} ptm={ptm} cx={cx} />;
                        }), 'g_fcloned', 'p-ring-group-cloned'
                    );
                }

                const items = [];
                props.value.forEach((item, index) => {
                    const num = Math.floor(index / numColumnState / numRowState);
                    const remainder = index % (numColumnState * numRowState);
                    if (remainder === 0) {
                      items[num] = [];
                    }
                    const firstIndex = isCircular ? -1 * (totalShiftedItemsState + numVisibleState) * numColumnState * numRowState
                                                  : totalShiftedItemsState * numColumnState * numRowState * -1;
                    const lastIndex = firstIndex + numVisibleState * numColumnState * numRowState - 1;
                    const isActive = firstIndex <= index && lastIndex >= index;
                    const start = firstIndex === index;
                    const end = lastIndex === index;
                    const ariaHidden = firstIndex > index || lastIndex < index ? true : undefined;
                    const ariaLabel = ariaSlideNumber(index);
                    const ariaRoledescription = localeOption('aria') ? localeOption('aria').slide : undefined;
                    const fix = num === numCount && index >= numfix;

                    items[num].push(
                        <RingItem
                            key={index}
                            template={props.itemTemplate}
                            item={item}
                            active={isActive}
                            start={start}
                            ariaHidden={ariaHidden}
                            ariaLabel={ariaLabel}
                            ariaRoledescription={ariaRoledescription}
                            role="group"
                            end={end}
                            fix={fix}
                            ptm={ptm}
                            cx={cx}
                        />
                    );
                });

                return (
                    <>
                        {clonedItemsForStarting}
                        {
                          items.map((item, index) => {
                            return createGroup(item, index);
                          })
                        }
                        {clonedItemsForFinishing}
                    </>
                );
            }
        };

        const createGroup = (items, index, className) => {
            const itemsGroupProps = mergeProps(
                {
                    className: classNames(className, cx('itemsGroup')),
                    style: sx('itemsGroup'),
                },
                ptm('itemsGroup')
            );

            return (
                <div key={index} {...itemsGroupProps}>
                  {items}
                </div>
            );
        };

        const createHeader = () => {
            if (props.header) {
                const headerProps = mergeProps(
                    {
                        className: cx('header')
                    },
                    ptm('header')
                );

                return <div {...headerProps}>{props.header}</div>;
            }

            return null;
        };

        const createFooter = () => {
            if (props.footer) {
                const footerProps = mergeProps(
                    {
                        className: cx('footer')
                    },
                    ptm('footer')
                );

                return <div {...footerProps}>{props.footer}</div>;
            }

            return null;
        };

        const createContent = () => {
            const items = createItems();
            const height = isVertical ? props.verticalViewPortHeight : 'auto';
            const backwardNavigator = createBackwardNavigator();
            const forwardNavigator = createForwardNavigator();
            const itemsContentProps = mergeProps(
                {
                    className: cx('itemsContent'),
                    style: sx('itemsContent', { height }),
                    onTouchStart: (e) => onTouchStart(e),
                    onTouchMove: (e) => onTouchMove(e),
                    onTouchEnd: (e) => onTouchEnd(e)
                },
                ptm('itemsContent')
            );

            const containerProps = mergeProps(
                {
                    className: classNames(props.containerClassName, cx('container')),
                    'aria-live': allowAutoplay.current ? 'polite' : 'off'
                },
                ptm('container')
            );

            const itemsContainerProps = mergeProps(
                {
                    className: cx('itemsContainer'),
                    onTransitionEnd: onTransitionEnd
                },
                ptm('itemsContainer')
            );

            return (
                <div {...containerProps}>
                    {backwardNavigator}
                    <div {...itemsContentProps}>
                        <div ref={itemsContainerRef} {...itemsContainerProps}>
                            {items}
                        </div>
                    </div>
                    {forwardNavigator}
                </div>
            );
        };

        const createBackwardNavigator = () => {
            if (props.showNavigators) {
                const isDisabled = (!circular || (props.value && props.value.length < numVisibleState)) && currentPage === 0;
                const previousButtonIconProps = mergeProps(
                    {
                        className: cx('previousButtonIcon')
                    },
                    ptm('previousButtonIcon')
                );
                // const icon = isVertical ? props.prevIcon || <ChevronUpIcon {...previousButtonIconProps} /> : props.prevIcon || <ChevronLeftIcon {...previousButtonIconProps} />;
                // const backwardNavigatorIcon = IconUtils.getJSXIcon(icon, { ...previousButtonIconProps }, { props });
                const previousButtonProps = mergeProps(
                    {
                        type: 'button',
                        className: cx('previousButton', { isDisabled }),
                        onClick: (e) => navBackward(e),
                        disabled: isDisabled,
                        'aria-label': localeOption('aria') ? localeOption('aria').previousPageLabel : undefined,
                        'data-pc-group-section': 'navigator'
                    },
                    ptm('previousButton')
                );

                return (
                    <button {...previousButtonProps}>
                        <div {...previousButtonIconProps} />
                        <Ripple />
                    </button>
                );
            }

            return null;
        };

        const createForwardNavigator = () => {
            if (props.showNavigators) {
                const isDisabled = (!circular || (props.value && props.value.length < numVisibleState)) && (currentPage === totalIndicators - 1 || totalIndicators === 0);
                const nextButtonIconProps = mergeProps(
                    {
                        className: cx('nextButtonIcon')
                    },
                    ptm('nextButtonIcon')
                );
                // const icon = isVertical ? props.nextIcon || <ChevronDownIcon {...nextButtonIconProps} /> : props.nextIcon || <ChevronRightIcon {...nextButtonIconProps} />;
                // const forwardNavigatorIcon = IconUtils.getJSXIcon(icon, { ...nextButtonIconProps }, { props });
                const nextButtonProps = mergeProps(
                    {
                        type: 'button',
                        className: cx('nextButton', { isDisabled }),
                        onClick: (e) => navForward(e),
                        disabled: isDisabled,
                        'aria-label': localeOption('aria') ? localeOption('aria').nextPageLabel : undefined,
                        'data-pc-group-section': 'navigator'
                    },
                    ptm('nextButton')
                );

                return (
                    <button {...nextButtonProps}>
                        <div { ...nextButtonIconProps } />
                        <Ripple />
                    </button>
                );
            }

            return null;
        };

        const ariaPageLabel = (value) => {
            return localeOption('aria') ? localeOption('aria').pageLabel.replace(/{page}/g, value) : undefined;
        };

        const createIndicator = (index) => {
            const isActive = currentPage === index;

            const getPTOptions = (key) => {
                return ptm(key, {
                    context: {
                        active: isActive
                    }
                });
            };

            const key = 'ring-indicator-' + index;
            const indicatorProps = mergeProps(
                {
                    key,
                    className: cx('indicator', { isActive }),
                    'data-p-highlight': isActive
                },
                getPTOptions('indicator')
            );
            const indicatorButtonProps = mergeProps(
                {
                    type: 'button',
                    className: cx('indicatorButton'),
                    tabIndex: currentPage === index ? '0' : '-1',
                    onClick: (e) => onIndicatorClick(e, index),
                    'aria-label': ariaPageLabel(index + 1),
                    'aria-current': currentPage === index ? 'page' : undefined
                },
                getPTOptions('indicatorButton')
            );

            return (
                <li {...indicatorProps}>
                    <button {...indicatorButtonProps}>
                        <Ripple />
                    </button>
                </li>
            );
        };

        const createIndicators = () => {
            if (props.showIndicators) {
                let indicators = [];

                for (let i = 0; i < totalIndicators; i++) {
                    indicators.push(createIndicator(i));
                }

                const indicatorsProps = mergeProps(
                    {
                        ref: indicatorContent,
                        className: classNames(props.indicatorsContentClassName, cx('indicators')),
                        onKeyDown: onIndicatorKeydown
                    },
                    ptm('indicators')
                );

                return <ul {...indicatorsProps}>{indicators}</ul>;
            }

            return null;
        };

        const content = createContent();
        const indicators = createIndicators();
        const header = createHeader();
        const footer = createFooter();
        const rootProps = mergeProps(
            {
                id: props.id,
                ref: elementRef,
                className: classNames(props.className, cx('root', { isVertical })),
                style: props.style,
                role: 'region'
            },
            RingBase.getOtherProps(props),
            ptm('root')
        );

        const contentProps = mergeProps(
            {
                className: classNames(props.contentClassName, cx('content'))
            },
            ptm('content')
        );

        return (
            <div {...rootProps}>
                {header}
                <div {...contentProps}>
                    {content}
                    {indicators}
                </div>
                {footer}
            </div>
        );
    })
);

RingItem.displayName = 'RingItem';

RbRing.displayName = 'RbRing';
