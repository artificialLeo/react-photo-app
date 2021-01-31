import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import PostCard from "../PostCard/PostCard";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '20px'
    },

}));

const Profile = ({data}) => {
    const classes = useStyles();
    const {user} = useAuth0();

    useEffect(() => {
        console.log(data)
    }, []);


    return (
        <Grid container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              className={classes.root}
        >
                <PostCard/>
                <PostCard/>
                <PostCard/>
                <PostCard/>
        </Grid>
    );
};

export default Profile;