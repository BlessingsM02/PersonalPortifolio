
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');


let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
// const nodemailer = require('nodemailer');
window.onscroll = () =>{
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');


        if(top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a [href*= ' + id + ']').classList.add('active')
            })
        }
    })
}

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bc-x');
    navbar.classList.toggle('active');
}


document.getElementById('contact').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, message })
  });
  
  if (response.ok) {
    Swal.fire({
      icon: 'success',
      title: 'Message sent successfully!',
      showConfirmButton: false,
      timer: 1600
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Failed to send message',
      text: 'Please try again later.',
    });
  }
});


async function fetchMessages() {
  const response = await fetch('/api/messages');
  const messages = await response.json();
  
  const messageList = document.getElementById('message-list');
  messageList.innerHTML = '';
  
  messages.forEach(message => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `<h3>${message.name}</h3><p>${message.email}</p><p>${message.message}</p>`;
    messageList.appendChild(messageDiv);
  });
}

//gets all the public repositories of a names user.. Chile02 in my case
async function getUserProjects() {
  const response = await fetch('https://api.github.com/users/chile02/repos');
  const repos = await response.json();
  
  const projectGallery = document.getElementById('all-project');
  repos.forEach(repo => {
    const project = document.createElement('div');
    project.className = 'project';
    project.innerHTML = `

    <a
    href=${repo.html_url}
    target="_blank"
    rel="noopener noreferrer"
    class="repo">
    <div class="repo_top">
      <div class="repo-name">
        <h3>${repo.name}</h3>
      </div>
      <p>${repo.description}</p>
    </div>

    <div class="repo-stats">

      <div class="repo-stats-left">
        <span>
            ${repo.language}
        </span>
        <span>
        <i class='bx bxs-star'></i>
          ${repo.stargazers_count.toLocaleString()}
        </span>
        <span>
        <i class='bx bx-git-repo-forked'></i>
          ${repo.forks.toLocaleString()}
        </span>
      </div>

      <div class="repo-stats-right">
        <span>${repo.size.toLocaleString()} KB</span>
      </div>
    </div>
  </a>
  
    `;
    projectGallery.appendChild(project);
  });
}


getUserProjects();
