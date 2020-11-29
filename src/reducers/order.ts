import { Item } from '../reducers/main';

//type
export type Market =  {
  name: string;
  mobile: string;
}

export type unSigninInfo =  {
  mobile: string;
  brand: string;
  address: string;
}

export type NowOrder = {
  itemList: Array<Item>;
  market: Market;
  unSignInfo:unSigninInfo
}


export const OrderLoginUser = 'order/LOGIN' as const;
export const OrderNonLoginUser = 'order/NON_LOGIN' as const;
export const OrderCreateItem = 'order/CREATE_ITEM' as const;
export const OrderDeleteItem = 'order/DELETE_ITEM' as const;
export const OrderUnitUp = 'order/UNIT_UP' as const;
export const OrderUnitDown = 'order/UNIT_DOWN' as const;
export const OrderChangeDates = 'order/CHANGE_DATES' as const;

export const OrderUnSignInfo = 'order/UNSIGN_INFO' as const;


// Actions 생성자
type OrderLoginUserAction = {
  type: typeof OrderLoginUser;
  payload: NowOrder;
}

type  OrderNonLoginUserAction = {
  type: typeof OrderNonLoginUser;
}

type OrderCreateItemAction = {
  type: typeof OrderCreateItem;
  payload: Item;
}

type OrderDeleteItemAction =  {
  type: typeof OrderDeleteItem;
  payload: Item;
}

type OrderUnitUpAction = {
  type: typeof OrderUnitUp;
  payload: Item;
}

type OrderUnitDownAction =  {
  type: typeof OrderUnitDown;
  payload: Item;
}

type OrderChangeDatesAction = {
  type: typeof OrderChangeDates;
  payload: Array<Item>;
}

type OrderChangeUnSignInfo = {
  type: typeof OrderUnSignInfo;
  payload: unSigninInfo;
}


export type OrderActionTypes =
  | OrderLoginUserAction
  | OrderNonLoginUserAction
  | OrderCreateItemAction
  | OrderDeleteItemAction
  | OrderUnitUpAction
  | OrderUnitDownAction
  | OrderChangeDatesAction
  | OrderChangeUnSignInfo;

export function orderLoginUser(itemList: Array<Item>, market: Market) {
  return {
    type: OrderLoginUser,
    payload: {
      itemList,
      market,
    },
  };
}

export function orderNonLoginUser() {
  return {
    type: OrderNonLoginUser,
  };
}

export function orderCreateNowOrder(item: Item) {
  return {
    type: OrderCreateItem,
    payload: item,
  };
}

export function orderDeleteNowOrder(item: Item) {
  return {
    type: OrderDeleteItem,
    payload: item,
  };
}

export function orderUnitUP(item: Item) {
  return {
    type: OrderUnitUp,
    payload: item,
  };
}
export function orderUnitDown(item: Item) {
  return {
    type: OrderUnitDown,
    payload: item,
  };
}
export function orderChangeDates(order: Array<Item>) {
  return {
    type: OrderChangeDates,
    payload: order,
  };
}

export function changeUnSignInfo(userInfo:unSigninInfo) {
  return {
    type: OrderUnSignInfo,
    payload: userInfo,
  };
}


export const actionOrderCreators = {
  orderLoginUser,
  orderNonLoginUser,
  orderCreateNowOrder,
  orderDeleteNowOrder,
  orderUnitUP,
  orderUnitDown,
  orderChangeDates,
};



const initialState: NowOrder = {
  itemList: [],
  market: {
    name: '',
    mobile: '',
  },
  unSignInfo:{
    mobile:'',
    address:'',
    brand:''
  }
};

export function OrderReducer(
  state = initialState,
  action: OrderActionTypes
): NowOrder {
  switch (action.type) {
    case OrderLoginUser:
      return {
        ...state,
        itemList: action.payload.itemList,
        market: {
          name: action.payload.market.name,
          mobile: action.payload.market.mobile,
        },
      };
    case OrderNonLoginUser:
      return {
        ...state,
        itemList: [],
        market: {
          name: '',
          mobile: '',
        },
      };
    case OrderCreateItem:
      return {
        ...state,
        itemList: [...state.itemList, action.payload],
      };
    case OrderDeleteItem:
      return {
        ...state,
        itemList: state.itemList.filter(
          (ele) =>
            ele.item !== action.payload.item || ele.unit !== action.payload.unit
        ),
      };

    case OrderUnitUp:
      return {
        ...state,
        itemList: state.itemList.map((ele) => {
          if (action.payload.item === ele.item) {
            return {
              item: ele.item,
              unit: ele.unit,
              quantity: ele.quantity + 1,
            };
          }
          return ele;
        }),
      };

    case OrderUnitDown:
      return {
        ...state,
        itemList: state.itemList.map((ele) => {
          if (action.payload.item === ele.item) {
            return {
              item: ele.item,
              unit: ele.unit,
              quantity: ele.quantity <= 0 ? 0 : ele.quantity - 1,
            };
          }
          return ele;
        }),
      };
    case OrderChangeDates:
      return {
        ...state,
        itemList: action.payload,
      };
    case OrderUnSignInfo:
      return {
        ...state,
        unSignInfo: action.payload
      };
    default:
      return state;
  }
}
