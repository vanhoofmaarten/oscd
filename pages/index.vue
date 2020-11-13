<template>
  <div>
    <section>
      <template v-if="$auth.loggedIn">
        <table v-if="loaded">
          <thead>
            <tr>
              <th>Project</th>
              <th>Code added</th>
              <th>Code removed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="repository in contributions" :key="repository.id">
              <td>
                <a :href="repository.url">{{ repository.name }}</a>
              </td>
              <td>{{ formatNumber(repository.additions) }}</td>
              <td>{{ formatNumber(repository.deletions) }}</td>
              <td></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>{{ contributions.length }}</td>
              <td>{{ formatNumber(additions) }}</td>
              <td>{{ formatNumber(deletions) }}</td>
              <td>{{ formatNumber(linesOfCode) }}</td>
            </tr>
          </tfoot>
        </table>
        <div v-else>Loading ...</div>
      </template>
      <template v-else>
        <p>Login with your GitHub account to view data.</p>
        <button v-if="!$auth.loggedIn" @click="$auth.loginWith('github')">
          Login with GitHub
        </button>
      </template>
    </section>
  </div>
</template>

<script>
const CONTRIBUTIONS = [
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/46',
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/43',
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/41',
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/44',
  'https://github.com/isaaceindhoven/testcafe-reporter-allure/pull/37',
  'https://github.com/isaaceindhoven/testcafe-scaffolding/pull/3',
  'https://github.com/isaaceindhoven/testcafe-scaffolding/pull/4',
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
      contributions: [],
      loaded: false,
    }
  },

  computed: {
    additions() {
      return this.contributions.reduce(
        (acc, { additions }) => acc + additions,
        0
      )
    },
    deletions() {
      return this.contributions.reduce(
        (acc, { deletions }) => acc + deletions,
        0
      )
    },
    linesOfCode() {
      return this.additions + this.deletions
    },
  },

  mounted() {
    if (this.$auth.loggedIn) {
      this.getData()
    }
  },

  methods: {
    async getPullRequestData(path) {
      // eslint-disable-next-line no-unused-vars
      const [owner, repo, type, pullNumber] = path.split('/')
      const { base, additions, deletions } = await this.$axios.$get(
        `${this.apiBaseUrl}/repos/${owner}/${repo}/pulls/${pullNumber}`
      )

      return {
        id: base.repo.id,
        name: base.repo.name,
        url: base.repo.url,
        additions,
        deletions,
      }
    },

    async getRepositoryData(path) {
      // eslint-disable-next-line no-unused-vars
      const [owner, repo] = path.split('/')
      const { id, name, html_url: url } = await this.$axios.$get(
        `${this.apiBaseUrl}/repos/${owner}/${repo}`
      )

      const languagesResponse = await this.$axios.$get(
        `${this.apiBaseUrl}/repos/${owner}/${repo}/languages`
      )

      return {
        id,
        name,
        url,
        owner,
        additions: Object.values(languagesResponse).reduce(
          (acc, languageAmount) => acc + languageAmount
        ),
        deletions: 0,
      }
    },

    formatNumber(value) {
      return new Intl.NumberFormat('nl-NL').format(value)
    },

    async getData() {
      const data = await Promise.allSettled(
        CONTRIBUTIONS.reduce((acc, contributionUrl) => {
          const contributionPath = contributionUrl.split(
            GITHUB_HTML_BASE_URL
          )[1]

          if (contributionUrl.includes('pull')) {
            return [...acc, this.getPullRequestData(contributionPath)]
          }

          if (contributionUrl.includes('issues')) {
            return acc
          }

          return [...acc, this.getRepositoryData(contributionPath)]
        }, [])
      )

      this.contributions = data
        .reduce((acc, result) => {
          if (result.status === 'fulfilled') {
            return [...acc, result.value]
          }
        }, [])
        .reduce((acc, contribution) => {
          const existingContributionIndex = acc.findIndex(
            ({ id }) => id === contribution.id
          )

          if (existingContributionIndex !== -1) {
            acc[existingContributionIndex].deletions += contribution.deletions
            acc[existingContributionIndex].additions += contribution.additions
            return acc
          } else {
            return [...acc, contribution]
          }
        }, [])
      this.loaded = true
    },
  },
}
</script>

<style>
table {
  border-collapse: collapse;
}

table ul {
  margin: 0;
  padding: 0;
  padding-left: 1rem;
}

th,
td {
  padding: 0.33rem 0.66rem;
  vertical-align: top;
}

td {
  border-top: 1px solid #ccc;
}

thead th {
  text-align: left;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ccc;
}

tfoot td {
  border-top: 2px solid #ccc;
  padding-top: 0.5rem;
}

.green {
  color: green;
}

.red {
  color: red;
}
</style>
