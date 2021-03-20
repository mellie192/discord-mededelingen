import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import './App.css';

async function connectWebHook(data) {
  const res = await fetch(process.env.REACT_APP_WEBHOOK , {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-cache',
    body: JSON.stringify(data)
  });

  return res;
}

const handleWebhook = async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target));
  const { title, description, color, image, username, footer } = formData;

  const data = {
    username: username,
    embeds: [{ color: color }]
  }

  if(title) data.embeds[0].title = title;
  if(description) data.embeds[0].description = description;
  if(image) data.embeds[0].image = {url: image};
  if(footer) data.embeds[0].footer = {text: footer};

  await connectWebHook(data);
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.poortvannoord.nl/">
        Poort van Noord
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const App = props => {
  const [ showMessageForm, setShowMessageForm ] = useState(false);
  const classes = useStyles();

  function checkPassword(e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    if(process.env.REACT_APP_PASSWORD === formData.get('password')) {
      setShowMessageForm(true);
    }
  }

  const EnterForm = props => {
    if(!showMessageForm) {
      return (
          <Fragment>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form onSubmit={((e) => checkPassword(e))} className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
            </form>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <Typography component="h1" variant="h5">
              Verstuur een mededeling
            </Typography>
            <Typography component="p">
              Zorg er eerst voor dat <a href="https://glitch.com/edit/#!/bot-van-noord">deze pagina</a> open staat vóór het versturen van dit formulier
            </Typography>
            <form onSubmit={handleWebhook}className={classes.form} noValidate>
              <input type="hidden" name="color" value="5395153" />
              <input type="hidden" name="username" value="Bot van Noord Webhook" />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="title"
                label="Titel"
                id="title"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Beschrijving"
                id="description"
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="image"
                label="Afbeelding"
                id="image"
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="footer"
                label="Footer"
                id="footer"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Verstuur
              </Button>
            </form>
          </Fragment>
        )
      }
    }
    

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <EnterForm />
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default App;
