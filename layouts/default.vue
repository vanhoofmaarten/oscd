<template>
  <div class="layout">
    <header>
      <div class="brand">OSCD2020</div>
    </header>
    <main>
      <nuxt />
    </main>
    <footer>
      Powered by
      <a target="_blank" rel="noopener" href="https://isaac.nl">ISAAC</a>
    </footer>
  </div>
</template>

<style>
body {
  font-family: sans-serif;
}

a {
  color: #000;
  text-decoration: underline;
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

footer {
  background-color: #eee;
  padding: 1.5rem;
}
</style>
