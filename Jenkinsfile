pipeline {
    agent { label 'node1' }   // Runs on your node worker
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
                withCredentials([string(credentialsId: 'VAULT_PASS_ID', variable: 'VAULT_PASS')]) {
                    writeFile file: 'vault_pass.txt', text: VAULT_PASS
                    sh '''
                        ansible-playbook -i inventory playbook.yml --vault-password-file vault_pass.txt
                    '''
                }
            }
        }

        stage('Cleanup Artifacts') {
            steps {
                cleanWs(cleanWhenAborted: true, 
                        deleteDirs: true, 
                        disableDeferredWipeout: true, 
                        notFailBuild: true)
            }
        }
    }
}
