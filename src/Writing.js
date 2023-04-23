import { useState } from "react";
import "./css/Writing.css";
import Fire from "./Components/Fire";
import { doc, setDoc } from 'firebase/firestore';

function Writing( {foodType, setSelectPage, loginState} ) {
    const { data, db } = Fire("Post");

    const [title, setTitle] = useState("");  // 제목 
    const [type, setType] = useState("");  // 음식 타입 - 한식 중식 머시기
    const [content, setContent] = useState("");  // 글쓰는 부분 

    const handleWritingSubmit = async (e) => {
      e.preventDefault();
      const now = new Date();
      const view = 0;
      const like = 0;
      const nickname = loginState.nickname; 
      const id = now.getTime().toString(); 
      const date = now.toISOString();
      const picture = loginState.picture;

      if (type === "") {
        alert("음식 종류를 선택하지 않았습니다.");
      } else {
        try {
          await setDoc(doc(db, 'Post', id), { id, title, content, like, type, view, nickname, date, picture });
            setSelectPage(type);
        } catch (error) {
          console.log("아이디" + loginState.nicknames);
          console.error(error);
          alert("올리기 실패 : " + error);
        }
      }
    }

    const handleAddPic = () => {
      // 나머지 코드
      alert("더ㅜㅐㅣㅑ");
    }

    return (
      <div className="Writing">
        <form onSubmit={handleWritingSubmit}>
          <label className="title">
            제목
            <input type="text" className="writing_title" placeholder='제목' onChange={(e) => setTitle(e.target.value)} />
          </label>
          <br />
            <select name="select_food" onChange={(e) => setType(e.target.value)}>
              <option value="">음식 선택</option>
              <option value="Korean">한식</option>
              <option value="Western">양식</option>
              <option value="Chinese">중식</option>
              <option value="Japan">일식</option>
              <option value="Dessert">디저트</option>
            </select>

            <input type="file" accept="image/*" onInput={() => {handleAddPic();}}/>
            <div className="previewImg"></div>
            <div className="writing_box">
              <textarea className="writing_textarea" placeholder="Input some text." onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
            <button type="submit" className="ok_btn">OK</button>
          <br />
        </form>
      </div>
    );
  }

  
  export default Writing;
  