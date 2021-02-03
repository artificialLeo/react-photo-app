import React from 'react';
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
    footer: {
        marginTop: '20px',
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3),
    }
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
                Step project
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                All rights reserved!
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://dan-it.com.ua/">
                    Dan-it.com
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </footer>
    );
};

export default Footer;