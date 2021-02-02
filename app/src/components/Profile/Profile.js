import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import PostCard from "../PostCard/PostCard";
import { connect } from "react-redux";
import { selectUserData } from "../../store/actions";
import { getUser, deletePost } from "../../store/reducers";
import axios from "axios";
import { useSelector } from 'react-redux'
import FollowersBar from "../FollowersBar/FollowersBar";


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '20px'
    },

}));

const Profile = ({getUser, userData, deletePost}) => {
    const classes = useStyles();
    const {user} = useAuth0();

    let [renderedCards, setNumberOfRenderedCards] = useState([]);

    useEffect(() => {
        // getUser(user.email);
        axios.get("http://localhost:4000/api/users/" + user.email, { params: { id: user.email }})
             .then(response => setNumberOfRenderedCards(response.data.posts) );

        // setNumberOfRenderedCards(userData.posts);
    }, [getUser, userData, user.email]);





    const removeCard = (searchParamsForDatabase) => {
        deletePost(searchParamsForDatabase, user.email);
        const newRenderList = renderedCards && renderedCards.filter((item) => item.postComId !== searchParamsForDatabase);
        setNumberOfRenderedCards(newRenderList);
    };

    const renderCards = () => {
        return renderedCards && renderedCards.map( ( item, i ) => <PostCard key={i}
                                                                              comments={item.comments}
                                                                              photo={item.img}
                                                                              description={item.description}
                                                                              liked={item.liked}
                                                                              postComId={item.postComId}
                                                                              allDataForRemoveHandling={userData.posts}
                                                                              removeCard={removeCard}
        />);};

    return (
        <div>
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              className={classes.root}>
            { renderCards() }
        </Grid>
            <FollowersBar />
        </div>
    );
};

const mapStateToProps = (state) => ({
    userData: selectUserData(state)
});


export default connect(mapStateToProps, {getUser, deletePost})(Profile);
