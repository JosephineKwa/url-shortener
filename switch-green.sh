#!/bin/sh

VERSION=v1.0.1 envsubst < url-service.yml | kubectl apply -f -
