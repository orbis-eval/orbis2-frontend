VERSION_FILE := version.txt
CURRENT_VERSION := $(shell cat $(VERSION_FILE))

start:
	docker compose up -d

stop:
	docker compose stop

build:
	docker compose build

down:
	docker compose down -v

logs:
	docker compose logs -f

test:
	docker compose exec frontend yarn test

lint:
	docker compose exec frontend yarn lint

lintfix:
	docker compose exec frontend yarn lintfix

yarn-build:
	docker compose exec frontend yarn build

release_major_version:
	$(eval MAJOR_VERSION := $(word 1, $(subst ., ,$(CURRENT_VERSION))))
	$(eval NEW_MAJOR_VERSION := $(shell echo $$(($(MAJOR_VERSION)+1))))
	$(eval NEW_VERSION := $(NEW_MAJOR_VERSION).0.0)
	@echo "Current version: $(CURRENT_VERSION)"
	@echo "New version: $(NEW_VERSION)"
	echo $(NEW_VERSION) > $(VERSION_FILE)
	git add version.txt
	git commit -m "Major Release $(NEW_VERSION)"
	git tag $(NEW_VERSION)
	git push --tags
	echo "INFO: Please git push the new major version manually"

release_minor_version:
	$(eval MINOR_VERSION := $(word 2, $(subst ., ,$(CURRENT_VERSION))))
	$(eval NEW_MINOR_VERSION := $(shell echo $$(($(MINOR_VERSION)+1))))
	$(eval NEW_VERSION := $(word 1, $(subst ., ,$(CURRENT_VERSION))).$(NEW_MINOR_VERSION).0)
	@echo "Current version: $(CURRENT_VERSION)"
	@echo "New version: $(NEW_VERSION)"
	echo $(NEW_VERSION) > $(VERSION_FILE)
	git add version.txt
	git commit -m "Minor Release $(NEW_VERSION)"
	git tag $(NEW_VERSION)
	git push --tags
	echo "INFO: Please git push the new minor version manually"

release_patch_version:
	$(eval PATCH_VERSION := $(word 3, $(subst ., ,$(CURRENT_VERSION))))
	$(eval NEW_PATCH_VERSION := $(shell echo $$(($(PATCH_VERSION)+1))))
	$(eval NEW_VERSION := $(word 1, $(subst ., ,$(CURRENT_VERSION))).$(word 2, $(subst ., ,$(CURRENT_VERSION))).$(NEW_PATCH_VERSION))
	@echo "Current version: $(CURRENT_VERSION)"
	@echo "New version: $(NEW_VERSION)"
	echo $(NEW_VERSION) > $(VERSION_FILE)
	git add version.txt
	git commit -m "Patch Release $(NEW_VERSION)"
	git tag $(NEW_VERSION)
	git push --tags
	echo "INFO: Please git push the new patch version manually"
