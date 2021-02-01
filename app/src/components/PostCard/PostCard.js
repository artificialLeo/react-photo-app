import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import AddCommentRoundedIcon from '@material-ui/icons/AddCommentRounded';

import { useAuth0 } from "@auth0/auth0-react";
import {selectPostData} from "../../store/actions";
import {connect} from "react-redux";
import {deletePost} from "../../store/reducers";


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '10px',
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

function PostCard({deletePost, postData, comments, photo, description, liked, postComId}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const { user } = useAuth0();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const renderComment = (author, text, i) => {
        return (
            <div key={i}>
                <Typography variant="h6">{author}</Typography>
                <Typography paragraph>{text}</Typography>
            </div>
        );
    };

    const removeCard = (searchParamsForDatabase) => {
        console.log(searchParamsForDatabase)
        deletePost(searchParamsForDatabase, user.email);
    };

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" src={user.picture} className={classes.avatar}>
                    </Avatar>
                }
                action={
                    <IconButton aria-label="delete" onClick={removeCard.bind(this, postComId)} >
                        <CancelRoundedIcon fontSize="large"   />
                    </IconButton>
                }

            />
            <CardMedia
                className={classes.media}
                image={photo || 'img'}
                alt="Post Photo"
                title="Post"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon color={`${liked === 'true' ? "error" : "primary" }`} />
                </IconButton>
                <IconButton aria-label="share">
                    <AddCommentRoundedIcon />
                </IconButton>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>

                    {comments && comments.map( ( item, i ) => renderComment(item.author, item.text, i) )}

                </CardContent>
            </Collapse>
        </Card>
    );
}

const mapStateToProps = (state) => ({
    postData: selectPostData(state)
});


export default connect(mapStateToProps, {deletePost})(PostCard);