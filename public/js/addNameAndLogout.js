const addNameAndLogout=function () {
  let name=document.getElementById('userName');
  name.innerText=user;
}

window.onload=addNameAndLogout;