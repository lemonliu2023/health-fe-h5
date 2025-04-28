import { App, Link, Navbar, Page, Toolbar, View } from 'framework7-react';
import './App.css';

const AppMain = () => {
  return (
    <App theme="auto" name="My App" routes={[
      {
        path: '/about',
        asyncComponent: () => import('./pages/About')
      },
      {
        path: '/action',
        asyncComponent: () => import('./pages/Action')
      }
    ]}>
      {/* Your main view, should have "main" prop */}
      <View main>
        {/*  Initial Page */}
        <Page>
          {/* Top Navbar */}
          {/* <Navbar title="Awesome App"></Navbar> */}
          {/* Toolbar */}
          <Toolbar bottom>
            <Link href="/about">About Page</Link>
            <Link href="/action">Action Page</Link>
          </Toolbar>
          {/* Page Content */}
          <p>Page content goes here</p>
          <Link href="/about/">About App</Link>
        </Page>
      </View>
    </App>
  );
};

export default AppMain;
