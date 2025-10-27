// FILE: backend/config/server.js
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'), // ← ALLOWS PHONE TO CONNECT
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://10.116.184.136:1337'), // ← PUBLIC URL
  app: {
    keys: env.array('APP_KEYS'),
  },
  admin: {
    url: '/admin',
  },
});