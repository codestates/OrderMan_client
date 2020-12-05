import ItemsInput from 'components/ItemsInput';
import { Item } from 'reducers/main';
import { Items } from 'components/Items'
import Button from 'components/Button';
import { Link } from 'react-router-dom';
import {ChangeEvent} from 'react'


type OrderPageProps ={
    createItem : (item:Item) => void
    deleteItem : (item:Item) => void
    upItemsUnit : (item:Item) => void
    downItemsUnit : (item:Item)=>void
    changeItemsQuantity :(item:Item)=>void
    clickOrderButton : ()=>void;
    setHopePrice : (num : number)=>void;
    setisLogin : (bool : boolean)=>void;
    isLogin : boolean;
    hopePrice: number
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
    const changeHopePrice = (e:ChangeEvent<HTMLInputElement>)=>{
        console.log(typeof Number(e.target.value))
        if(typeof Number(e.target.value)==="number"){
            setHopePrice(Number(e.target.value))
        }
      }
    const orderBtnAtLogState = ()=>{
        if(isLogin){
            return<Link to="/order">
                        <button className="order-btn" onClick={clickOrderButton}>주문하기</button>
                    </Link>
        }else{
            return<Link to="/order/unsignin">
                        <button className="order-btn" onClick={clickOrderButton}>주문하기</button>
                    </Link>
        }
    }
    return (
        <div>
            <ItemsInput OrderCreateItem={createItem} />
            {itemList.map((item:Item)=><Items item ={item} deleteItem={deleteItem} upItemsUnit={upItemsUnit} downItemsUnit={downItemsUnit} changeItemsQuantity={changeItemsQuantity}/> )}
            <div className="order">
                예상금액 : 
                <input type="number" value={hopePrice} onChange={changeHopePrice} />
                {orderBtnAtLogState()}
            </div>
        </div>
    )
    
}