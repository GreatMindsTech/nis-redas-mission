<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, int $minutes = 5): Response
    {
        $response = $next($request);

        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $response;
        }

        // Don't cache if there's an error
        if ($response->status() >= 400) {
            return $response;
        }

        // Set cache headers
        $response->headers->set('Cache-Control', "public, max-age=" . ($minutes * 60));
        $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + ($minutes * 60)) . ' GMT');

        return $response;
    }
}
