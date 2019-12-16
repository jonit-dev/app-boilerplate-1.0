import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';

import { appEnv } from '../constants/Env.constant';

export const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        {appEnv.appNameFull}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
