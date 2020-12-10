import React, {useState, useEffect, useCallback, ChangeEvent} from 'react';
import {serverPath} from 'modules/serverPath';
import { History } from 'history';
import {Link} from 'react-router-dom';
import InputBirth from 'components/InputBirth';
import { Header } from 'components/Header'
import Button from 'components/Button';

type propsTypes = {
  history : History
}

type InputTypes = {
  mobile:string;
  address:string;
  brand:string;
  yearList: number[];
  monthList: number[];
  dayList: number[];
  year: string;
  month:string;
  day:string;
  verifyNumber:string;
}

export default function UnSigninOrder
(props: propsTypes) {

  const [inputs, setInputs] = useState<InputTypes>({
    mobile:"",
    verifyNumber:"",
    address:"",
    brand:"",
    yearList:[],
    monthList:[],
    dayList:[],
    year:"1980",
    month:"1",
    day:"1",
  });


  const [isLogin,setIsLogin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [certErrorMsg, setCertErrorMsg] = useState('');
  const [isRenderCertInput, setIsRenderCertInput] = useState(false);


  useEffect(() => {
    //장바구니 임시저장 불러오기
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

    let [yearList, monthList, dayList] = generateBirth();
    setInputs((inputs)=>({
      ...inputs,
      yearList,
      monthList,
      dayList
    }))
  }, []);

  const generateBirth = function(){
    let yearList = [];
    let monthList = [];
    let dayList = [];
    for(let i=1940; i<2002; i++){
      yearList.push(i);
    }
    for(let i=1; i<=12; i++){
      monthList.push(i);
    }
    for(let i=1; i<=31; i++){
      dayList.push(i);
    }
    return [yearList, monthList, dayList];
  }

  const onChangeSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrorMsg('');
    setInputs((inputs) => ({
      ...inputs,
      [name]: value
    }));
  },[]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((inputs) => ({
      ...inputs,
      [name]: value
    }));
  },[])

  const onDispatchUnSignOrder = useCallback(()=>{
    let {mobile, brand, address, year, month, day} = inputs;
    if(mobile === "" || brand === "" || address === ""){
      setErrorMsg('모든 항목을 입력해주세요');
      return;
    }

    fetch(serverPath + '/unknown/info', {
      method: 'POST',
      mode: 'cors', 
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        mobile: inputs.mobile,
        address: inputs.address,
        brand : inputs.brand,
        birth:`${year.slice(2)}-${Number(month)<10?'0'+month:month}-${Number(day)<10?'0'+day:day}`  
      })
    }).then((res)=>{
      if(res.status===200){
        props.history.push('/order');
      }
    })
    .catch((e:Error)=>{
      console.log(e);
    })

  },[inputs, props.history]);

  const isCelluar = (asValue:string)=>{
    var regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
  }


  const handleSubmitMobile = useCallback(()=>{

    fetch(serverPath + '/user/mobile', {
      method: 'POST',
      mode: 'cors', 
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        mobile: inputs.mobile  
      })
    }).then((res)=>{
      if(res.status===200){
        setIsRenderCertInput(true);
      }else{
        setCertErrorMsg('인증번호 발송이 완료되지 않았습니다. 다시 시도해주세요.')
      }
    })
    .catch((e:Error)=>{
      setCertErrorMsg('인증번호 발송이 완료되지 않았습니다. 다시 시도해주세요.')
    })
    
  },[])

  return (
    <div id="wrap" className="UnSignInOrder-wrap">
      <div className="mb-view verCenter">
        <Header isLogin={isLogin} setIsLogin={setIsLogin}/>
        <div className="content_inner">
          <h2>비회원 로그인</h2>
          <h3>휴대폰인증</h3>
          <div className="inputWrap">
            <div className="flex">
              <input type="text" placeholder="ex) 010-0000-0000" value={inputs.mobile} onChange={onChange} name="mobile"/> 
              <div>
                <button className="btn st2" onClick={handleSubmitMobile}>인증번호 발송</button>
              </div>
            </div>
            { 
              isRenderCertInput && 
              <div className="flex">
                <input type="text" placeholder="인증번호" value={inputs.verifyNumber} onChange={onChange} name="verifyNumber"/> 
                <div>
                  <button className="btn st2">인증번호 확인</button>
                </div>
              </div>
            }

            {
              certErrorMsg &&
              <div className="warning_text">{certErrorMsg}</div>
            }
            <h3>생년월일</h3>
            <InputBirth onChangeSelect={onChangeSelect} yearList={inputs.yearList} monthList={inputs.monthList} dayList={inputs.dayList} year={inputs.year} month={inputs.month} day={inputs.day}/>
            <input type="text" placeholder="주소" value={inputs.address} onChange={onChange} name="address"/>
            <input type="text" placeholder="상호명" value={inputs.brand} onChange={onChange} name="brand"/>
          </div>
          {
            errorMsg &&
            <div className="warning_text">{errorMsg}</div>
          }
          <div onClick={onDispatchUnSignOrder}>
            <Button>비회원으로 주문하기</Button>
          </div>
          <div className="warning_text orange">비회원 주문 시 구매 내역 정보가 저장되지 않습니다</div>

          <div className="BtnList">
            <Link to="/order">
              <Button color="#F87946" bgColor="white" borderColor="#D6D6D6">
                <div>
                  로그인
                  <img src="/assets/button_arrow.png" alt="이동"/>
                </div>
              </Button>
            </Link>
            <Link to="/order">
              <Button color="#F87946" bgColor="white" borderColor="#D6D6D6">
                <div>
                  회원가입
                  <img src="/assets/button_arrow.png" alt="이동"/>
                </div>
              </Button>
            </Link>
            <div>
              <Button color="#3B1D1D" bgColor="#FFEB00">카카오톡으로 로그인</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
