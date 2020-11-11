import React, { useState,useEffect } from "react"
import facade from "./apiFacade";
 
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
      <h2>Login</h2>
      <form onChange={onChange} >
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
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
    <div>
      {!loggedIn ? 
      (<div><LogIn login={login} /> 
      {errorMessage}</div>) :
        (<div>
          <LoggedIn />
          <button onClick={logout}>Logout</button>
        </div>)}
    </div>
  )
 
}
export default App;
