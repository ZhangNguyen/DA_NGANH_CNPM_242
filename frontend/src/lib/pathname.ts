import { stat } from "fs";

export const pathnames = {
    public: {
        layout: '/',
        homepage: '',
        dashboard: 'dashboard',
        statistics: 'statistics',
        login: "/login",
        register: "/register",
    },
    // this use for login, user page
    auth: {
        authLayout: '/',
        login: 'login',
        register: 'register',
    },
    private: {
        layout: '/private',
    }
}