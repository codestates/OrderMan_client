import React,{useEffect, useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {RootState} from "../reducers/index";
import {actionMainCreators as mainActions, Item, OderListInterface } from "../reducers/main";
import {actionOrderCreators as orderActions ,Market} from "../reducers/order"
import PastOrders from 'components/PastOrders'
import {Header}from 'components/Header'
import {Date} from 'components/Date'
import OrderPage from 'components/OrderPage';
import { withCookies, Cookies } from 'react-cookie';
import {isLogin} from 'modules/checkLogin';

type propsTypes = {
  cookies: Cookies
}

function Main(props:propsTypes) {
  const {orderList/*,isLoading,hasError*/} = useSelector((state:RootState)=> state.MainReducer);
  const {itemList} = useSelector((state:RootState)=> state.OrderReducer);
  const dates = Object.keys(orderList); dates.reverse()
  // Distpach 선언  
  const dispatch = useDispatch();
  useEffect(()=>{
    const orderList_ : OderListInterface = {
      "2020-11-10":[
        {item : "3", quantity: 4, unit : "1kg",},
        {item : "4", quantity: 39,unit : "1kg" }
    ],
      "2020-11-11":[
        {item : "1", quantity: 4, unit : "1kg",},
        {item : "2", quantity: 39,unit : "1kg" }
    ],
      "2020-11-12":[
        {item : "가지", quantity: 4, unit : "1kg",},
        {item : "김", quantity: 39,unit : "1kg" }
    ],
      "2020-11-14":[
        {item : "라면", quantity: 4, unit : "1kg",},
        {item : "김", quantity: 39,unit : "1kg" }
    ],
      "2020-11-17":[
        {item : "김치", quantity: 4, unit : "1kg",},
        {item : "소금", quantity: 39,unit : "1kg" }
    ],
      "2020-11-20":[
          {item : "가지", quantity: 4, unit : "1kg",},
          {item : "고구마", quantity: 39,unit : "1kg" }
      ],       
      "2020-11-23":[
          {item : "감자", quantity: 400,unit : "2kg", },
          {item : "밀가루",quantity: 39, unit : "1kg" }
      ]
    }
    const market_ : Market ={
        mobile : "01047589928"
    }
    dispatch(mainActions.startUser())
    try{
      dispatch(mainActions.loginUser(orderList_))
      dispatch(orderActions.orderLoginUser([] ,market_))
    }
    catch(err){
      dispatch(mainActions.errorGet())
    }
  },[])
  

  // useSate
  const [todayOrder,setTodayOrder] = useState(true)
  const [selectDate, setSelectDate] = useState("");

  // 컴포넌트들이 쓸 함수들 모음
  // const rendering =() =>{
  //   if(isLoading) return <p>Loading~~</p>
  //   if(hasError) return <p>has Error</p>
  // }
  const createItem=(item:Item)=>{
    dispatch(orderActions.orderCreateNowOrder(item));
  }
  
  const deleteItem=(item:Item)=>{
    dispatch(orderActions.orderDeleteNowOrder(item))
  }

  const upItemsUnit = (item:Item)=>{
    dispatch(orderActions.orderUnitUP(item))
  }
  const downItemsUnit = (item:Item)=>{
    dispatch(orderActions.orderUnitDown(item))
  }
  const changeItemsQuantity = (item:Item)=>{
    dispatch(orderActions.orderQuantityChange(item))
  }
  
  return (  
    <div id="wrap" className="Main-wrap">
      <div className="mb-view">
      <Header cookies={props.cookies}/>
      <Date 
        dates={dates} 
        nowdate={selectDate}
        setNowdate={setSelectDate} 
        todayOrder={todayOrder} 
        setTodayOrder={setTodayOrder}/>
      {(todayOrder) ? <OrderPage 
        createItem={createItem} 
        deleteItem={deleteItem}
        upItemsUnit={upItemsUnit}
        downItemsUnit={downItemsUnit}
        changeItemsQuantity={changeItemsQuantity}
        itemList={itemList}
      />:<PastOrders 
        orderItemList={itemList}
        itemList={(selectDate!=="")?orderList[selectDate]:[]}
        createItem={createItem}
      />}
      
      </div>
    </div>
  )
}


export default withCookies(Main);