const path = require('path')

export default {
  root: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  server: {
    port: 8080,
    hot: true
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/pages/index.html'),
        page1: path.resolve(__dirname, 'src/pages/page1.html'),
        page2: path.resolve(__dirname, 'src/pages/page2.html'),
      },
    },
  },
}
