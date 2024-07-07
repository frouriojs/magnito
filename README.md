# Magnito

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://frouriojs.github.io/magnito/logos/icon-text-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://frouriojs.github.io/magnito/logos/icon-text-light.svg">
  <img alt="Magnito logo image" src="https://frouriojs.github.io/magnito/logos/icon-text-light.svg">
</picture>

Amazon Cognito emulator for Amplify UI

## Images

Docker Hub - https://hub.docker.com/r/frourio/magnito

Amazon ECR Public Gallery - https://gallery.ecr.aws/frourio/magnito

## Usage

Docker compose

```yml
services:
  magnito:
    image: frourio/magnito:latest
    ports:
      - 5050:5050 # Cognito API
      - 5051:5051 # web interface
    environment:
      COGNITO_USER_POOL_ID: ap-northeast-1_example
      COGNITO_USER_POOL_CLIENT_ID: example-client-name
      COGNITO_ACCESS_KEY: magnito-access-key
      COGNITO_SECRET_KEY: magnito-secret-key
      COGNITO_REGION: ap-northeast-1
      SMTP_HOST: inbucket
      SMTP_PORT: 2500
      SMTP_USER: fake_mail_user
      SMTP_PASS: fake_mail_password
    volumes:
      - magnito:/usr/src/app/data

  inbucket:
    image: inbucket/inbucket:3.0.3
    ports:
      - 2500:2500 # SMTP
      - 9000:9000 # web interface
    volumes:
      - inbucket:/storage

volumes:
  magnito:
    driver: local
  inbucket:
    driver: local
```

### SMTP Server UI

[Inbucket](https://inbucket.org) - http://localhost:9000/
