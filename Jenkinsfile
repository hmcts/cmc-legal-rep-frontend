#!groovy
@Library('Reform')
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Packager
import uk.gov.hmcts.RPMTagger
@Library('CMC')
import uk.gov.hmcts.cmc.integrationtests.IntegrationTests
import uk.gov.hmcts.cmc.smoketests.SmokeTests

Ansible ansible = new Ansible(this, 'cmc')
Packager packager = new Packager(this, 'cmc')

SmokeTests smokeTests = new SmokeTests(this)
IntegrationTests integrationTests = new IntegrationTests(env, this)

timestamps {
  milestone()
  lock(resource: "legal-frontend-${env.BRANCH_NAME}", inversePrecedence: true) {
    node('slave') {
      try {
        def version
        def legalFrontendRPMVersion
        def legalFrontendVersion
        def ansibleCommitId

        stage('Checkout') {
          deleteDir()
          checkout scm
        }

        stage('Setup') {
          sh '''
            yarn install
            yarn setup
          '''
        }

//        stage('Lint') {
//          sh "yarn run lint"
//        }

//        stage('Node security check') {
//          try {
//            sh "yarn test:nsp 2> nsp-report.txt"
//          } catch (ignore) {
//            sh "cat nsp-report.txt"
//            archiveArtifacts 'nsp-report.txt'
//            error "Node security check failed see the report for the errors"
//          }
//          sh "rm nsp-report.txt"
//        }

//        stage('Test') {
//          try {
//            sh "yarn test"
//          } finally {
//            archiveArtifacts 'mochawesome-report/unit.html'
//          }
//        }

//        stage('Test a11y') {
//          try {
//            sh "yarn test:a11y"
//          } finally {
//            archiveArtifacts 'mochawesome-report/a11y.html'
//          }
//        }

        stage('Package application (RPM)') {
          legalFrontendRPMVersion = packager.nodeRPM('legal-frontend')
          version = "{legal_frontend_buildnumber: ${legalFrontendRPMVersion}}"

//          if ("master" == BRANCH_NAME) {
//            packager.publishNodeRPM('legal-frontend')
//          }
          if ("feature/ROC-1813" == BRANCH_NAME) {
            packager.publishNodeRPM('legal-frontend')
          }
        }

//        stage('Package application (Docker)') {
//          legalFrontendVersion = dockerImage imageName: 'cmc/legal-frontend'
//        }

//        stage('Integration Tests') {
//          integrationTests.execute([
//            'LEGAL_FRONTEND_VERSION': legalFrontendVersion
//          ])
//        }

        //noinspection GroovyVariableNotAssigned It is guaranteed to be assigned
//        RPMTagger rpmTagger = new RPMTagger(this,
//          'legal-frontend',
//          packager.rpmName('legal-frontend', legalFrontendRPMVersion),
//          'cmc-local'
//        )

        if ("feature/ROC-1813" == BRANCH_NAME) {
          milestone()
          lock(resource: "CMC-deploy-dev", inversePrecedence: true) {
            stage('Deploy (Test)') {
              ansibleCommitId = ansible.runDeployPlaybook(version, 'test')
//              rpmTagger.tagDeploymentSuccessfulOn('dev')
//              rpmTagger.tagAnsibleCommit(ansibleCommitId)
            }
            stage('Smoke test (Test)') {
              smokeTests.executeAgainst(env.CMC_LEGAL_DEV_APPLICATION_URL)
//              rpmTagger.tagTestingPassedOn('dev')
            }
          }
        }
      } catch (Throwable err) {
        notifyBuildFailure channel: '#cmc-tech-notification'
        throw err
      }
    }
    milestone()
  }
}
