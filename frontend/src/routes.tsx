import App from './App';
import { pathnames } from './lib/pathname';
import { 
    HomePage, 
    PublicLayout, 
    DashBoard, 
    Statistics, 
    Login, 
    Register, 
    AuthLayout,
    DeviceControl,
    ManagePlant
} from './pages/public';

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
                        path: pathnames.public.deviceControl,
                        element: <DeviceControl/>
                    },
                    {
                        path: pathnames.public.managePlant,
                        element: <ManagePlant/>
                    }
                ],
                
            },
            {
                path: pathnames.auth.authLayout,
                element: <AuthLayout/>,
                children: [
                    {
                        path: pathnames.public.login,
                        element: <Login/>,
                        
                    },
                    {
                        path: pathnames.public.register,
                        element: <Register/>,
                    }
                ]
            },
            
        ]
    }
]

export default routes;