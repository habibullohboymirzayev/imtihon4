"use strict";

const elForm = document.querySelector(".form")
const elUserNameInput = document.querySelector(".username-input")
const elPasswordInput = document.querySelector(".password-input")


elForm.addEventListener("submit", function (evt) {
    evt.preventDefault()
    
    const userNameINputValue = elUserNameInput.value
    const passwordValue = elPasswordInput.value
    
    fetch("https://reqres.in/api/login",{
    method:'POST',
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        email: userNameINputValue,
        password: passwordValue,
    })
})
.then(res =>res.json())
.then(data => {
    if (data?.token) {
        window.localStorage.setItem("token", data.token)

        window.location.replace("home.html");
    }else{
        alert ("Password or Username is Incorrect")
    }
})


})