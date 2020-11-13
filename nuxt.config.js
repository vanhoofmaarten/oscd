export default {
  target: 'static',
  ssr: false,

  head: {
    title: 'oscd',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['normalize.css'],

  plugins: [],

  components: true,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/stylelint-module'],

  modules: ['@nuxtjs/axios'],

  build: {},

  generate: {
    crawler: false,
  },
}
