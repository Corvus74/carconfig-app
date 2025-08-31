# Future thinking
Using AWS ECR and GitHub Actions
for this replace the Dockerfile with the following


````
name: CI - Build, Test, and Publish

on:
  schedule:
    - cron: '30 8 * * *'
  push:
    branches: [ "main" ]
    # Publish semver tags as releases.
    tags: [ 'v*.*.*' ]
  pull_request:
    branches: [ "main" ]

env:
  # IMPORTANT: Change this to your ECR repository name if it's different
  ECR_REPOSITORY: carconfig-app

jobs:
  test:
    name: Run Angular Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24.5.0' # Match the version in your Dockerfile
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Angular tests
        run: npm test -- --watch=false --browsers=ChromeHeadless

  build-and-push-image:
    name: Build and Push Docker Image
    needs: test # This ensures this job only runs if the 'test' job succeeds
    permissions:
      contents: read
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Log in to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          # Only push the image on pushes to the main branch, not on pull requests
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
````
