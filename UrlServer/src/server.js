const express = require('express');
const cors = require('cors')
const expressWinston = require('express-winston');
const winston = require('winston');
const bodyParser = require('body-parser');
const shortidGen = require('shortid');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require(`${__dirname}/lib/database`);
const common = require(`${__dirname}/lib/common`);
const UrlModel = require(`${__dirname}/models/UrlModel`);

const version = process.env.VERSION;

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.json()
  )
}));

app.get('/version', (req, res) => {
  res.status(200).json({ version });
});

app.post('/urls', (req, res) => {
  const request = Object.assign({}, req.body);

  const original = request.url;
  const expiryTime = request.exp;

  if (!original || expiryTime && expiryTime < -1) {
    return res.status(422).json({ details: 'Inavalid arguments' });
  }

  const retryGetUrl = (count) => {
    if (count <= 0) {
      return Promise.reject('No available URLs at the moment');
    }

    const shortid = shortidGen.generate();
    return UrlModel.findOne({ shortid })
        .then((url) => {
          if (url) {
            return retryGetUrl(count - 1);
          }
          return shortid;
        });
  }

  retryGetUrl(common.NUM_URL_RETRIES)
      .then((shortid) => {
        const url = new UrlModel({ original, shortid, expiryTime });
        return url.save();
      }).then((url) => {
        res.status(201).json({ url });
      }).catch((error) => {
        res.status(400).json({ details: error });
      });
});

app.get('/urls', (req, res) => {
  const query = req.query;
  const shortid = query.shortid;
  const isSingle = query.first || query.first === '';
  const isValid = query.valid || query.valid === '';

  const and = [];
  if (shortid) {
    and.push({ shortid: shortid });
  }

  if (isValid) {
    and.push({ $or: [{ expiresAt: { $gt: new Date() } }, { expiryTime: -1 }] });
  }

  const condition = {};

  if (and.length > 0) {
    condition.$and = and;
  }

  UrlModel.find(condition)
      .then((urls) => {
        if (urls.length === 0) {
          return res.status(404).json({ details: 'Resource not found' });
        }

        if (isSingle) {
          return res.status(200).json({ url: urls[0] });
        }

        return res.status(200).json({ urls });
      }).catch((error) => {
        res.status(400).json({ details: error });
      });
});

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.json()
  )
}));

app.listen(process.env.URL_SERVER_PORT, () => {
  console.log(`UrlServer listening on port ${process.env.URL_SERVER_PORT}`);
});
