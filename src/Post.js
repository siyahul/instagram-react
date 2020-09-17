import React,{useState,useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import {db} from './firebase.js'
import firebase from 'firebase'
function Post({imageURL,username,caption,postURL,postId,user}) {
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState([]);
    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db.collection('posts').doc(postId).collection('comments').orderBy("timestamp","desc").onSnapshot((snapshot) => {setComments(snapshot.docs.map(doc=> ({id:doc.id,data:doc.data()})));});
        }
    });

    const postComment = (event) => {
        event.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text:comment,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            username:user.displayName
        });
        setComment('')
    }

    const removeComment = (key) =>{
        db.collection('posts').doc(postId).collection('comments').doc(key).delete();
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar"
                alt={username}
                src={imageURL}
                />
                <h3>{username}</h3>
            </div>
            
            <img className="post__image" src={postURL} alt="" />
            <h4 className="post__text"><strong>{username}:</strong>{caption}</h4>

            <div className="post__comments">
                {comments.map((comments)=>(<p><strong>{comments.data.username}</strong>: {comments.data.text} <button onClick={()=>{removeComment(comments.id)}}>remove</button></p>))}
                
            </div>
            {user?(
            <form className="post__commentBox">
                <input className="post__input" type="text" placeholder="type your Comments..." value={comment} onChange={(e) =>setComment(e.target.value)} />
                <button disabled={!comment} className="post__button" onClick={postComment} >Post</button>
            </form>):(<div className="post__commentError"><h5>Login to add a comment</h5></div>)}
        </div>
    )
}

export default Post
