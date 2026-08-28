# Shared by the Makefile's test-* targets. Meant to be `source`d, not executed: it needs to set
# a trap in the caller's shell so the preview server it starts gets killed when the caller exits.
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

# For a self-contained report (one HTML file, no JS module imports): just open it.
open_static_report() {
	if command -v xdg-open >/dev/null 2>&1; then
		xdg-open "$1" >/dev/null 2>&1 &
	else
		echo "Report: $1"
	fi
}

# For the Unlighthouse dashboard: it's a Vite SPA loaded via <script type="module">, which
# browsers refuse to run from a file:// URL (CORS), so opening index.html directly is blank.
# It needs serving over HTTP — Unlighthouse's own docs suggest `npx sirv-cli`. Blocks in the
# foreground (like `npm run preview`/`storybook-dev` already do in this project) until Ctrl+C,
# then tears the server down — same lifecycle as the site preview server above, not left behind.
serve_static_report() {
	local dir="$1" port="$2" url="http://localhost:$2"
	fuser -k "$port"/tcp 2>/dev/null || true
	# sirv-cli reads $PORT before its own --port flag, and $PORT is already exported above (for
	# the site preview server) — override it here or sirv-cli would bind to $PORT, not this one.
	PORT="$port" npx --yes sirv-cli@3.0.1 "$dir" --single --port "$port" &
	local sirv_pid=$!

	cleanup() {
		kill "$PREVIEW_PID" 2>/dev/null || true
		kill "$sirv_pid" 2>/dev/null || true
	}
	trap cleanup EXIT

	for _ in $(seq 1 20); do
		curl -sf "$url" >/dev/null 2>&1 && break
		sleep 0.5
	done
	if command -v xdg-open >/dev/null 2>&1; then
		xdg-open "$url" >/dev/null 2>&1 &
	else
		echo "Report: $url"
	fi
	echo "Report running at $url — press Ctrl+C when done viewing it."
	wait "$sirv_pid"
}
