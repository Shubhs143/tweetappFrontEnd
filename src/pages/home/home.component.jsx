import React, { useRef } from 'react';
import "./home.styles.css";
import imgProfileEmpty1 from '../../assets/images/profile-1.jpeg';
import imgProfileEmpty from '../../assets/images/profile.jpeg';
import imgLikeWhite from '../../assets/images/like-white.png';
import imgLikeBlue from '../../assets/images/like-blue.png';
import imgLikered from '../../assets/images/like-red.png';
import imgReply from '../../assets/images/reply.png';
import { fetchAllTweets, postTweet, postReplyTweet, likeTweet } from './home.helper';


export default function Home(props) {
    React.useEffect(() => {
        initialise();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.global.selectedPage]);
    const [tweetMessage, setTweetMessage] = React.useState("")
    const [allTweets, setAllTweets] = React.useState([])
    const onTweetClick = async () => {
        try {
            props.showLoader("Posting Tweet")
            await postTweet(props.global.userData.loginId, tweetMessage);
            setTweetMessage("")
            let allTweets = await fetchAllTweets();
            setAllTweets(allTweets);
            props.hideLoader();
        } catch (e) {
            props.hideLoader();
        }
    }

    const initialise = async () => {
        try {
            props.showLoader("Fetching All Tweets")
            let allTweets = await fetchAllTweets();
            setAllTweets(allTweets);
            props.hideLoader();
        } catch (e) {
            props.hideLoader();
        }
    }
    const generateTweets = () => {
        return allTweets.map((tweet, index) => {
            let imgSrcIndex = index % 5;
            let imgSrc = imgProfileEmpty1;
            switch (imgSrcIndex) {
                case 1: imgSrc = imgProfileEmpty;
                    break;
               

            }
            const date1 = new Date();
            const date2 = new Date(tweet.dateOfPost + " " + tweet.timeOfPost);
            const diffTime = Math.abs(date2 - date1);
            let diffDays = Math.ceil(diffTime / (1000 * 60));
            let units = "mins"
            if (diffDays > 60) {
                diffDays = (diffDays / 60).toFixed();
                units = "hours"
                if (diffDays > 24) {
                    diffDays = (diffDays / 24).toFixed();
                    units = diffDays > 1 ? "days" : "day"
                }
            }
            let userTweetId = tweet.userTweetId;
            let tweetId = tweet.tweetId
            const onLikeClick = () => {
                try {
                    let tweets = [...allTweets]
                    tweets[index].like = tweets[index].isLiked ? parseInt(tweets[index].like) - 1 : parseInt(tweets[index].like) + 1;
                    if (!tweets[index].isLiked) {
                        likeTweet({
                            tweet: {
                                tweetId: tweetId
                            }
                        })
                    }
                    allTweets[index].isLiked = !allTweets[index].isLiked;
                    setAllTweets(tweets);
                } catch (e) {
                    console.log(e)
                }

            }
            const onReplyClick = () => {
                let tweets = [...allTweets]
                tweets[index].showReplies = !tweets[index].showReplies;
                setAllTweets(tweets);
            }
            let replyMessage = ""
            const onChangeText = (e) => {
                replyMessage = e.target.value
            }

            const onReplyTweet = async () => {
                try {
                    props.showLoader("Posting Reply Tweet")
                    await postReplyTweet({
                        tweet: {
                            "userTweetId": userTweetId,
                            "tweetId": tweetId,
                            "reply": [
                                {
                                    "userId": props.global.userData.loginId,
                                    "replied": replyMessage
                                }
                            ]
                        }

                    });
                    let allTweets = await fetchAllTweets();
                    setAllTweets(allTweets);
                    props.hideLoader();
                } catch (e) {
                    props.hideLoader();
                }
            }
            return (
                <div  className="shadow" style={{ width: "60%", marginLeft: "auto", marginRight: "auto", alignItems: "flex-start", display: "flex", flexDirection: "column", borderRadius: 10, marginBottom: 10 }}>
                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 20, borderRadius: 10, borderWidth: 1 }}>
                        <img src={imgSrc} className="rounded-circle" height={40} width={40} style={{ marginRight: 20 }} />
                        <div style={{ width: "100%", justifyContent: "flex-start", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <p style={{ fontFamily: "Barlow-SemiBold", fontSize: 16, margin: 0 }}>{tweet.userTweetId} <span style={{ color: "GrayText", fontFamily: "OpenSans-Regular", fontSize: 12 }}>{diffDays} {units} ago</span></p>
                            <p style={{ borderWidth: 0, fontFamily: "OpenSans-Regular", fontSize: 16, textAlign: "justify" }}>{tweet.tweet}</p>
                        </div>

                    </div>
                    <div style={{ display: "inline-flex", marginLeft: 20 }}>
                        <img className={"ml-2"} src={tweet.isLiked ? imgLikered : imgLikeWhite} height={30} width={30} onClick={onLikeClick} />
                        <p className={"ml-2 mt-1"}>{tweet.like}</p>
                        <img className={"ml-4"} src={imgReply} height={30} width={30} onClick={onReplyClick} />
                        <p className={"ml-2 mt-1"}>{tweet.reply.length}</p>
                    </div>
                    <div style={{ width: "100%" }}>
                        {
                            tweet.showReplies &&
                            <>
                                <div>
                                    {
                                        tweet.reply.map((reply, rIndex) => {

                                            let imgSrcIndex = rIndex % 5;
                                            let imgSrc = imgProfileEmpty1;
                                            switch (imgSrcIndex) {
                                                case 1: imgSrc = imgProfileEmpty;
                                                    break;
                                               

                                            }

                                            const replydate1 = new Date();
                                            const replydate2 = new Date(reply.dateReplied);
                                            const replydiffTime = Math.abs(replydate2 - replydate1);
                                            let replydiffDays = Math.ceil(replydiffTime / (1000 * 60));
                                            let units = "mins"
                                            if (replydiffDays > 60) {
                                                replydiffDays = (replydiffDays / 60).toFixed();
                                                units = "hours"
                                                if (replydiffDays > 24) {
                                                    replydiffDays = (replydiffDays / 24).toFixed();
                                                    units = "days"
                                                }
                                            }
                                            return (
                                                <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 10, borderRadius: 10, borderWidth: 1, marginLeft: 30 }}>
                                                    <img src={imgSrc} className="rounded-circle" height={30} width={30} style={{ marginRight: 20 }} />
                                                    <div style={{ width: "100%", justifyContent: "flex-start", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <p style={{ fontFamily: "Barlow-SemiBold", fontSize: 16, margin: 0 }}>{reply.userId} <span style={{ color: "GrayText", fontFamily: "OpenSans-Regular", fontSize: 12 }}>{replydiffDays} {units} ago</span></p>
                                                        <p style={{ borderWidth: 0, }}>{reply.replied}</p>
                                                    </div>

                                                </div>
                                            )
                                        })}
                                </div>
                                <div  className="shadow" style={{ alignItems: "flex-start", display: "flex", flexDirection: "column", borderRadius: 10, margin: 30, marginTop: 0,backgroundImage:'url("https://htmlcolorcodes.com/assets/images/colors/baby-blue-color-solid-background-1920x1080.png")', 
                    backgroundRepeat:'no-repeat', backgroundSize:'cover' }}>
                                    <p style={{ marginLeft: 20, marginTop: 20, fontSize: 12, fontFamily: "OpenSans-Regular" }}>You are replying to <span style={{ color: "#1DA1F2" }}>{tweet.userTweetId}</span> </p>
                                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", borderRadius: 10, borderWidth: 1, marginLeft: 30 }}>
                                        <img src={imgProfileEmpty1} className="rounded-circle" height={30} width={30} style={{ marginRight: 20 }} />
                                        <textarea placeholder={"Tweet your reply"} multiple={4} style={{ width: "80%", height: 50, borderWidth: 0, resize: "none", padding: 10, fontSize: 16 }} maxLength={144} onChange={onChangeText} />
                                    </div>
                                    <div style={{ display: "inline-flex", alignItems: "flex-end", justifyContent: "flex-end", width: "100%" }}>
                                        <button style={{ borderWidth: 0, marginTop: 10, backgroundColor: "#1DA1F2", color: "white", width: 100, padding: 10, borderRadius: 20, marginBottom: 20, marginRight: 30 }} onClick={onReplyTweet}>Tweet</button>
                                    </div>
                                </div>
                            </>
                        }

                    </div>

                </div >
            )
        })
    }
    return (
        <>
        
            <div   className={"h-100"}>
                <div   className="shadow" style={{ paddingTop:40,width: "60%", marginLeft: "auto", marginRight: "auto", alignItems: "flex-start", display: "inline-flex", flexDirection: "column", borderRadius: 10 ,backgroundImage:'url("https://htmlcolorcodes.com/assets/images/colors/baby-blue-color-solid-background-1920x1080.png")', 
                    backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>
                    <div>
                        <h2 style={{fontFamily: "Georgia",fontSize:20,paddingLeft:100,color:"gray",textShadow:" 0 0 0.5px black, 0 0 0.5px black"}}>New Tweet</h2>
                    </div>
                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 20, borderRadius: 10, borderWidth: 1 }}>
                        <img src={imgProfileEmpty1} className="rounded-circle" height={60} width={60} style={{ marginRight: 20 }} />
                        <textarea placeholder={"What's happening ?"} multiple={4} style={{ width: "80%", height: 50, borderWidth: 0, resize: "none", padding: 10 }} maxLength={144} value={tweetMessage} onChange={(e) => setTweetMessage(e.target.value)} />
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "flex-end", justifyContent: "flex-end", width: "100%" }}>
                        <button style={{ borderWidth: 0, backgroundColor: "#1DA1F2", color: "white", width: 100, padding: 10, borderRadius: 20, marginBottom: 20, marginRight: 30 }} onClick={onTweetClick}>Tweet</button>
                    </div>
                </div>
                <div>
                    {
                        generateTweets()
                    }
                </div>

            </div>
        </>
    )

}