import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const { cookies } = request;
    const authToken = cookies.get('auth');


    if (!request.nextUrl.pathname.startsWith('/_next') && !request.nextUrl.pathname.startsWith('/api')) { // IS PAGE!!
        const tokenIsValid = await checkAuthToken(String(authToken?.value), request.nextUrl.origin)

        if (tokenIsValid) {
            updateTokenDeadline(
                String(authToken?.value), request.url
            )
        }


        if (pathname === "/login") {
            if (tokenIsValid) {
                return NextResponse.redirect(new URL('/', request.url))
            }
        } else {
            if (!tokenIsValid) {
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }
    }

    else if (request.nextUrl.pathname.startsWith('/api')) { // IS API!!
        const tokenIsValid = await checkAuthToken(String(authToken?.value), request.nextUrl.origin)

        if (
            (pathname !== "/api/auth/login")
            && (pathname !== "/api/bugReport")
            && (pathname !== "/api/auth/checkToken")
            && (pathname !== "/api/auth/confirm")
        ) {
            if (!tokenIsValid) {
                return new Response(null, {
                    status: 401,
                });
            }
        }

    } else { // подкапотные запросы
    }
}

export const config = {
    matcher: '/:path*',
}

async function checkAuthToken(token: string, currentUrl: string) {
    return await fetch(`${currentUrl}/api/auth/checkToken`, {
        method: "POST",
        body: JSON.stringify({
            token: String(token)
        })
    })
        .then(x => {
            return x.status === 200;
        })
}



async function updateTokenDeadline(token: string, currentUrl: string) {
    return await fetch(`${currentUrl}/api/auth/updateTokenDeadline`, {
        method: "POST",
        body: JSON.stringify({
            token: String(token)
        })
    })
        .then(x => {
            return x.status === 200;
        })
}