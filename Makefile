install: install-deps
	npm link

run:
	bin/gendiff

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

test-watch:
	npm test -- --watch

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .
