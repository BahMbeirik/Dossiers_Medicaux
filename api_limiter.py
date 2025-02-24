from rest_framework.throttling import SimpleRateThrottle

class CustomUserRateThrottle(SimpleRateThrottle):
    """
    Custom throttling class that:
      - Identifies users by their user ID if authenticated,
      - Falls back to IP address if unauthenticated,
      - Restricts requests to '10 requests per minute' by default (configurable via DRF settings).
    """
    
    scope = 'custom_user'

    def get_cache_key(self, request, view):
        """
        Returns a unique cache key for throttle. This can be
        user-based or IP-based.
        """
        if request.user.is_authenticated:
            # Use the user ID for authenticated users
            ident = request.user.pk
        else:
            # Use client IP for anonymous requests
            ident = self.get_ident(request)
        
        # The cache key must be unique per scope + user (or IP).
        return f'throttle_{self.scope}_{ident}'
