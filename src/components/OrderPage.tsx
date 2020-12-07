import ItemsInput from 'components/ItemsInput';
import { Item } from 'reducers/main';
import { Items } from 'components/Items'
import Button from 'components/Button';
import { Link } from 'react-router-dom';
import {ChangeEvent, useState} from 'react'


type OrderPageProps ={
    createItem : (item:Item) => void
    deleteItem : (item:Item) => void
    upItemsUnit : (item:Item) => void
    downItemsUnit : (item:Item)=>void
    changeItemsQuantity :(item:Item)=>void
    clickOrderButton : ()=>void;
    setHopePrice : (str :string)=>void;
    setisLogin : (bool : boolean)=>void;
    isLogin : boolean;
    hopePrice: string
    itemList : Item[];
}

export default function OrderPage({
    createItem ,
    deleteItem,
    upItemsUnit,
    downItemsUnit,
    changeItemsQuantity,
    clickOrderButton,
    setHopePrice,
    setisLogin,
    isLogin,
    hopePrice,
    itemList} : OrderPageProps) {
    const [inputValue , setInputValue] = useState("")
    const changeHopePrice = (e:ChangeEvent<HTMLInputElement>)=>{
        if(typeof Number(e.target.value)==="number"){
            const comma=(str:string)=>{
                return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
              }
              
              // 콤마 풀기
            const uncomma=(str:string)=> {
                return str.replace(/[^\d]+/g, '');
              }
            setInputValue(comma(uncomma(e.target.value)))
            setHopePrice(uncomma(e.target.value))
        }else{
            alert("숫자를 입력해주세요!")
        }
      }
    const orderBtnAtLogState = ()=>{
        if(itemList.length ===0){
            return <button className="order-btn"onClick={()=>{alert("품목을 추가해주세요")}}>주문하기</button>
        }else{
            if(isLogin){
                return <Link to="/order">
                            <button className="order-btn" onClick={clickOrderButton}>주문하기</button>
                        </Link>
            }else{
                return <Link to="/order/unsignin">
                            <button className="order-btn" onClick={clickOrderButton}>주문하기</button>
                        </Link>
            }
        }
        
    }
    return (
        <div>
            <ItemsInput OrderCreateItem={createItem} />
            {itemList.map((item:Item)=><Items item ={item} deleteItem={deleteItem} upItemsUnit={upItemsUnit} downItemsUnit={downItemsUnit} changeItemsQuantity={changeItemsQuantity}/> )}
            <div className="order">
                희망가격 : 
                <input type="tel" value={inputValue} onChange={changeHopePrice} />
                {orderBtnAtLogState()}
            </div>
        </div>
    )
    
}