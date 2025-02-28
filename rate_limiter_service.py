from flask import Flask, request, Response
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import requests
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Initialize Flask-Limiter with a key function (using client IP)
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
)

# URL of your Django REST API service
DJANGO_SERVICE_URL = "http://127.0.0.1:8000"  # adjust as needed

def proxy_request(full_path):
    """Forward the request to the Django service and return its response."""
    target_url = f"{DJANGO_SERVICE_URL}{full_path}"
    resp = requests.request(
        method=request.method,
        url=target_url,
        headers={key: value for key, value in request.headers if key.lower() != 'host'},
        data=request.get_data(),
        params=request.args,
        cookies=request.cookies,
        allow_redirects=False,
    )
    # Filter out hop-by-hop headers
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = {key: value for key, value in resp.headers.items() if key.lower() not in excluded_headers}
    return Response(resp.content, resp.status_code, headers)

# ---------------------------
# Routes with rate limiting
# ---------------------------

# (1) All auth endpoints should be rate limited.
@app.route('/api/auth/<path:path>', methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
@limiter.limit("10 per minute")
def proxy_auth(path):
    return proxy_request(f"/api/auth/{path}")

# (2) Document endpoints that require rate limiting.
# For example, assume you want to limit POST/PUT on "category", "hospital" and nested "fields" endpoints.

@app.route('/api/category/<path:path>', methods=["POST", "PUT"])
@limiter.limit("15 per minute")
def proxy_category_rate_limited(path):
    return proxy_request(f"/api/category/{path}")

@app.route('/api/hospital/<path:path>', methods=["POST", "PUT"])
@limiter.limit("15 per minute")
def proxy_hospital_rate_limited(path):
    return proxy_request(f"/api/hospital/{path}")

@app.route('/api/category/<int:category_id>/fields/<path:path>', methods=["POST", "PUT"])
@limiter.limit("15 per minute")
def proxy_category_fields_rate_limited(category_id, path):
    return proxy_request(f"/api/category/{category_id}/fields/{path}")

# Additional document endpoints (for example, create document)
@app.route('/documents/create/', methods=["POST"])
@limiter.limit("15 per minute")
def proxy_document_create():
    return proxy_request("/documents/create/")

# If you want to rate limit only write methods (e.g. POST/PUT) on the document detail endpoint:
@app.route('/documents/<int:document_id>/', methods=["POST", "PUT"])
@limiter.limit("15 per minute")
def proxy_document_rate_limited(document_id):
    return proxy_request(f"/documents/{document_id}/")

# ---------------------------
# Routes without rate limiting
# ---------------------------

# Catch-all route for any other endpoints not requiring rate limiting.
@app.route('/<path:path>', methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def proxy_all(path):
    return proxy_request(f"/{path}")

if __name__ == '__main__':

    app.run(port=5000)

