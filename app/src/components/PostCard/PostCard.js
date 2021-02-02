import React, {useEffect, useRef, useState} from 'react';
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
import { Input } from '@material-ui/core';

import { useAuth0 } from "@auth0/auth0-react";
import {selectPostData} from "../../store/actions";
import {connect} from "react-redux";
import {deletePost} from "../../store/reducers";
import axios from "axios";


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
    inputForComment: {
        marginTop: '10px'
    }
}));

export default function PostCard({deletePost, postData, comments, photo, description, liked, postComId, removeCard}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const commentInput = useRef(null);

    const { user } = useAuth0();

    const [like, setLike] = useState(liked);
    const [commentToAdd, setCommentToAdd] = useState('');
    const [commentsList, setCommentsList] = useState(comments);

    // useEffect(() => {
    //
    // }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleInputChange = () => {
        setCommentToAdd(commentInput.current.value)

    };

    const handleInputReset = () => {
        // commentInput.current.value = '';
        // setCommentToAdd('')

    };

    const renderComment = (author, text, i) => {
        return (
            <div key={i}>
                <Typography variant="h6">{author}</Typography>
                <Typography paragraph>{text}</Typography>
            </div>
        );
    };

    const likePost = (likeValue, id) => {
        if (like === 'true') {
            setLike('false');
            axios.put("http://localhost:4000/api/users/fav"+id, { params: { id: id, mail: user.email, liked: 'false' }});
        } else {
            setLike('true');
            axios.put("http://localhost:4000/api/users/fav"+id, { params: { id: id, mail: user.email, liked: 'true' }});
        }
    };

    const addComment = (id) => {
        if (commentToAdd.length !== 0) {
            axios.post("http://localhost:4000/api/comments", {
                params: {id: id, mail: user.email, userName: user.nickname, userText: commentToAdd}
            }).then(response => console.log(response));

            commentInput.current.value = '';
            setCommentToAdd('');

            axios.get("http://localhost:4000/api/users/" + user.email, { params: { id: user.email }}).then(response => setCommentsList(response.data.comments));

        }

    };

    return (
        <div>
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
                <Input inputRef={commentInput} placeholder="Your Impressions" className={classes.inputForComment} onChange={handleInputChange} />
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={likePost.bind(this, liked, postComId)}>
                    <FavoriteIcon color={`${like === 'true' ? "error" : "primary" }`} />
                </IconButton>
                <IconButton aria-label="add-comment"  onClick={addComment.bind(this, postComId)} >
                    <AddCommentRoundedIcon/>
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
            <Collapse in={expanded} timeout="auto" unmountOnExit >
                <CardContent>

                    {commentsList && commentsList.map( ( item, i ) => renderComment(item.author, item.text, i) )}

                </CardContent>
            </Collapse>
        </Card>
        </div>
    );
}
