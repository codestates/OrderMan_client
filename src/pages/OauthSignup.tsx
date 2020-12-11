import React, {useState, useCallback, useEffect, ChangeEvent} from 'react';
import { History, Location } from 'history';
import Button from 'components/Button';
import { Header } from 'components/Header';
import {serverPath, clientPath} from 'modules/serverPath';
import {KAKAO_REST_API_KEY} from 'modules/config'

type propsTypes = {
  history : History;
  location: Location;
}

export default function SignUpSocial(props: propsTypes) {
  const [isLogin,setIsLogin] = useState(false)
  const [inputs, setInputs] = useState({
    address:"",
    brand:"",
    mobile:""
  });
  const [isRender, setIsRender] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    fetch(serverPath+"/user/login",{
      method:"GET",
      mode:"cors",
      credentials:"include",
      headers:{
        "Content-Type":"application/json"
      }
    }).then(login=>{
      if(login.status===200){
        setIsLogin(true);
      }else if(login.status ===202){
        setIsLogin(false);
      }
    })
  }, [])

  

  window.Kakao = window.Kakao || "SomeValue";
  const {Kakao} = window;

  const code = props.location.search.split("=")[1];

  useEffect(() => {
    //토큰없으면 리다이렉트
    fetch('https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id='+KAKAO_REST_API_KEY+'&redirect_uri='+clientPath+'/signup/social&code='+code, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
    }).then(res=>{
      return res.json();
    }).then(data=>{
      console.log(data);
      var bearer = 'Bearer ' + data.access_token;
      fetch(serverPath+'/user/oauthup', {
        method: 'GET',
        mode: 'cors', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearer,
        }
      }).then(res=>{
        //기존 이용자라면 (상태코드 200)
        //사이트의토큰을 받고, 메인으로 처리
        //props.history.push('/');

        //처음소셜로그인이용자//기존 이용자라면 (상태코드 202)
        //가입화면 render
      }).catch(error=>{
        console.log(error);
      })
    }).catch(e=>{
      alert('카카오 로그인이 정상 작동하지 않습니다');
    });

  }, []);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((inputs) => ({
      ...inputs,
      [name]: value
    }));
  },[]);

  // const onSubmitSignUpSocial = useCallback(()=>{
  //   console.log('onSubmitSignUpSocial 소셜 회원가입 전송..');

  //   if(!code){
  //     return;
  //   }

  //   let {brand, address} = inputs;
  //   if(brand === "" || address === ""){
  //     setErrorMsg('모든 항목을 입력해주세요');
  //     return;
  //   }

  //   //POST 요청
  //   axios.post(serverPath + '/user/signup/social',{
  //     brand, 
  //     address
  //   },{ withCredentials: true }).then(res=>{
  //     //소셜 회원가입 성공
  //     //회원가입 성공하면, 로그인페이지로 리다이렉트
  //     props.history.push('/login');
  //   }).catch(e=>{
  //     //회원가입 실패
  //     console.log('회원가입 실패', e)

  //     //소셜 사용자 회원가입 반환값에 따른, 처리

  //     // if(e.respond && e.respond.status === 204){
  //     //   setErrorMsg('이미 존재하는 사용자 입니다');
  //     // }else{
  //     //   setErrorMsg('회원가입에 실패했습니다.');
  //     // }
        
  //   })
  // },[inputs, props.history, code]);

  // const onLogoutSocial = function(){
  //   // if (!Kakao.Auth.getAccessToken()) {
  //   //   console.log('Not logged in.');
  //   // }
  //   // Kakao.Auth.logout(function() {
  //   //   props.history.push('/');
  //   // });
  // }


  if(isRender){
    return (
        <div id="wrap">
          <div className="mb-view verCenter">
            <Header isLogin={isLogin} setIsLogin={setIsLogin}/>
            <div className="content_inner">
              <h2>회원가입(카카오톡)</h2>
              <div className="inputWrap">
                <input type="text" placeholder="핸드폰" value={inputs.mobile} name="mobile" onChange={onChange}/>
                <input type="text" placeholder="주소" value={inputs.address} name="address" onChange={onChange}/>
                <input type="text" placeholder="상호명" value={inputs.brand} name="brand" onChange={onChange}/>
              </div>
              {/* {
                errorMsg  &&
                <div className="warning_text">{errorMsg}</div>
              } */}
              <div>
                <Button>가입하기</Button>
              </div>
              <div style={{marginTop:'10px'}}>
                <Button>로그아웃</Button>
              </div>
            </div>
          </div>
        </div>
      )
  }else{
    return (
      <div id="wrap">
          <div className="mb-view verCenter">
            <Header isLogin={isLogin} setIsLogin={setIsLogin}/>
            <div className="content_inner">
            </div>
          </div>
        </div>
    )
  }
  
}
