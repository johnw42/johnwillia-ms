const Cors = require('cors');

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

// https://nextjs.org/docs/pages/building-your-application/routing/api-routes
const handler = async (req, res) => {
  await new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
        return;
      }
      resolve(result);
    });
  });

  const authResponse = await fetch(
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    {
      method: 'post',
      body:
        'client_id=' +
        req.query.client_id +
        '&redirect_uri=' +
        encodeURIComponent(req.query.redirect_uri) +
        '&grant_type=authorization_code' +
        '&code=' +
        encodeURIComponent(req.query.code) +
        '&code_verifier=' +
        encodeURIComponent(req.query.code_verifier) +
        '&client_secret=' +
        encodeURIComponent(process.env.AZURE_CLIENT_SECRET ?? ''),
    }
  );
  res.end(res.status(authResponse.status).send(authResponse.text()));
};

export default handler;
