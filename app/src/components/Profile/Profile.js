import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import PostCard from "../PostCard/PostCard";
import { connect } from "react-redux";
import { selectUserData } from "../../store/actions";
import { getUser } from "../../store/reducers";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '20px'
    },

}));

const Profile = ({getUser, userData}) => {
    const classes = useStyles();
    const {user} = useAuth0();

    useEffect(() => {
        getUser(user.email);

        // axios.delete("http://localhost:4000/api/users/0", {
        //     params: {
        //         id: 0
        //     }
        // }).then(response => console.log(response.data));

        async function DeleteUser(id) {
            const response = await fetch("http://localhost:4000/api/users" + id, {
                method: "DELETE",
                headers: { "Accept": "application/json" }
            });
            if (response.ok === true) {
                const user1 = await response.json();
                console.log(user1)
            }
        }

    }, [getUser, user.email]);


    const renderCards = () => {
        return userData.posts && userData.posts.map( ( item, i ) => <PostCard key={i}
                                                                              comments={item.comments}
                                                                              photo={item.img}
                                                                              description={item.description}
                                                                              liked={item.liked}
                                                                              postComId={item.postComId} />);
    };

    return (
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              className={classes.root}
        >


            { renderCards() }
        </Grid>
    );
};

const mapStateToProps = (state) => ({
    userData: selectUserData(state)
});


export default connect(mapStateToProps, {getUser})(Profile);