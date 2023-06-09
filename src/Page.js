import Comment from "./Components/Comment";
import { useState, useEffect } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import Fire from "./Components/Fire"; // Firestore 객체 가져오기
import "./css/Page.css";


function Page( {foodType, setSelectPage, post, loginState} ) {

  let commentSplit = post.comment.split("🁽🁮");
  let contentSplit = post.content.split("ㅤ");
  let picAddSplit = post.picAdd.split("ㅤ");
  let arr = picAddSplit.map(x => picAddSplit.indexOf(x));


  let parseData = [];
  if (post.comment !== "") {
    parseData = commentSplit.map((cs) => JSON.parse(cs));  // object를 문자열로 바꾼 형태의 문자열을 다시 object 형태로 만들고 분해해서 parseData에 저장 
  }

  const { data, db, setData } = Fire("Post");
  const [ newComment, setNewComment ] = useState("");

  const deletePost = async (event) => {
    event.preventDefault();
    await deleteDoc(doc(db, "Post", post.id));
    setSelectPage("Home");
  }

  function draw(x) {
    return (
      <div>
        <img className="writing_picture" src={picAddSplit[x]} />
        <p className="page_content">{contentSplit[x+1]}</p>
      </div>
    );
  }

  async function handleAddComment() {  // 외부데이터는 다 async 
    const now = new Date();
    let dummy = {
      id : now.getTime().toString(),
      nickname : loginState.nickname,
      user_id : loginState.id,
      content : newComment,
      date : now.toISOString(),
      reComment : []
    }
    
    parseData.push(dummy);
    let stringifyData = parseData.map((x)=>JSON.stringify(x)).join("🁽🁮");  // object를 문자열로 변환 (firebase에 저장하기 위해서)
    const updateData = {
      comment: stringifyData
    };
    const docRef = doc(db, 'Post', post.id);
    await updateDoc(docRef, updateData);
    post.comment = stringifyData;
    setData(post);
    setNewComment("");
  }


  async function likeUnlike() {
    let newLike = "";

    if (post.like == "") {  // ㄹㅇ 아이디가 존재하지 않을 때 
        newLike = "☯"+ loginState.id;
    } else {
        if (post.like.includes(loginState.id)) {  // 내 아이디가 존재할 때 
          let likeSubID = post.like.split("☯").filter((x) => x != loginState.id);
          likeSubID = likeSubID.filter(x=> x!=="");
          newLike = likeSubID.join("☯");
          newLike = "☯" + newLike;
        } else {  // 내 아이디가 없을 때 
          newLike = post.like + "☯"+ loginState.id;
        }
    }
    if (newLike === "☯") newLike="";
    const updateData = {
      like: newLike
    };

    const docRef = doc(db, 'Post', post.id);
    await updateDoc(docRef, updateData);
    post.like = newLike;
    setData(post);
  }


  return (
    <div className="allPage">
      <h2 className="page_title">글 제목 : {post.title}</h2>
      <span className="mini_info">날짜 : {post.date}</span>
      <span className="mini_info">작성자 : {post.nickname}</span>
      <span className="mini_info">조회수 : {post.view}</span>
      <span className="mini_info">추천 : {post.like.split("☯").length-1}</span>
      <div>
        <p className="page_content">{contentSplit[0]}</p>
        {arr.map(x=>draw(x))}
      </div>
      <div className="btns">
        {loginState == false ? <></> : 
          <button className="likeBtn" onClick={likeUnlike}>🩵<text>{post.like.split("☯").length-1}</text></button>
        }
        {(post.user_id === loginState.id) ? 
        <button className="deletePostBtn" onClick={deletePost}>삭제 버튼</button> :
        (loginState.isAdmin) ? <button className="deletePostBtn" onClick={deletePost}>삭제 버튼</button> : <></> }
      </div>
      <div className="comment">
        {loginState == false ? <></> : 
          <div>
            <input type="text" onChange={(event) => setNewComment(event.target.value)} value={newComment} />
            <button onClick={() => {handleAddComment()}}>입력</button>
          </div>}
        {parseData.map((cmt) => <Comment cmt={cmt} post={post} loginState={loginState} parseData={parseData} />)}
      </div>
    </div>
  );
}

export default Page;