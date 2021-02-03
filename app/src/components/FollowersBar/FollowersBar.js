import React, {useEffect, useRef, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import StarRounded from '@material-ui/icons/StarRounded';
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {Link, NavLink} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        position: 'sticky',
        bottom: '-10px',
        left: '0',
        paddingBottom: 50,
        marginTop: '20px',
        width: '300px',
        overflow: 'auto'
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
        zIndex: 0
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
    dn: {
        display: 'none !important',
    },
    menuItem: {
        position: 'relative'
    },
    menuButton: {
        position: 'absolute',
        right: '2%',
        top: '10%'
    }
}));

export default function FollowersBar() {
    const classes = useStyles();

    const { user } = useAuth0();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/api/users/")
            .then(response => {

                let currentFollowers = response.data.filter(item => item.mail === user.email ).map( item => item.followers );

                let renderedFollowers = response.data.filter( item => currentFollowers[0].includes(item.mail) ).filter( item => item.mail !== user.email );
                let renderedGuests = response.data.filter( item => !currentFollowers[0].includes(item.mail) ).filter( item => item.mail !== user.email );

                setFollowers(renderedFollowers);

                setGuests(renderedGuests);

            });
    }, [user.email]);

    const toggleMenu = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false)
        } else {
            setIsMenuOpen(true);
        }
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Paper square className={isMenuOpen ? classes.paper : classes.dn}>
                <Typography className={classes.text} variant="h5" gutterBottom>
                    Followers
                </Typography>
                <List className={classes.list}>
                        <React.Fragment>

                             <ListSubheader className={classes.subheader}>Followers</ListSubheader>

                             {  followers.map((item, i) => <FollowersBarUser key={i} name={item.mail} avatar={item.ava} follows={true} /> ) }

                             <ListSubheader className={classes.subheader}>Guests</ListSubheader>

                            {  guests.map((item, i) => <FollowersBarUser key={i} name={item.mail} avatar={item.ava} follows={false} /> ) }

                        </React.Fragment>
                </List>
            </Paper>
            <AppBar position="fixed" color="primary" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleMenu}>
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.grow} />
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}


const FollowersBarUser = ({ avatar, name, ids, follows }) => {
    const classes = useStyles();

    const { user } = useAuth0();

    const [followColor, setFollowColor] = useState(follows);

    const follow = (email, follows) => {
        if (followColor ) {
            setFollowColor(false);
            axios.put('http://localhost:4000/api/followers', {params: { mail: user.email, userName: email  } });
        } else {
            setFollowColor(true);
            axios.post('http://localhost:4000/api/followers', {params: { mail: user.email, userName: email  } });
        }
    };

    return (
        <NavLink to = {`/guests/${name}`}>
        <div key={ids} className={classes.menuItem}>
            <ListItem button >
                <ListItemAvatar>
                    <Avatar alt="Profile Picture" src={avatar}/>
                </ListItemAvatar>
                <ListItemText primary={name}/>
            </ListItem>
            <IconButton edge="start" color="inherit" aria-label="add-favs" className={classes.menuButton} onClick={follow.bind(this, name, follows)}>
                <StarRounded  color={ followColor ? "primary" : "disabled"} />
            </IconButton>
        </div>
        </NavLink>
    );
};