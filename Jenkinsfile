pipeline {
  agent any

  environment {
    ARTIFACTS_ROOT = "/var/lib/jenkins/artifacts"   // change as needed
    RETENTION_DAYS = "7"                           // delete artifacts older than X days
    ANSIBLE_INVENTORY = "inventory"
    PLAYBOOK = "playbook.yml"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Determine version') {
      steps {
        script {
          VERSION = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          BUILD_TAG = "${VERSION}-${env.BUILD_NUMBER}"
          echo "Using version: ${BUILD_TAG}"
          env.VERSION = BUILD_TAG
        }
      }
    }

    stage('Build Flask Artifact') {
      steps {
        sh '''
          mkdir -p ${ARTIFACTS_ROOT}/flask/${VERSION}
          tar -czf ${ARTIFACTS_ROOT}/flask/${VERSION}/flask-${VERSION}.tar.gz flask-app
        '''
      }
    }

    stage('Build Node Artifact') {
      steps {
        sh '''
          cd node-app
          npm ci
          cd ..
          mkdir -p ${ARTIFACTS_ROOT}/node/${VERSION}
          tar -czf ${ARTIFACTS_ROOT}/node/${VERSION}/node-${VERSION}.tar.gz node-app
        '''
      }
    }

    stage('Archive Artifacts') {
      steps {
        archiveArtifacts artifacts: "var/lib/jenkins/artifacts/**", allowEmptyArchive: true
      }
    }

    stage('Cleanup Old Artifacts') {
      steps {
        sh '''
          # remove directories (versions) older than RETENTION_DAYS
          find ${ARTIFACTS_ROOT} -mindepth 2 -maxdepth 3 -type d -mtime +${RETENTION_DAYS} -print -exec rm -rf {} +
        '''
      }
    }

    stage('Deploy via Ansible') {
      steps {
        withCredentials([string(credentialsId: 'VAULT_PASS_ID', variable: 'VAULT_PASS')]) {
          sh '''
            # Create a temporary vault password file
            echo "$VAULT_PASS" > /tmp/.vault_pass
            chmod 600 /tmp/.vault_pass

            ansible-playbook -i ${ANSIBLE_INVENTORY} ${PLAYBOOK} --vault-password-file /tmp/.vault_pass \
              -e "flask_artifact=${ARTIFACTS_ROOT}/flask/${VERSION}/flask-${VERSION}.tar.gz" \
              -e "node_artifact=${ARTIFACTS_ROOT}/node/${VERSION}/node-${VERSION}.tar.gz"

            rm -f /tmp/.vault_pass
          '''
        }
      }
    }
  }

  post {
    success {
      echo "Build and deploy completed for ${VERSION}"
    }
    failure {
      echo "Build or deploy failed"
    }
  }
}
