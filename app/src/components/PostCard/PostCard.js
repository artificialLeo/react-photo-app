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
import CloseSharp from '@material-ui/icons/CloseSharp';
import AddCommentRoundedIcon from '@material-ui/icons/AddCommentRounded';
import { Input } from '@material-ui/core';

import { useAuth0 } from "@auth0/auth0-react";
import {selectPostData} from "../../store/actions";
import {connect} from "react-redux";
import {deletePost} from "../../store/reducers";
import axios from "axios";


const useStyles = makeStyles((theme) => ({
    root: {
        margin: '10px',
        // width: '350px',
        minWidth: '200px'

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
        marginTop: '10px',
        width: '82.5%',
    },
    commentsBlock: {
        display: 'flex',
        flexDirection: 'column-reverse',
        marginBottom: '50px'
    },
    addComment: {
        position: 'relative',
        top: '8px',
        left: '15px'
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },

}));

export default function PostCard({deletePost, postData, comments, photo, description, liked, postComId, removeCard}) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const commentInput = useRef(null);

    const { user } = useAuth0();

    const [like, setLike] = useState(liked.includes(user.email).toString());
    let [numberOfLikes, setNumberOfLikes] = useState(liked.length);
    const [commentToAdd, setCommentToAdd] = useState('');
    const [commentsList, setCommentsList] = useState(comments);

    // useEffect(() => {
    //      let likeFlag = liked[0].length;
    //
    //     console.log(liked[0])
    //     console.log(liked)
    //     console.log(likeFlag)
    // }, [liked, user.email]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleInputChange = (e) => {
        setCommentToAdd(e.target.value)
    };



    const likePost = (likeValue, id) => {
        console.log(likeValue)

        if (likeValue === 'false') {
            setLike('true');
            setNumberOfLikes(++numberOfLikes);
            axios.post("http://localhost:4000/api/like", { params: { id: id, mail: user.email, liked: 'false', user: user.email }});
        } else {
            setLike('false');
            setNumberOfLikes(--numberOfLikes);
            axios.put("http://localhost:4000/api/removelike", { params: { id: id, mail: user.email, liked: 'true', user: user.email }})
                .then( r => console.log(r) );
        }
    };

    const addComment = (id) => {

        if (commentToAdd.length !== 0) {
            axios.post("http://localhost:4000/api/comments", {
                params: {id: id, mail: user.email, userName: user.nickname, userText: commentToAdd}
            }).then( response => {
                commentInput.current.value = '';
                setCommentToAdd('');

            axios.put("http://localhost:4000/api/newcomment/", { params: { mail: user.email, id: id }})
                .then(response => {
                    let temp = response.data.posts.find(item => item.postComId === id).comments;

                    setCommentsList(temp)
                });
            });
        }

    };


    const renderComment = (author, text, i) => {
        return (
            <div key={i}>
                <Typography variant="h6">{author}</Typography>
                <Typography paragraph>{text}</Typography>
            </div>
        );
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
                        <CloseSharp color="error"  />
                    </IconButton>
                }/>
            <CardMedia
                className={classes.media}
                image={photo || 'img'}
                alt="Post Photo"
                title="Post"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {`${description + '|' + postComId}`}
                </Typography>
                <Input inputRef={commentInput} value={commentToAdd} placeholder="Your Impressions" className={classes.inputForComment} onChange={handleInputChange} />
                <IconButton aria-label="add-comment" className={classes.addComment}  onClick={addComment.bind(this, postComId)} >
                    <AddCommentRoundedIcon/>
                </IconButton>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={likePost.bind(this, like, postComId)}>
                    <FavoriteIcon color={`${like === 'true' ? "error" : "primary" }`} />
                </IconButton>

                <Typography variant="h6" color="initial" component="span">
                    {numberOfLikes}
                </Typography>

                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more">
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit >
                <CardContent className={classes.commentsBlock} >

                    {commentsList && commentsList.map( ( item, i ) => renderComment(item.author, item.text, i) )}

                </CardContent>
            </Collapse>
        </Card>
        </div>
    );
}
