import React, { useState,useEffect } from "react"
import facade from "./apiFacade";
//import 'bootstrap/dist/css/bootstrap.min.css';
import './final.css'

 
function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);
 
  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials,[evt.target.id]: evt.target.value })
  }
 
  return (
    <div>
      <div id="formContent">
      <h2>Login</h2>
      
      <form class="fadeIn second" onChange={onChange} >
        <input placeholder="User Name" class="form-control" id="username" />
        <br></br>
        <div class="fadeIn third"><input placeholder="Password" class="form-control" id="password" /></div>
        <br></br>
        
        <br></br>

        <div id="formFooter">
        <a class="underlineHover" href="#"><div class="fadeIn fourth"><button class="btn btn-default" onClick={performLogin}>Login</button></div></a>
        </div>
      </form>

    </div></div>
  )
 
}
function LoggedIn() {
  const [dataFromServer, setDataFromServer] = useState("Loading...")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => { facade.fetchData().then(data=> setDataFromServer(data.msg))
    .catch((error) => {
      error.fullError.then((err) => {
        setErrorMessage(err.message)
        console.log("error:" + err)
      })
    })}, [])
 
  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
      {errorMessage}
    </div>
  )
 
}
 
function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
 
  const logout = () => {  
    facade.logout()
    setLoggedIn(false)
 } 
  const login = (user, pass) => { 
    facade.login(user,pass)
    .then(res => {
      setLoggedIn(true)
      setErrorMessage("")  
    }).catch((error) => {
      error.fullError.then((err ) => {
        setErrorMessage(err.message)
        console.log("error: " + err)
      })
    })
    ;} 
 
  return (
    <div class="wrapper fadeInDown">
      {!loggedIn ? 
      (<div><LogIn login={login} /> 
      {errorMessage}</div>) :
        (<div>
          <LoggedIn />
          <button class="btn btn-default"onClick={logout}>Logout</button>
        </div>)}
    </div>
  )
 
}
export default App;
