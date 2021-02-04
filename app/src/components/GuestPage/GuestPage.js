import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Avatar from "@material-ui/core/Avatar";
import Pagination from "@material-ui/lab/Pagination";
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from "../Modal/Modal";
import PostCard from "../PostCard/PostCard";
import {connect} from "react-redux";
import {deletePost, getUser} from "../../store/reducers";
import { selectUserData } from "../../store/actions";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        minWidth: '200px',
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        minWidth: '220px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%',
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    pagination: {
    position: 'relative',
    top: '35px',
    }
}));


const GuestPage = ({getUser, userData, deletePost, history}) => {
    const classes = useStyles();
    const {user} = useAuth0();

    const [currentUserData, setCurrentUserData] = useState({});
    const [currentUserPosts, setCurrentUserPosts] = useState([]);
    const [amountOfPages, setAmountOfPages] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [isFollower, setIsFollower] = useState(false);

    useEffect(() => {
        const currentUserRoutePath = history.location.pathname;
        const currentUserMail = currentUserRoutePath.substring(currentUserRoutePath.length, currentUserRoutePath.lastIndexOf('/') + 1);

        axios.get("http://localhost:4000/api/users/" + currentUserMail, { params: { id: currentUserMail }})
            .then(response => {
                let guestData = response.data;
                let pagesInWindow = Math.ceil(response.data.posts.length / 6);

                setAmountOfPages(pagesInWindow);
                setCurrentUserData(guestData);
            });
        axios.get("http://localhost:4000/api/users/" + user.email, { params: { id: user.email }})
            .then(response => {
                let isFollow = response.data.followers.includes(currentUserMail);

                setIsFollower(isFollow);
            });
        axios.put("http://localhost:4000/api/page", { params: { mail: currentUserMail, page: 1 }})
            .then(response => {
                let guestPots = response.data.posts;

                setCurrentUserPosts(guestPots)
            });
    }, [history.location.pathname, user.email]);

    const followHandler = () => {
        if ( isFollower ) {
            axios.put('http://localhost:4000/api/followers', {params: { mail: user.email, userName: currentUserData.mail  } });
        } else {
            axios.post('http://localhost:4000/api/followers', {params: { mail: user.email, userName: currentUserData.mail  } });
        }
        setIsFollower(!isFollower)
    };

    const paginationHandler = (event, value) => {
        setActivePage(value);

        axios.put("http://localhost:4000/api/page", { params: { mail: currentUserData.mail, page: value }})
            .then(response => {
                let guestPots = response.data.posts;

                setCurrentUserPosts(guestPots)
            });
    };

    const removeCard = (searchParamsForDatabase) => {
        deletePost(searchParamsForDatabase, user.email);
        const newRenderList = currentUserPosts && currentUserPosts.filter((item) => item.postComId !== searchParamsForDatabase);
        setCurrentUserPosts(newRenderList);
    };

    return (
        <div>

            <React.Fragment>
                <CssBaseline />
                <main>
                    {/* Hero unit */}
                    <div className={classes.heroContent}>

                        <Container maxWidth="sm">
                            <Grid container alignItems="center" justify="space-around">
                                <Avatar alt="avatar" src={currentUserData.ava} className={classes.large}/>

                                <Typography variant="h5" align="center" color="textPrimary">
                                    {currentUserData.mail}
                                </Typography>

                                <Button variant="contained" color="primary" className={classes.heroButtons} onClick={followHandler}>
                                    {isFollower ? 'Unfollow' : 'Follow'}
                                </Button>

                            </Grid>
                        </Container>

                    </div>
                    <Container className={classes.cardGrid} maxWidth="sm">
                        {/* End hero unit */}
                        <Grid container spacing={4} justify="center">
                        <Grid container spacing={4} justify="center" xs={12} sm={6}>
                            {!currentUserPosts ? <CircularProgress/> :
                            currentUserPosts.map((item, i) =>

                                <PostCard key={i}
                                comments={item.comments}
                                photo={item.img}
                                description={item.description}
                                liked={item.liked}
                                postComId={item.postComId}
                                allDataForRemoveHandling={userData.posts}
                                removeCard={removeCard}/>
                            )}


                        </Grid>
                            { amountOfPages > 1 && <Pagination className={classes.pagination}
                                                               count={amountOfPages && amountOfPages}
                                                               page={activePage}
                                                               color="primary"
                                                               onChange={paginationHandler}
                            />}
                        </Grid>

                    </Container>
                </main>


            </React.Fragment>

        </div>
    );
};

const mapStateToProps = (state) => ({
    userData: selectUserData(state)
});


export default connect(mapStateToProps, {getUser, deletePost})(GuestPage);