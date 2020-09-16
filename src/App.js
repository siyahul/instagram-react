import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase.js'
import {  makeStyles, Button, Input } from '@material-ui/core';
import Modal from '@material-ui/core/Modal'
import ImageUpload from './ImageUpload.js'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    width: `50%`,
    height:`${30}%`,
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [openSignIn,setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [user,setUser]=useState(null);


  useEffect(() => {auth.onAuthStateChanged((authUser) => {
    if(authUser){
      console.log(authUser);
      setUser(authUser);
    }
    else{
      setUser(null);
    }
  })
  },[user,username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()})));
    })
  },[]);
  const handleClose = () => {setOpen(false)}
  const signUp =(event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=> alert(error.message))
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=> alert(error.message))

    setOpenSignIn(false);
  }
  
  
  return (
    <div className="App">
      <Modal open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" width="100px" height="40px" />
            </center>
            <Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
            
          </form>
          
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={()=>setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" width="100px" height="40px" />
            </center>
            <Input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signIn}>Sign In</Button>
            
          </form>
          
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" width="100px" height="40px" />
        {user ? (<Button onClick={()=>auth.signOut()}>Log Out</Button>):
        <div className="app__loginContainer">
          <Button onClick={()=>setOpenSignIn(true)}>Log in</Button>/
          <Button onClick={()=>setOpen(true)}>Sign up</Button>
        </div>
        }
      </div>
      {user?.displayName ? (<ImageUpload  username={user.displayName}/>):(<h3 className="app__imageUploadError">Need login to add post</h3>)}
      <div className="app__posts">
        <div className="app__posts__left">
          {
            posts.map(({id,post}) =>(
              <Post key={id} user={user} postId={id} username={post.username} imageURL={post.imageURL} postURL={post.postURL} caption={post.caption}/>
            ))
          }
        </div>
      </div>
      
    </div>
  );
}
export default App;