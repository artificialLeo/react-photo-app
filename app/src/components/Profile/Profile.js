import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    profile: {
        overflow: 'hidden'
    }
}));
const Profile = () => {
    const classes = useStyles();
    const { user } = useAuth0();

    return (
        <div className={classes.profile}>
            {JSON.stringify(user, null, 2)}
        </div>
    );
};

export default Profile;