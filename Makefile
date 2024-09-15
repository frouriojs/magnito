setup: install
	cp client/.env.example client/.env
	cp server/.env.example server/.env
	docker compose up -d

install:
	npm install & npm install --prefix server & npm install --prefix client

release:
	@echo ${VERSION} | grep -E "^[0-9]+\.[0-9]+\.[0-9]+(-r[0-9]+)?$$"
	git fetch origin main
	git tag v${VERSION} FETCH_HEAD
	git push origin v${VERSION}
