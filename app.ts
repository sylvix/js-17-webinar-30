const baseUrl = 'http://146.185.154.90:8000/blog/john.doe@test.com';

const userNameH3 = document.getElementById('userName')!;
const editProfileBtn = document.getElementById('editProfile')!;
const profileModal = new bootstrap.Modal('#profileModal');
const firstNameInput = <HTMLInputElement>document.getElementById('firstName')!;
const lastNameInput = <HTMLInputElement>document.getElementById('lastName')!;
const profileForm = <HTMLFormElement>document.getElementById('profileForm');

interface GetProfileResponse {
  email: string;
  firstName: string;
  lastName: string;
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
  })
};

run().catch(console.error);

