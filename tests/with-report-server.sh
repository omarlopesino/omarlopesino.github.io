# Shared by the Makefile's test-pa11y-* targets (open_static_report) and view-unlighthouse-*
# targets (serve_static_report). Meant to be `source`d, not executed.

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
# then tears the server down.
serve_static_report() {
	local dir="$1" port="$2" url="http://localhost:$2"
	fuser -k "$port"/tcp 2>/dev/null || true
	# sirv-cli reads $PORT before its own --port flag — override it here or a $PORT already
	# exported in the caller's shell would make sirv-cli bind to that instead.
	PORT="$port" npx --yes sirv-cli@3.0.1 "$dir" --single --port "$port" &
	local sirv_pid=$!

	cleanup() {
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
