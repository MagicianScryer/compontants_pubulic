import { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  redirect
} from 'react-router-dom';
import { RuiBaiI18nProvider, RuiBaiTabPageProvider } from '@commons/rbcontext/RbContext';
import { Layout } from '@pages/layout/layout';
import MenuData from '@/public/menu.json';
// import { LayoutProvider } from 'ruibaireact/rbcontext';

export const Application = (props) => {

  const recursiveTraversal = (list, path) => {
    return list.map((data) => {
      const ELement = lazy(() => import(`@pages/${path}${data.to}`));
      const route = {
        path: data.to,
        element: <ELement />
      }
      return data.to && route || data.children && recursiveTraversal(data.children, data.path ? `${data.path}` : `${path}`).flat();
    });
  }

  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Layout><Suspense fallback="loading"><Outlet /></Suspense></Layout>,
        children: [
          {
            index: true,
            loader: () => redirect('ring')
          },
        ].concat(recursiveTraversal(MenuData.data, '').flat())
      }
    ],
    {
      future: {
        // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
        v7_normalizeFormMethod: true
      }
    }
  );

  return (
    <RuiBaiI18nProvider>
      <RuiBaiTabPageProvider>
        {/* <LayoutProvider> */}
          <RouterProvider router={router} />
        {/* </LayoutProvider> */}
      </RuiBaiTabPageProvider>
    </RuiBaiI18nProvider>
  );
};
