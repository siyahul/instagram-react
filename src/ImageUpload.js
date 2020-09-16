import React,{useState} from 'react'
import { Button } from '@material-ui/core'
import {storage,db} from './firebase.js'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({username}) {
    const [caption,setCaption] = useState("");
    const [image,setImage] = useState(null);
    //const [url,setUrl]=useState('');
    const [progress,setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if(image){
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round((snapshot.bytesTransferred /snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error) =>{
                console.log(error);
                alert(error.message);
            },
            ()=>{
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url =>{
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        postURL: url,
                        username: username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );
        }
        else{
            alert("No image selected");
        }
    };

    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100" />
            <input type="text" placeholder="whats on your mind..." onChange={event=>setCaption(event.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button disabled={!image} onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload