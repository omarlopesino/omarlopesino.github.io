SHELL := /bin/bash
.ONESHELL:

# A dedicated port, distinct from `npm run dev`'s default 4321 — the local suites test a real
# `npm run build` + `npm run preview`, which must never be confused with (or stop) a dev server
# that happens to be running. tests/pa11y/local.json hardcodes this same port in its "urls".
PORT := 4322
SITE := http://localhost:$(PORT)
REPORT_PORT := 4323

SITE_PRODUCTION := https://omarlopesino.me

# Chrome + package versions pinned together. Bumping the image means re-checking the
# executablePath baked into tests/unlighthouse/base.config.ts and tests/pa11y/*.json.
PUPPETEER_IMAGE := ghcr.io/puppeteer/puppeteer:25.9.0
UNLIGHTHOUSE_PKG := @unlighthouse/cli@0.18.0
PA11Y_CI_PKG := pa11y-ci@4.1.1
PA11Y_HTML_REPORTER_PKG := pa11y-ci-reporter-html@8.1.1

# The whole tests/ dir is mounted (not just one tool's folder) so a config's outputPath/destination
# can write to the shared tests/reports/ alongside it via a relative `../reports/...` path.
DOCKER_RUN := docker run --rm --user "$$(id -u):$$(id -g)" -e HOME=/tmp -v "$(CURDIR)/tests:/work"

.PHONY: test-unlighthouse-local test-unlighthouse-production test-pa11y-local test-pa11y-production clean

test-unlighthouse-local:
	set -euo pipefail
	rm -rf tests/reports/unlighthouse-local
	export PORT=$(PORT) SITE=$(SITE)
	source tests/with-preview-server.sh
	source tests/with-report-server.sh
	status=0
	$(DOCKER_RUN) --network host -w /work/unlighthouse \
		$(PUPPETEER_IMAGE) \
		npx --yes --package $(UNLIGHTHOUSE_PKG) -- \
		unlighthouse-ci --site $(SITE) --config-file local.config.ts --build-static || status=$$?
	serve_static_report tests/reports/unlighthouse-local $(REPORT_PORT)
	exit $$status

test-unlighthouse-production:
	set -euo pipefail
	rm -rf tests/reports/unlighthouse-production
	source tests/with-report-server.sh
	status=0
	$(DOCKER_RUN) -w /work/unlighthouse \
		$(PUPPETEER_IMAGE) \
		npx --yes --package $(UNLIGHTHOUSE_PKG) -- \
		unlighthouse-ci --site $(SITE_PRODUCTION) --config-file production.config.ts --build-static || status=$$?
	serve_static_report tests/reports/unlighthouse-production $(REPORT_PORT)
	exit $$status

test-pa11y-local:
	set -euo pipefail
	rm -rf tests/reports/pa11y-local
	export PORT=$(PORT) SITE=$(SITE)
	source tests/with-preview-server.sh
	source tests/with-report-server.sh
	status=0
	$(DOCKER_RUN) --network host -w /work/pa11y \
		$(PUPPETEER_IMAGE) \
		npx --yes --package $(PA11Y_CI_PKG) --package $(PA11Y_HTML_REPORTER_PKG) -- \
		pa11y-ci --config local.json || status=$$?
	open_static_report tests/reports/pa11y-local/index.html
	exit $$status

test-pa11y-production:
	set -euo pipefail
	rm -rf tests/reports/pa11y-production
	source tests/with-report-server.sh
	status=0
	$(DOCKER_RUN) -w /work/pa11y \
		$(PUPPETEER_IMAGE) \
		npx --yes --package $(PA11Y_CI_PKG) --package $(PA11Y_HTML_REPORTER_PKG) -- \
		pa11y-ci --config production.json || status=$$?
	open_static_report tests/reports/pa11y-production/index.html
	exit $$status

clean:
	rm -rf tests/reports
