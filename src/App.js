import React, { useState,useEffect } from "react"
import facade from "./apiFacade";
//import 'bootstrap/dist/css/bootstrap.min.css';
import './other.css'
import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
 
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
      <Header />
      <Switch>
        <Route exact path="/">
          <Home data = {dataFromServer} />
        </Route>
        <Route path="/externalfrontend" >
          <ExternalFrontend />
        </Route>
        <Route path="/externalbackend" >
          <ExternalBackend />
        </Route>
        <Route path="/scraper" >
          <Webscraper />
        </Route>
      </Switch>
    </div>
    );
 
}

const Header = () => {
  return (
<div><ul className="header">
  <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
  <li><NavLink activeClassName="active" to="/externalfrontend">External frontend</NavLink></li>
  <li><NavLink activeClassName="active" to="/externalbackend">External backend</NavLink></li>
  <li><NavLink activeClassName="active" to="/scraper">Webscraper</NavLink></li>
</ul>
<hr />
</div>
  );
}

function Home(props) {
  return (
    <div>
      Data received from server: 
      <br></br>{props.data}
    </div>
  );
}

function ExternalFrontend() {
  const [joke, setJoke] = useState("");

  useEffect(() => {
    fetch('https://api.chucknorris.io/jokes/random').then(res=>res.json()).then(data=>{
      setJoke(data.value)
      localStorage.setItem("currentJoke", data.value); 
    })
  }, []);

  return (
    <div>
      Her er en joke:
      <br></br>
      {joke}
      <br></br>
      <br></br>
      <button
        class="btn btn-default"
        onClick={() =>
          fetch("https://api.chucknorris.io/jokes/random")
            .then((res) => res.json())
            .then((data) => {
              setJoke(data.value);
            })
        }
      >
        Click for new joke
      </button>
      <br></br>
      <button class="btn btn-default" onClick={() => SaveJoke()}>
        Click to add joke this joke to database
      </button>
      <br></br>
    </div>
  );
}

function ExternalBackend(){
  const [joke, setJoke] = useState("");

  useEffect(() => {
    fetch('https://conphas.com/startkodeca3/api/info/joke').then(res=>res.json()).then(data=>{
      setJoke(data)
      localStorage.setItem("currentJoke", data.value); 
    })
  }, []);

  return (
    <div>
      Her er en joke:
      <br></br> 
      Value: {joke.value}
      <br></br> 
      Url: {joke.url}
      <br></br>
      <br></br>
      <button class="btn btn-default" onClick={() => SaveJoke()}>Click to add joke this joke to database</button>
    </div>
  );
}

function SaveJoke(props){
  const va = localStorage.getItem("currentJoke")
  fetch('https://conphas.com/startkodeca3/api/info/', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    joke: va
  })
})
}

function Webscraper(){
  const [webData, setData] = useState("");
  const url = "https://conphas.com/startkodeca3/api/info/parallel";
  useEffect(() => {
    fetch(url).then(res=>res.json()).then(data=>{
      setData(data)
    })

    const interval = setInterval(() => {
      fetch(url).then(res=>res.json()).then(data=>{
      setData(data)
    })
    }, 20000)

    return () => clearInterval(interval)
  }, []);
  
  if(!webData){
    return (
    <div>
      Waiting for data...
    </div>
  );
  }
  
  return (
    <div>
      {webData.title}, time spent: {webData.timeSpent}

      {webData.tags.map((data) => (
         <tr>
           <td>{data.url}</td> <td> -- div count: {data.divCount}</td>
         </tr>
       ))}
    </div>
  );
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
    })
    ;} 
 
  return (
    <div class="wrapper fadeInDown">
      {!loggedIn ? 
      (<div><LogIn login={login} />  
      {errorMessage}</div>) :
        (<div> 
        
        <br>
        </br>
        <br></br>
          <Router>
          <LoggedIn />
          </Router>
           <br></br><br></br><br></br><br></br><br></br><br></br><br></br><button class="btn btn-default" onClick={logout}>Logout</button>
        </div>)}
        
        
    </div>
  )
 
}
export default App;
