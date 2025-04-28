import { App, Button, Link, Navbar, Page, Toolbar, View, f7 } from 'framework7-react';
import './App.css';

const AppMain = () => {
  return (
    <App
      theme="ios"
      name="My App"
      routes={[
        {
          path: '/about',
          asyncComponent: () => import('./pages/About'),
        },
        {
          path: '/action',
          asyncComponent: () => import('./pages/Action'),
        },
        {
          path: '/deepSquat',
          asyncComponent: () => import('./pages/DeepSquat')
        }
      ]}
    >
      {/* Your main view, should have "main" prop */}
      <View main>
        {/*  Initial Page */}
        <Page>
          {/* Top Navbar */}
          <Navbar title="Awesome App"></Navbar>

          {/* Toolbar */}
          <Toolbar bottom>
            <Link href="/about">About Page</Link>
            <Link href="/action">Action Page</Link>
          </Toolbar>
          {/* Page Content */}
          <div className="p-4">
            <Button fill onClick={() => f7.views.main.router.navigate('/deepSquat')}>深蹲训练</Button>
          </div>
        </Page>
      </View>
    </App>
  );
};

export default AppMain;
