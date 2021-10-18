const Busboy = require('busboy');
const MaximumFileSizeException = require('../exceptions/maximum-file-size-exception');

exports.formData = (req, res, next) => {
  const mimeReg = /^(?:multipart\/.*)|(?:application\/x-www-form-urlencoded)&/i;
  const header = (req.headers['content-type'] || '').split(';')[0];

  req.body = {};
  req.body.files = {};

  if (!mimeReg.test(header)) {
    return next();
  }

  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      fieldSize: 100 * 1024 * 1024, //100MB
    },
  });

  busboy.on(
    'field',
    (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimeType) => {
      req.body[fieldname] = val;
    }
  );

  busboy.on('file', (fieldname, file, filename, encoding, mimeType) => {
    file.on('limit', () => {
      next(new MaximumFileSizeException(100));
    });

    file.on('data', (buffer) => {
      if (req.body.files[filename]) {
        req.body.files[filename].buffer.push(buffer);
      } else {
        req.body.files[filename] = {
          filename,
          mimeType,
          encoding,
          buffer: [buffer],
        };
      }
    });

    file.on('end', () => {
      req.body.files[filename].buffer = Buffer.concat(
        req.body.files[filename].buffer
      );
    });
  });

  busboy.on('finish', () => {
    next();
  });

  req.pipe(busboy);
};
