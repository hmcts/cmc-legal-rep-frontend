#!groovy
@Library(['CMC', 'Reform'])
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Packager
import uk.gov.hmcts.cmc.integrationtests.IntegrationTests
import uk.gov.hmcts.cmc.smoketests.SmokeTests
//noinspection GroovyAssignabilityCheck this is how Jenkins does it
properties(
  [[$class: 'GithubProjectProperty', projectUrlStr: 'https://github.com/hmcts/cmc-legal-rep-frontend/'],
   pipelineTriggers([[$class: 'GitHubPushTrigger']]),
  [$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '7', numToKeepStr: '10']]
  ],
)

Ansible ansible = new Ansible(this, 'cmc')
Packager packager = new Packager(this, 'cmc')

SmokeTests smokeTests = new SmokeTests(this)
IntegrationTests integrationTests = new IntegrationTests(env, this)

String channel = '#cmc-tech-notification'

timestamps {
  milestone()
  lock(resource: "legal-frontend-${env.BRANCH_NAME}", inversePrecedence: true) {
    node('moj_centos_large2') {
      try {
        def version
        def legalFrontendRPMVersion
        def legalFrontendVersion

        stage('Checkout') {
          deleteDir()
          checkout scm
        }

        onMaster {
          stage('Setup') {
            sh '''
              yarn install
              yarn setup
            '''
          }
        }

        stage('Package application (Docker)') {
          legalFrontendVersion = dockerImage imageName: 'cmc/legal-frontend'
        }

        onPR {
          stage('Integration Tests') {
            integrationTests.execute([
              'LEGAL_FRONTEND_VERSION': legalFrontendVersion,
              'TESTS_TAG'               : '@legal'
            ])
          }
        }

        onMaster {
          stage('Package application (RPM)') {
            legalFrontendRPMVersion = packager.nodeRPM('legal-frontend')
            version = "{legal_frontend_buildnumber: ${legalFrontendRPMVersion}}"

            packager.publishNodeRPM('legal-frontend')
          }

          milestone()
          lock(resource: "CMC-deploy-demo", inversePrecedence: true) {
            stage('Deploy (Demo)') {
              ansible.runDeployPlaybook(version, 'demo')
            }
            stage('Smoke test (Demo)') {
              smokeTests.executeAgainst(env.CMC_DEMO_APPLICATION_URL)
            }
          }
          milestone()
        }
      } catch (Throwable err) {
        notifyBuildFailure channel: channel
        throw err
      } finally {
        step([$class: 'InfluxDbPublisher',
               customProjectName: 'CMC Legal Frontend',
               target: 'Jenkins Data'])
      }
    }
    milestone()
  }
  notifyBuildFixed channel: channel
}
