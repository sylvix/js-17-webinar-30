const baseUrl = 'http://146.185.154.90:8000/blog/john.doe@test.com';

const userNameH3 = document.getElementById('userName')!;
const editProfileBtn = document.getElementById('editProfile')!;
const profileModal = new bootstrap.Modal('#profileModal');
const firstNameInput = <HTMLInputElement>document.getElementById('firstName');
const lastNameInput = <HTMLInputElement>document.getElementById('lastName');
const profileForm = <HTMLFormElement>document.getElementById('profileForm');
const messages = document.getElementById('messages')!;
const messageForm = document.getElementById('messageForm')!;
const messageInput = <HTMLInputElement>document.getElementById('message');

interface GetProfileResponse {
  email: string;
  firstName: string;
  lastName: string;
  _id: string;
}

interface Post {
  datetime: string;
  message: string;
  user: GetProfileResponse;
  userId: string;
  _id: string;
}

const run = async () => {
  const response = await fetch(baseUrl + '/profile');
  const user: GetProfileResponse = await response.json();

  userNameH3.innerText = user.firstName + ' ' + user.lastName;

  editProfileBtn.addEventListener('click', () => {
    profileModal.show();
    firstNameInput.value = user.firstName;
    lastNameInput.value = user.lastName;
  });

  profileForm.addEventListener('submit', async event => {
    event.preventDefault();
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;

    const body = new URLSearchParams();
    body.append('firstName', firstName);
    body.append('lastName', lastName);

    try {
      await fetch(baseUrl + '/profile', {method: 'POST', body});
      profileModal.hide();
      userNameH3.innerText = firstName + ' ' + lastName;
      user.firstName = firstName;
      user.lastName = lastName;
    } catch (e) {
      alert('Something went wrong!');
    }
  });

  messageForm.addEventListener('submit', async event => {
    event.preventDefault();
    const message = messageInput.value;

    const body = new URLSearchParams();
    body.append('message', message);

    try {
      await fetch(baseUrl + '/posts', {method: 'POST', body});
    } catch (e) {
      alert('Could not send message!');
    }
  });

  let lastDate = '';

  setInterval(async () => {
    let url = baseUrl + '/posts';

    if (lastDate) {
      url += '?datetime=' + lastDate;
    }

    const response = await fetch(url);
    const posts: Post[] = await response.json();

    if (posts.length > 0) {
      lastDate = posts[posts.length - 1].datetime;
    }

    for (const post of posts) {
      const message = document.createElement('div');
      message.innerHTML = `
        <strong>${post.user.firstName + ' ' + post.user.lastName} said:</strong>
        <blockquote>${post.message}</blockquote>
      `;
      message.className = 'card card-body mb-2';
      messages.insertBefore(message, messages.firstElementChild);
    }
  }, 3000);
};

run().catch(console.error);

