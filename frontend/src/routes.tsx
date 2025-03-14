import path from 'path';
import App from './App';
import { pathnames } from './lib/pathname';
import { HomePage, PublicLayout, DashBoard } from './pages/public';

const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: pathnames.public.layout,
                element: <PublicLayout/>,
                children: [
                    {
                        path: pathnames.public.homepage,
                        element: <HomePage/>
                    },
                    {
                        path: pathnames.public.dashboard,
                        element: <DashBoard/>
                    }
                ]
            }
        ]
    }
]

export default routes;