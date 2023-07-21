# Copyright (c) Datalayer, Inc. https://datalayer.io
# Distributed under the terms of the MIT License.

SHELL=/bin/bash

ENV_NAME=jupyter-rtc-test

.DEFAULT_GOAL := default

.SILENT: init

.PHONY: port-forward storybook

help: ## display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

default: help ## default target is help

env: warning ## env
	micromamba env create -y -n ${ENV_NAME} -f environment.yml
	@exec echo "-------------------------------------------------------"
	@exec echo "micromamba activate ${ENV_NAME}"
	@exec echo "-------------------------------------------------------"

env-rm: warning ## env-rm
	micromamba deactivate && \
	micromamba remove -y --name ${ENV_NAME} --all || true

kill:
	./dev/sh/kill.sh

warning:
	echo "\x1b[34m\x1b[43mEnsure you have run \x1b[1;37m\x1b[41m micromamba deactivate \x1b[22m\x1b[34m\x1b[43m before invoking this.\x1b[0m"
