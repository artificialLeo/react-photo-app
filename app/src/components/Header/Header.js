import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {CenterFocusWeakRounded} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {MenuItem} from "@material-ui/core"
import { useAuth0 } from "@auth0/auth0-react";
import Avatar from '@material-ui/core/Avatar';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        marginLeft: "10px"
    },
    logo: {
        borderRadius: "25px",
        marginRight: "10px"
    }
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    const loginSwitch = () => {
        isAuthenticated ? logout() : loginWithRedirect();
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>

                    <MenuItem className={classes.logo} component={Link} to={'/'}><CenterFocusWeakRounded
                        fontSize="large"/>
                    </MenuItem>
                    <Avatar src={`${isAuthenticated ? user.picture : ""}`} />
                    <Typography variant="h6" className={classes.title}>
                        {`${isAuthenticated ? user.nickname : "Please, Log In!"}`}
                    </Typography>
                    <Button color="inherit" onClick={loginSwitch} >{`${isAuthenticated ? "Log Out" : "Log In"}`}</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}