# Kubernetes Deployment Templates

Purpose: provide production-oriented deployment primitives for API and worker runtimes. These files are templates: concrete images, secrets, ingress, and environment-specific values must be supplied by the deployment pipeline.

The manifests emphasize horizontal scaling, safe rollouts, resource isolation, health checks, and topology spread across zones. They do not contain secrets.
