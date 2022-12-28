let loginform = document.querySelector(".login-form");
let signupForm = document.querySelector(".signup-form");
let message = document.querySelector(".acount-message");
let registerlink = document.querySelector(".register-link");
// inputs
let loginUsername = document.querySelector("#login-username");
let loginEmail = document.querySelector("#login-email");
let loginPassward = document.querySelector("#login-passward");
//
let signupname = document.querySelector("#signup-name");
let signupUsername = document.querySelector("#signup-username");
let signupEmail = document.querySelector("#signup-email");
let signupPassward = document.querySelector("#signup-passward");
//
let loginBtn = document.querySelector(".login-user-btn");
let signupBtn = document.querySelector(".signup-form-btn");
registerlink.addEventListener("click", (e) => {
  e.preventDefault();
  loginform.classList.add("hide");
  signupForm.classList.remove("hide");
  registerlink.classList.add("hide");
  message.textContent =
    "lets complete your registration and make a setup of your bussiness ";
});
// login sigup
console.log(loginUsername);
console.log(loginPassward);
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    loginUsername.value !== "" &&
    loginPassward.value !== "" &&
    loginEmail.value !== ""
  ) {
    setTimeout(() => {
      window.location.assign("branch.html");
    }, 2000);
  } else {
    alert("please fill All fields");
  }
});
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    signupEmail.value !== "" &&
    signupname.value !== "" &&
    signupPassward.value !== "" &&
    signupUsername.value !== ""
  ) {
    setTimeout(() => {
      window.location.assign("branch.html");
    }, 2000);
  } else {
    alert("please fill All fields");
  }
});
