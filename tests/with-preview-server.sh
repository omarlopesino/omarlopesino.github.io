# Shared by the Makefile's test-*-local targets. Meant to be `source`d, not executed: it needs to
# set a trap in the caller's shell so the preview server it starts gets killed when the caller
# exits. Production targets test the live site directly and don't need this at all.
#
# Always builds and serves fresh on $PORT rather than reusing whatever's already listening there
# (e.g. `npm run dev`) — a dev server has no sitemap and would otherwise fail the crawl silently.

if curl -sf "$SITE" >/dev/null 2>&1; then
	echo "Something is already listening on $SITE — stop it first (this target needs the port for its own build+preview)." >&2
	exit 1
fi

echo "Building and starting preview server on port $PORT..."
npm run build
npm run preview -- --port "$PORT" &
PREVIEW_PID=$!

for _ in $(seq 1 30); do
	curl -sf "$SITE" >/dev/null 2>&1 && break
	sleep 1
done

if ! curl -sf "$SITE" >/dev/null 2>&1; then
	echo "Preview server never came up on $SITE" >&2
	exit 1
fi

cleanup() {
	kill "$PREVIEW_PID" 2>/dev/null || true
}
trap cleanup EXIT
