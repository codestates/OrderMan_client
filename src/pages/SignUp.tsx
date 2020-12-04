import React, {useState,useEffect, useCallback, ChangeEvent} from 'react';
import { History } from 'history';
import Button from 'components/Button';
import InputBirth from 'components/InputBirth';
import {fetchPost} from 'modules/fetchMethod';
type propsTypes = {
  history : History
}

type InputTypes = {
  id: string;
  password: string;
  passwordCheck:string;
  mobile:string;
  address:string;
  brand:string;
  yearList: number[];
  monthList: number[];
  dayList: number[];
  year: string;
  month:string;
  day:string;
}

export default function SignUp(props: propsTypes) {
  const [inputs, setInputs] = useState<InputTypes>({
    id: "",
    password: "",
    passwordCheck:"",
    mobile:"",
    address:"",
    brand:"",
    yearList:[],
    monthList:[],
    dayList:[],
    year:"1980",
    month:"1",
    day:"1"
  });

  //error Message
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    //mount
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

  

  const onSubmitSignUp = useCallback(()=>{
    console.log('onSubmitSignUp 회원가입 전송..');

    let {id, password, passwordCheck, mobile, brand, address, year, month, day} = inputs;
    if(password !== passwordCheck){
      setErrorMsg('비밀번호와 비밀번호 확인은 같아야 합니다');
      return;
    }else if(id === "" || password === "" || mobile === "" || brand === "" || address === ""){
      setErrorMsg('모든 항목을 입력해주세요');
      return;
    }

    fetchPost("/user/login",{
      userId:id, 
      password, 
      mobile, 
      brand, 
      address,
      //서버 반영 후, 적용
      // birth:`${year.slice(2)}-${month}-${day}`
    },(status, res)=>{
      if(status===200){
        alert('회원가입이 완료되었습니다');
        props.history.push('/login');
      }else if(status===204){
        setErrorMsg('이미 존재하는 사용자 입니다');
      }
    },(err)=>{
      setErrorMsg('회원가입이 정상적으로 이뤄지지 않았습니다');
    })

  },[inputs, props.history]);

  return (
    <div id="wrap" className="Signup-wrap">
      <div className="mb-view verCenter">
        <h2>회원가입</h2>
        <div className="inputWrap">
          <input type="text" placeholder="아이디" value={inputs.id} name="id" onChange={onChange}/>
          <input type="password" placeholder="비밀번호" value={inputs.password} name="password" onChange={onChange}/>
          <input type="password" placeholder="비밀번호 확인" value={inputs.passwordCheck} name="passwordCheck" onChange={onChange}/>
          <div className="flex">
            <input type="text" placeholder="핸드폰 인증" value={inputs.mobile} name="mobile" onChange={onChange}/>
            {/* <button className="btn st1">인증하기</button> */}
          </div>
          <h3>생년월일</h3>
          <InputBirth onChangeSelect={onChangeSelect} yearList={inputs.yearList} monthList={inputs.monthList} dayList={inputs.dayList} year={inputs.year} month={inputs.month} day={inputs.day}/>
          <input type="text" placeholder="주소" value={inputs.address} name="address" onChange={onChange}/>
          <input type="text" placeholder="상호명" value={inputs.brand} name="brand" onChange={onChange}/>
        </div>
        {
          errorMsg &&
          <div className="warning_text">{errorMsg}</div>
        }
        <div onClick={onSubmitSignUp}>
          <Button>가입하기</Button>
        </div>
      </div>
    </div>
  )
}
