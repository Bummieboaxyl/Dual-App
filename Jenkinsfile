pipeline {
    agent { label 'node1' }   // Runs on your Jenkins node worker
    environment {
        ANSIBLE_HOST_KEY_CHECKING = 'False'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Bummieboaxyl/Dual-App.git',
                    credentialsId: 'GitHub-credentials'
            }
        }

    stage('Deploy with Ansible') {
    steps {
        withCredentials([
            string(credentialsId: 'VAULT_PASS_ID', variable: 'VAULT_PASS'),
            sshUserPrivateKey(credentialsId: 'ansible-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')
        ]) {
            writeFile file: 'vault_pass.txt', text: VAULT_PASS
            sh '''
                ansible-playbook -i ansible/inventory ansible/playbook.yml \
                  --vault-password-file vault_pass.txt \
                  --private-key $SSH_KEY \
                  -u $SSH_USER
                  -e "ansible_ssh_private_key_file=$SSH_KEY ansible_user=$SSH_USER"
            '''
        }
    }
}


        stage('Archive Artifacts') {
            steps {
                sh '''
                   mkdir -p artifacts/flask artifacts/node
                   echo "Flask build version ${BUILD_NUMBER}" > artifacts/flask/version-${BUILD_NUMBER}.txt
                   echo "Node build version ${BUILD_NUMBER}" > artifacts/node/version-${BUILD_NUMBER}.txt
                '''
                archiveArtifacts artifacts: 'artifacts/**/*.txt', fingerprint: true
            }
        }

        stage('Cleanup Old Artifacts') {
            steps {
                // Deletes artifacts older than 7 days from Jenkins workspace
                sh '''
                    find artifacts/ -type f -mtime +7 -exec rm -f {} ';'
                '''
                cleanWs(cleanWhenAborted: true, 
                        deleteDirs: true, 
                        disableDeferredWipeout: true, 
                        notFailBuild: true)
            }
        }
    }
    post {
        always {
            echo "Pipeline finished. Build number: ${env.BUILD_NUMBER}"
        }
    }
}
