import { lazy, Suspense } from 'react';

export const WmfModule = (props) => {
  const {
    moduleName,
    remoteName,
    remoteScope,
    remoteUrl,
    uiProxyMode,
    parameter
  } = props;

  if (!remoteName || !moduleName) {
    return <>NO remote module to load.</>;
  }

  // const Component = lazy(() => importRemote({
  //   url: (remoteUrl ? remoteUrl : 'http://ui.proxy.rosewil.com') + (uiProxyMode && uiProxyMode === '1' ? '/' + remoteName : ''),
  //   scope: remoteScope || remoteName,
  //   module: `./${moduleName}`,
  //   remoteEntryFileName: 'remoteEntry.js'
  // }));
  const Component = lazy(() => import('../rbtext/RbText'));

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { haserror: false };
    }

    static getDerivedStateFromError(error) {
      return { haserror: true };
    }

    componentDidCatch(error, info) {
      window.console.log(error, info);
    }

    render() {
      if (this.state.haserror) {
        return (
          <p>has error</p>
        );
      }
      return this.props.children;
    }
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>{moduleName}</div>}>
        <Component>{moduleName}</Component>
      </Suspense>
    </ErrorBoundary>
  );
}