import React, { useState } from 'react';
import "../css/Aside.css";
import Fire from './Fire';
import Modal from './Modal';

function LoginAside({ setLoginState, setSelectPage }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { data, db } = Fire('User');

  const handleLogin = (event) => {
    event.preventDefault();
    try {
      const userData = data.find((user) => user.userID === id && user.password === password);
      
      if (userData == undefined) {
        alert("아이디와 비번 확인");
      } else {
        setLoginState(userData);
      }
      
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  }

  const handleSignUp = (event) => {
    event.preventDefault();
    setSelectPage("SignUp");
  }

  return (
    <aside>
      <h2 className='loginInfo'>로그인</h2>
      <form>
        <label className='userInfo'>
          아이디
          <input type="text" name="username" placeholder='ID' value={id} onChange={(event) => setId(event.target.value)} />
        </label>
        <br />
        <label className='userInfo'>
          비밀번호
          <input type="password" name="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <br />
        <button className='login_btn' onClick={handleLogin}>로그인</button>
        <button className='signUp_btn' onClick={handleSignUp}>회원가입</button>
      </form>
    </aside>
  );
}


function UserAside( {loginState, setLoginState, setSelectPage} ) {
  const handleLogOut = (event) => {
    event.preventDefault();
    setLoginState(false);
    setSelectPage('Home');
  }

  const handleMyPage = (event) => {
    event.preventDefault();
    setSelectPage('MyPage');
  }

  const [isOpen, setIsOpen] = useState(false);  // Modal 창 열고 닫기 

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  }

  const handleCloseModal = () => {
    setIsOpen(false);
  }


  return (
    <aside>
      <h2 className='loginInfo'>유저 정보</h2>
      <ul>
        <img className='profile_img' src={loginState.picture} /><br/>
        <li className='userInfo'>아이디: {loginState.userID}</li> <br/>
        <li className='userInfo'>닉네임: {loginState.nickname}</li> <br/>
        <li className='userInfo'>상세메시지: {loginState.status}</li>
      </ul>
      <button className='logout_btn' onClick={handleLogOut}>로그아웃</button>
      <button className='mypage_btn' onClick={handleMyPage}>마이페이지</button>
      {(loginState.isAdmin) && <button className='forbidden_btn' onClick={handleOpenModal}>관리자 모드</button> }
      {isOpen && <Modal handleCloseModal = {handleCloseModal} />}
    </aside>  
  );
}

function Aside({loginState, setLoginState, setSelectPage}) {
  return (
    <>
      {loginState == false ? (
        <LoginAside setLoginState={setLoginState} setSelectPage={setSelectPage} />
      ) : (
        <UserAside loginState={loginState} setLoginState={setLoginState} setSelectPage={setSelectPage} />
      )}
    </>
  );
}

export default Aside;