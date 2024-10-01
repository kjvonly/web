# Check to see if we can use ash, in Alpine images, or default to BASH.
SHELL_PATH = /bin/ash
SHELL = $(if $(wildcard $(SHELL_PATH)),/bin/ash,/bin/bash)


# ==============================================================================
# Define dependencies

BASE_IMAGE_NAME := kjvonly
SERVICE_NAME    := web
VERSION         := 0.0.1
SERVICE_IMAGE   := $(BASE_IMAGE_NAME)/$(SERVICE_NAME):$(VERSION)
LOCAL_REGISTRY  := localhost:32000
LOCAL_SERVICE_IMAGE := $(LOCAL_REGISTRY)/$(SERVICE_IMAGE)

# ==============================================================================
# Building containers

all: web

web:
	docker build \
		-f zarf/containers/nginx/nginx.dockerfile \
		-t $(SERVICE_IMAGE) \
		--build-arg BUILD_REF=$(VERSION) \
		--build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
		.
run-web:
	docker rm -f kjvonly-web && \
	docker run -d -p 5000:80 \
	-v $(PWD)/../data:/data:z \
	-v $(PWD)/zarf/containers/nginx/nginx.conf:/etc/nginx/nginx.conf:Z \
	-v $(PWD)/zarf/containers/nginx/conf.d:/etc/nginx/conf.d:Z \
	-v $(HOME)/bible/verses:/media/verses:Z \
	--name kjvonly-web \
	kjvonly/web:0.0.1

run-dev:
	docker rm -f kjvonly-web && \
	docker run -d -p 5000:80 \
	-v $(HOME)/bible:/media:z \
	-v $(PWD)/../data:/data:z \
	-v $(PWD)/zarf/containers/nginx/nginx.conf:/etc/nginx/nginx.conf:Z \
	-v $(PWD)/zarf/containers/nginx/conf.d:/etc/nginx/conf.d:Z \
	--name kjvonly-web \
	kjvonly/web:0.0.1

local_push:
	docker tag $(SERVICE_IMAGE) $(LOCAL_SERVICE_IMAGE)
	docker push $(LOCAL_SERVICE_IMAGE)