

export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.102:5000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}