SHELL := /bin/bash
.ONESHELL:

# A dedicated port, distinct from `npm run dev`'s default 4321 — the suites test a real
# `npm run build` + `npm run preview`, which must never be confused with (or stop) a dev server
# that happens to be running. tests/pa11y/.pa11yci hardcodes this same port in its "urls".
PORT := 4322
SITE := http://localhost:$(PORT)
REPORT_PORT := 4323

# Chrome + package versions pinned together. Bumping the image means re-checking the
# executablePath baked into tests/unlighthouse/unlighthouse.config.ts and tests/pa11y/.pa11yci.
PUPPETEER_IMAGE := ghcr.io/puppeteer/puppeteer:25.9.0
UNLIGHTHOUSE_PKG := @unlighthouse/cli@0.18.0
PA11Y_CI_PKG := pa11y-ci@4.1.1
PA11Y_HTML_REPORTER_PKG := pa11y-ci-reporter-html@8.1.1

DOCKER_RUN := docker run --rm --network host --user "$$(id -u):$$(id -g)" -e HOME=/tmp

.PHONY: test-unlighthouse test-pa11y clean

test-unlighthouse:
	set -euo pipefail
	rm -rf tests/unlighthouse/report
	export PORT=$(PORT) SITE=$(SITE)
	source tests/with-preview-server.sh
	$(DOCKER_RUN) \
		-v "$(CURDIR)/tests/unlighthouse:/work" -w /work \
		$(PUPPETEER_IMAGE) \
		npx --yes --package $(UNLIGHTHOUSE_PKG) -- \
		unlighthouse-ci --site $(SITE) --build-static
	serve_static_report tests/unlighthouse/report $(REPORT_PORT)

test-pa11y:
	set -euo pipefail
	rm -rf tests/pa11y/report
	export PORT=$(PORT) SITE=$(SITE)
	source tests/with-preview-server.sh
	$(DOCKER_RUN) \
		-v "$(CURDIR)/tests/pa11y:/work" -w /work \
		$(PUPPETEER_IMAGE) \
		npx --yes --package $(PA11Y_CI_PKG) --package $(PA11Y_HTML_REPORTER_PKG) -- \
		pa11y-ci
	open_static_report tests/pa11y/report/index.html

clean:
	rm -rf tests/unlighthouse/report tests/pa11y/report
