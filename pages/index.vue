<template>
  <div>
    <section>
      <table>
        <tr>
          <th>Amount of Pull Requests</th>
          <td>{{ pullRequests.length }}</td>
        </tr>
        <tr>
          <th>Lines of code edited</th>
          <td>{{ linesOfCode }} lines edited</td>
        </tr>
        <tr>
          <th>Projects contributed to</th>
          <td>
            <ul>
              <li v-for="project in projects" :key="project">{{ project }}</li>
              <li>...</li>
            </ul>
          </td>
        </tr>
      </table>
    </section>
  </div>
</template>

<script>
import { orderBy, union, unionBy } from 'lodash-es'

const CONTRIBUTIONS = [
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/46',
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/43',
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/41',
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/44',
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/37',
  'https://github.com/isaaceindhoven/testcafe-scaffolding/issues/2',
  'https://github.com/isaaceindhoven/testcafe-scaffolding/issues/1',
  'https://github.com/isaaceindhoven/php-code-sniffer-standard',
  'https://github.com/isaaceindhoven/composer-git-hooks',
  'https://github.com/netz98/n98-magerun2/pull/652',
  'https://github.com/netz98/n98-magerun2/pull/655',
  'https://github.com/isaaceindhoven/plantuml-styler/pull/2',
  'https://github.com/symfony/symfony/pull/38940',
  'https://github.com/symfony/symfony/pull/38941',
  'https://github.com/stefvdwel/gridsome-source-magento',
  'https://github.com/isaaceindhoven/composer-semver-cli/',
  'https://github.com/netz98/n98-magerun2/pull/651',
  'https://github.com/netz98/n98-magerun2/pull/653',
  'https://github.com/netz98/n98-magerun2/pull/654',
  'https://github.com/symfony/symfony/issues/38904',
  'https://github.com/symfony/symfony/issues/38906',
  'https://github.com/symfony/symfony/pull/38903',
  'https://github.com/DefectDojo/django-DefectDojo/pull/3017',
  'https://github.com/docksal/addons/pull/70',
  'https://github.com/symfony/symfony-docs/pull/14503',
  'https://github.com/DefectDojo/django-DefectDojo/pull/3136',
  'https://github.com/DefectDojo/Documentation/pull/148',
  'https://github.com/DefectDojo/django-DefectDojo/pull/3119',
]
const GITHUB_HTML_BASE_URL = 'https://github.com/'

export default {
  data() {
    return {
      apiBaseUrl: 'https://api.github.com',
      pullRequests: [],
      projects: [],
    }
  },

  computed: {
    linesOfCode() {
      return this.pullRequests.reduce(
        (acc, { additions, deletions }) => acc + additions + deletions,
        0
      )
    },
  },

  mounted() {
    if (this.$auth.loggedIn) {
      this.getData()
    }
  },

  methods: {
    async getPullRequestData(path) {
      const isExistingPullRequest =
        this.pullRequests.findIndex(
          ({ html_url: htmlUrl }) =>
            htmlUrl.split(GITHUB_HTML_BASE_URL)[1] === path
        ) !== -1

      if (!isExistingPullRequest) {
        // eslint-disable-next-line no-unused-vars
        const [owner, repo, type, pullNumber] = path.split('/')
        const response = await this.$axios.$get(
          `${this.apiBaseUrl}/repos/${owner}/${repo}/pulls/${pullNumber}`
        )

        this.pullRequests = unionBy(this.pullRequests, [response], 'id')
        this.projects = orderBy(
          union(this.projects, [
            [response.base.repo.owner.login, response.base.repo.name].join('/'),
          ])
        )
      }
    },
    getIssueData(path) {},
    getRepositoryData(path) {},
    getData() {
      return Promise.allSettled(
        CONTRIBUTIONS.map((contributionUrl) => {
          const contributionPath = contributionUrl.split(
            GITHUB_HTML_BASE_URL
          )[1]

          if (contributionUrl.includes('pull')) {
            return this.getPullRequestData(contributionPath)
          }

          if (contributionUrl.includes('issues')) {
            return this.getIssueData(contributionPath)
          }

          return this.getRepositoryData(contributionPath)
        })
      )
    },
  },
}
</script>

<style>
table ul {
  margin: 0;
  padding: 0;
  padding-left: 1rem;
}

th,
td {
  vertical-align: top;
}

table tr th {
  text-align: left;
  padding-right: 0.75rem;
  padding-bottom: 0.5rem;
}

.green {
  color: green;
}

.red {
  color: red;
}
</style>
