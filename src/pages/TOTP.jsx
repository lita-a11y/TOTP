import { Buffer } from 'buffer';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Authenticator } from '@otplib/core';
import { keyDecoder, keyEncoder } from '@otplib/plugin-thirty-two';
import { createDigest, createRandomBytes } from '@otplib/plugin-crypto-js';

import { Box, Card, Stack, Divider, Typography } from '@mui/material';

export default function TOTP() {
  // if (!window.Buffer) window.Buffer = Buffer;
  // const newAuthenticator = new Authenticator({
  const authenticator = new Authenticator({
    createDigest,
    createRandomBytes,
    keyDecoder,
    keyEncoder
  });
  // const [authenticator, setAuthenticator] = useState();
  useEffect(() => {
    console.log('init');
    // @ts-ignore
    if (!window.Buffer) window.Buffer = Buffer;
    // const d = createDigest(HashAlgorithms.SHA1, 'xx', '1');
    // const r = createRandomBytes(10, KeyEncodings.BASE64);
    // console.log(d, r);
    // const newAuthenticator = new Authenticator({
    //   createDigest,
    //   createRandomBytes,
    //   keyDecoder,
    //   keyEncoder
    // });
    // setAuthenticator(newAuthenticator);
    timer30sec();
    // eslint-disable-next-line
  }, []);


  const userData = [
    {
      user: 'github',
      service: 'GitHub1',
      secret: 'PX7ZSMD3ZWTAIPYY',
      token: '-'
    },
    {
      user: 'github2',
      service: 'GitHub',
      secret: 'PX7ZSMD3ZWTAIPYZ',
      token: '-'
    },
    {
      user: 'github3',
      service: 'GitHub3',
      secret: 'PX7ZSMD3ZWTAIPYX',
      token: '-'
    },
  ];
  const [data, setData] = useState(userData);

  const timer30sec = () => {
    console.log('timer30sec');
    // eslint-disable-next-line
    const uData = data.map(el => {
      return {
        ...el,
        token: authenticator.generate(el.secret)
      }
    });
    setData(uData);
  }



  return (
    <>
      <Helmet>
        <title> TOTP </title>
      </Helmet>

      <Box>
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 800,
            }}
          >
            <Stack direction='column' spacing={2} alignItems='center'>

              <ClockTimer timer30sec={timer30sec} />

              <Divider sx={{ my: 3, width: 400 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Token
                </Typography>
              </Divider>

              {
                data.map((el, idx) => (
                  <Stack key={`${idx}
                  -${el.user}-${el.service}`}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {`${el.user} | ${el.service}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {el.secret}
                    </Typography>
                    <Typography>
                      {el.token}
                    </Typography>
                  </Stack>
                ))
              }






            </Stack>

          </Card>
        </Stack>
      </Box>
    </>
  );
}



const ClockTimer = ({ timer30sec }) => {
  const [timeDisplay, setTimeDisplay] = useState('00:00:00');

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      const sec = now.getSeconds();
      if (sec % 30 === 0) timer30sec();
      // if (sec === 5 || sec === 35) timer30sec();
      // setTimeDisplay(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(sec).padStart(2, '0')}`);
      // British English uses 24-hour time without AM/PM
      setTimeDisplay(`${now.toLocaleTimeString("en-GB")}`);
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line
  }, []);

  return (
    <Typography>
      {`${timeDisplay}`}
    </Typography>
  );
}

ClockTimer.propTypes = {
  timer30sec: PropTypes.func,
};