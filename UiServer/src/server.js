const express = require('express');
const path = require('path');
const request = require('request-promise-native');
const app = express();
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/:shortid', (req, res) => {
  const shortid = req.params.shortid;

  const options = {
    url: `http://${process.env.URL_SERVER_ALIAS}:${process.env.URL_SERVER_PORT}/api/urls?first&valid&shortid=${shortid}`
  }

  return request.get(options)
      .then((response) => {
        let url = JSON.parse(response).url.original;
        url = !url.startsWith('http://') && !url.startsWith('https://')
            ? `http://${url}` : url;
        res.status(301).redirect(url);
      }).catch(() => {
        res.status(404).send('Not Found');
      });
});

app.listen(process.env.UI_SERVER_PORT, () => {
  console.log(`UiServer listening on port ${process.env.UI_SERVER_PORT}`);
});
