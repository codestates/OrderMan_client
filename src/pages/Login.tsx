import React, {useState, useEffect, useCallback, ChangeEvent} from 'react';
import { History } from 'history';
import {Link} from 'react-router-dom';
import {serverPath} from 'modules/serverPath';
import axios from 'axios';
import Button from 'components/Button';
import {Header} from 'components/Header';

type propsTypes = {
  history : History
}
// declare global {
//   interface Window {
//     Kakao: any;
//   }
// }
// window.Kakao = window.Kakao || "SomeValue";
// const {Kakao} = window;

function Login(props : propsTypes) {
  
  const [inputs, setInputs] = useState({
    id: '',
    password: ''
  });

  //error Message
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // console.log(isLogin(props.cookies));
    // if(isLogin(props.cookies)){
    //   props.history.push('/');
    // }
  }, [])

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((inputs) => ({
      ...inputs,
      [name]: value
    }));
  },[])

  const onSubmitLogin = useCallback(()=>{
    
    console.log('onSubmitLogin 전송..')
    if(inputs.id === "" || inputs.password === ""){
      return;
    }

    //로딩창 setLoading true;
    axios.post(serverPath + '/user/login',{
      userId:inputs.id,
      password:inputs.password
    },{ withCredentials: true }).then(res=>{
      //로그인성공
      //로그인 성공하면, 메인으로 리다이렉트
      props.history.push('/');
    }).catch(e=>{
      //로그인실패
      console.log('로그인 실패', e)
      if(e.respond && e.respond.status === 204){
        setErrorMsg('등록되지 않은 아이디이거나 비밀번호가 맞지 않습니다');
      }else{
        setErrorMsg('로그인에 실패했습니다');
      }
    })
  },[inputs, props.history]);

  // const onKakaoLoginHandler = function(){
  //   Kakao.Auth.authorize({
  //     redirectUri: clientPath+'/signup/social'
  //   });
  // }

  return (
    <div id="wrap" className="Login-wrap">
      <div className="mb-view verCenter">
        <Header/>
        <h2>로그인</h2>
        <div className="inputWrap">
          <input type="text" placeholder="아이디" value={inputs.id} onChange={onChange} name="id"/>
          <input type="password" placeholder="비밀번호" value={inputs.password} onChange={onChange} name="password"/>
        </div>
        {
          errorMsg && 
          <div className="warning_text">{errorMsg}</div>
        }
        <div onClick={onSubmitLogin}>
          <Button>로그인</Button>
        </div> 
        {/* <div className="socialBtnList">
          <div onClick={onKakaoLoginHandler}>
            <Button color="#3B1D1D" bgColor="#FFEB00">카카오톡으로 로그인</Button>
          </div>
        </div> */}
        <Link to="/signup">
          <Button>회원가입</Button>
        </Link>
        
      </div>
    </div>
  )
}


export default Login;