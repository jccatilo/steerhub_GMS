import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname to work with ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  root: resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  server: {
    port: 8081,
    hot: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        user: resolve(__dirname, 'src/pages/user/index.html'),
        register: resolve(__dirname, 'src/pages/register/index.html'),
        forgot_password: resolve(__dirname, 'src/pages/forgot-password/index.html'),
        gms_qr_verifiter_app: resolve(__dirname, 'src/pages/gms-qr-verifier-app/index.html'),
        research_center_dashboard: resolve(__dirname, 'src/pages/research-center-dashboard/index.html'),
        research_center_forgot_password: resolve(__dirname, 'src/pages/research-center-forgot-password/index.html'),
        research_center_login: resolve(__dirname, 'src/pages/research-center-login/index.html'),
        research_center_reset_password: resolve(__dirname, 'src/pages/research-center-reset-password/index.html'),
        research_center_signup: resolve(__dirname, 'src/pages/research-center-sign-up/index.html'),
        reset_password: resolve(__dirname, 'src/pages/reset-password/index.html'),
      },
    },
  },
  base:'',
  publicDir: resolve(__dirname, 'public'),  // Set the public directory
};
