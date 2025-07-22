require('isomorphic-fetch');
const app = require('../editor');

(() => {
  app(port => {
    console.log(`http://localhost:${port}/`);
    fetch(`http://localhost:${port}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'mutation { updateBook { id } }' }),
    })
      .then(res => res.json())
      .then(({ data }) => {
        const updatedPages = data.updateBook.map(page => page.id);
        console.log('generated page data for:');
        updatedPages.forEach(page => {
          console.log(page);
        });
        process.exit();
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  });
})();
