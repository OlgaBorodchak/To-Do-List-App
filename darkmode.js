let theme = localStorage.getItem("theme");
const tumbler = document.querySelector("#icon-moon-sun");
const darkMode = document.querySelector("body");

const enableDarkMode = () => {
    darkMode.classList.add('dark-mode');
    localStorage.setItem('theme', 'enabled');
}

const disableDarkMode = () => {
    darkMode.classList.remove('dark-mode');
    localStorage.setItem('theme', null);
}

if (theme === 'enabled') {
    enableDarkMode();
}

tumbler.addEventListener("click", () => {
    theme = localStorage.getItem('theme');
    if (theme !== 'enabled') {
        enableDarkMode();
    } else {  
        disableDarkMode(); 
    }
});


