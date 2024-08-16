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
        main: path.resolve(__dirname, 'src/index.html'),
        user: path.resolve(__dirname, 'src/pages/user/index.html'),
        center: path.resolve(__dirname, 'src/pages/center/index.html'),
      },
    },
  },
  publicDir: path.resolve(__dirname, 'public')  // Set the public directory
}
