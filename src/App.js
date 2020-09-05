import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db} from './firebase.js'

function App() {
  const [posts,setPosts] = useState([]);
  
  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()})));
    })
  },[]);
  
  return (
    <div className="App">
      <div className="app__header">
        <img className="app__headerImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" width="100px" height="40px" />
      </div>
      <h1>Instagram</h1>
      {
        posts.map(({id,post}) =>(
          <Post key={id} username={post.username} imageURL={post.imageURL} postURL={post.postURL} caption={post.caption}/>
        ))
      }
    </div>
  );
}

export default App;
