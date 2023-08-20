import { NextResponse, type NextRequest } from 'next/server'
// import { pool } from './app/db/connect';

export async function middleware(request: NextRequest) {

    const pathname = request.nextUrl.pathname;

    const { cookies } = request;
    const authToken = cookies.get('auth');

    if (
        !request.nextUrl.pathname.startsWith('/_next') && !request.nextUrl.pathname.startsWith('/api')
    ) {
        // console.log('is page', pathname);
        if (pathname !== "/login") {
            if (!authToken) {
                return NextResponse.redirect(new URL('/login', request.url))
            } else {
                console.log('есть токен');
                checkAuthToken(authToken.value);
            }
            console.log('authToken', authToken);
        }
    } else if (
        request.nextUrl.pathname.startsWith('/api')
    ) {
        console.log('is api', pathname);
    } else {
        //дремучая хуйня
    }
}

export const config = {
    matcher: '/:path*',
}

async function checkAuthToken(token: any) {
    try {
        // return await new Promise(resolve => {
        //     pool.query(
        //         "SELECT * FROM employees WHERE token = ?",
        //         [token],
        //         function (err, res) {
        //             console.log({ err, res });
        //             resolve(1);
        //         }
        //     )
        // })
    } catch (error) {
        console.log('error',error);
        return null;
    }
}
