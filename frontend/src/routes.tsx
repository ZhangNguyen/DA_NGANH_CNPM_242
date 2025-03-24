import App from './App';
import { pathnames } from './lib/pathname';
import { HomePage, PublicLayout, DashBoard, Statistics} from './pages/public';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

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
                    },
                    {
                        path: pathnames.public.statistics,
                        element: <Statistics/>
                    },
                    {
                        path: pathnames.public.login,
                        element: <Login/>
                    },
                    {
                        path: pathnames.public.register,
                        element: <Register/>
                    }
                ]
            },
            {
                
            }
        ]
    }
]

export default routes;