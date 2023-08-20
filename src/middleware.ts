import { NextResponse, type NextRequest } from 'next/server'
import { sendMessageToTg } from './app/api/bugReport/sendMessageToTg';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const { cookies } = request;
    const authToken = cookies.get('auth');
    const tokenIsValid = await checkAuthToken(String(authToken?.value), request.nextUrl.origin)
    if (!request.nextUrl.pathname.startsWith('/_next') && !request.nextUrl.pathname.startsWith('/api')) { // IS PAGE!!
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
        if (!tokenIsValid) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    } else { // Что здесь ? O_o
        sendMessageToTg(JSON.stringify({ errorNo: "#cjdh4nfjdU", error: "Произошла неведомая хуйня", values: {} }), "5050441344")
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
