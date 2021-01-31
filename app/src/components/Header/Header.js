import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    header: {
        margin: '0',
        backgroundColor: 'red',
        height: '75px'
    }
}));

const Header = () => {
    const classes = useStyles();

    return (
        <Grid item={true} xs={12} lg={12} className={classes.header}>
            
        </Grid>
    );
};

export default Header;