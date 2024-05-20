import axios from "../helper/axios";
import { createContext, useEffect, useReducer } from "react";

const AuthContext = createContext();


//lote ya tae action tway myr nay yin useReducer use
//useReducer use yin condition check tae akhr if else a sar switch use
//action tway mhr tal so tr login win yin dr lote logout phit yin dr lote ko pyaw tr
//action -> (type,payload)
let AuthReducer = (state,action) =>{
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem('user',JSON.stringify(action.payload))
      return {user : action.payload};
    case "LOGOUT":
      localStorage.removeItem('user')
      return {user : null};  
    default:
      return state;  
  }
}

const AuthContextProvider = ({children}) =>{
  
  let [state,dispatch] = useReducer(AuthReducer,{
    user : null
  })


  //refresh lote tae a chain tgi login win htr yin win htr tae a tgi phit ag
  useEffect(()=>{
    try {

      //regular so localstorage mhr token store p user login win ma win check tal
      //ae way ka recurity ma phit loh backend ka nay pal check lite tal
      axios.get('/api/users/me').then(res => {
        let user = res.data
        if(user) {
          dispatch({type : "LOGIN",payload : user})
        }else{
          dispatch({type: "LOGOUT"})
        }
      })
    } catch (e) {
      dispatch({type: "LOGOUT"})
    }
  },[])

  return(
    <AuthContext.Provider value={{...state,dispatch}}>
      {children}
    </AuthContext.Provider>
  )
}

export {AuthContext,AuthContextProvider}
