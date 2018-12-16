// import Raven from 'raven-js';

function init() {
  // Raven.config("https://59c5a5b136874b88bb8d115e836ef2c3@sentry.io/1318435", {
  //   release: '1-0-0',
  //   environment: 'development-test',
  // }).install()
}

function log(error) {
  console.error(error);
  // Raven.captureException(error);
}

export default{
  init,
  log
}