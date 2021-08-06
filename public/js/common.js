// Elements
const $darkModeCheckBox = document.getElementById('darkModeCheck').checked;

const setTheme = theme => document.documentElement.className = theme;
setTheme($darkModeCheckBox ? "dark" : "light"); 


//Checked
const onDarkModeSelect = (event) => {
  if(event.checked){
    setTheme('dark')
  }else{
    setTheme('light')
  }
};