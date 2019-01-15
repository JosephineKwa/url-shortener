# URL Shortener
Simple service to shorten URLs and retrieve original URLs. Built using node.js and express.js and configured to run on a local minikube cluster.

## How to Install and Run
**Prerequisites:** Requires kubectl ([installation instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)) and minikube ([installation instructions](https://kubernetes.io/docs/tasks/tools/install-minikube/#install-minikube)) to be installed.

Clone repository into local machine by running `git clone https://github.com/JosephineKwa/url-shortener.git`

Open a terminal window, navigate to the repository root and enter `./deploy-all.sh` to run the deployment script.

The script executes the following:
1. Starts minikube and configures kubectl to use minikube as its context. This step may take awhile.
2. Starts a mongoDB service to handle database operations
3. Creates a blue(v1.0.0) and green(v1.0.1) deployment for Blue Green Deployment testing
4. Creates an ingress service to handle requests to some IP address or domain name
5. Creates services and pods for the EFK(Elasticsearch + Fluentd + Kibana) logging stack
6. Appends a domain name mapping to `/etc/hosts` for the domain name `zen.xyz`

**Note:** After the script has completed, you may need to wait a while longer(~5 min or more) for the pods to be completely deployed before proceeding.

## Docker Image
The docker images for the service(tagged v1.0.0 and v1.0.1) are located in the container repository `ninjaonions/urlserver`, viewable at [this link](https://cloud.docker.com/repository/docker/ninjaonions/urlserver/general).

## APIs to Test
Try it out in the browser at http://zen.xyz

The following services are accessible at the endpoint: `http://zen.xyz/api`
### Short URL creation: `POST /urls`
Creates a single shortened URL object with the specified URL and expiry duration (in seconds). Returns the created URL object containing the shortened URL and other related data.
#### Body
```
url: String
exp: Number (Optional)
```
#### Example:
Creates a shortened URL object for the URL `https://www.google.com`
that expires in 100 seconds.
```
curl --header "Content-Type: application/json" --request POST --data '{"url":"https://www.google.com","exp":"100"}' http://zen.xyz/api/urls
```

### Short URL expansion: `GET /urls?first&valid&short={short}`
Returns a single non-expired URL object with the specified shortened URL `{short}`. 
#### Example:
Returns the URL object for the shortened URL `https://zen.xyz/ulcgPy2em`
```
curl http://zen.xyz/api/urls?first&valid&short=https%3A%2F%2Fzen.xyz%2FulcgPy2em
```

## Testing Blue Green Deployment
Run `./switch-blue.sh` to switch to the blue(v1.0.0) deployment.

Similarly, run `./switch-green.sh` to switch to the green(v1.0.1) deployment.

Use the following endpoint to check the version when switching between the respective deployments: http://zen.xyz/api/version

## Logging
The logging merchanism runs on an EFK stack and can be accessed through Kibana dashboard using the following command.
```
minikube addons open efk
```
This will open a Kibana dashboard in a browser containing logs from all namespaces in the Kubernetes cluster.
