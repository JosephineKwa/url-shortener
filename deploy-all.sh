#!/bin/sh

minikube start --memory=8192
minikube addons enable ingress
minikube addons enable efk
kubectl apply -f db-deployment.yml
VERSION=v1.0.0 envsubst < url-deployment.yml | kubectl apply -f -
VERSION=v1.0.1 envsubst < url-deployment.yml | kubectl apply -f -
VERSION=v1.0.0 envsubst < url-service.yml | kubectl apply -f -
kubectl apply -f ingress.yml

kubectl apply -f efk/elasticsearch-rc.yaml
kubectl apply -f efk/elasticsearch-svc.yaml
kubectl apply -f efk/fluentd-es-configmap.yaml
kubectl apply -f efk/fluentd-es-rc.yaml
kubectl apply -f efk/kibana-rc.yaml
kubectl apply -f efk/kibana-svc.yaml

echo "$(minikube ip) api.urlshortener.com" >> "/etc/hosts"

