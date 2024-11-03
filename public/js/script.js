
//Dropdown menu for the nav element on small screen 
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
  
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  