#!/bin/sh

VERSION=v1.0.0 envsubst < url-service.yml | kubectl apply -f -
