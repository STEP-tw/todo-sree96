const mark=function (event) {
  function reqListener () {
    // let visitorCount = this.responseText;
    // console.log(visitorCount);
    // document.querySelector('#count').innerText = visitorCount;
    console.log(this.responseText);
  }
  let id=event.target.id;
  let element=document.getElementById(id);
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  if(element.checked){
    oReq.open("GET", `mark&${id}`);
    oReq.send();
  }
  else{
    oReq.open("GET", `unmark&${id}`);
    oReq.send();
  }
}
