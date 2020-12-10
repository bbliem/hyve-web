#!/bin/sh
set -e
GITLAB_TEAM=gruifor-team
GITLAB_PROJECT=hyve-web

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 TAG" >&2
  exit 1
fi

TAG=$1
BUILD_MODE=$TAG
ENV_FILE=.env.${BUILD_MODE}

if [ ! -e "$ENV_FILE" ]; then
	echo "Cannot build image: Environment file $ENV_FILE does not exist."
	exit 2
fi

docker login registry.gitlab.com
docker build --build-arg BUILD_MODE=${BUILD_MODE} -t registry.gitlab.com/${GITLAB_TEAM}/${GITLAB_PROJECT}:${TAG} .
docker push registry.gitlab.com/${GITLAB_TEAM}/${GITLAB_PROJECT}:${TAG}
