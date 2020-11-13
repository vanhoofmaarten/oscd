<template>
  <div class="layout">
    <header>
      <div class="brand">OSCD2020</div>
      <button v-if="!$auth.loggedIn" @click="$auth.loginWith('github')">
        Login with GitHub
      </button>
      <template v-else>
        <div>
          Logged in as: <strong>{{ login }}</strong>
        </div>
        <button class="logout" @click="$auth.logout()">Logout</button>
      </template>
    </header>
    <main>
      <nuxt />
    </main>
  </div>
</template>

<script>
export default {
  computed: {
    login() {
      return this.$auth.user?.login
    },
  },
}
</script>

<style>
body {
  font-family: sans-serif;
}
</style>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #eee;
  padding: 1.5rem;
  display: flex;
  align-items: center;
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
  flex-grow: 1;
}

main {
  flex-grow: 1;
  padding: 1.5rem;
}

.logout {
  margin-left: 0.75rem;
}
</style>
