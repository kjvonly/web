# Check to see if we can use ash, in Alpine images, or default to BASH.
SHELL_PATH = /bin/ash
SHELL = $(if $(wildcard $(SHELL_PATH)),/bin/ash,/bin/bash)


# ==============================================================================
# Define dependencies

BASE_IMAGE_NAME := kjvonly
SERVICE_NAME    := web
VERSION         := 0.0.1
SERVICE_IMAGE   := $(BASE_IMAGE_NAME)/$(SERVICE_NAME):$(VERSION)

# ==============================================================================
# Building containers

all: web

web:
	docker build \
		-f Dockerfile \
		-t $(SERVICE_IMAGE) \
		--build-arg BUILD_REF=$(VERSION) \
		--build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
		.
