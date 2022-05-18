const API_URL = 'http://localhost:3000/hey';

const form = document.getElementById('myform'); // grabbing an element on the page
console.log(form)
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    if (name.trim() && content.trim()) {
        // errorElement.style.display = 'none';
        form.style.display = 'none';
        // loadingElement.style.display = '';
        // console.log(name,content);
        var mypost = {name,content}
        console.log(mypost);
        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(mypost),
            headers: {
              'content-type': 'application/json'
            }
          }).then(response => response.json())
          .then(createdContent => {
              console.log(createdContent);
          })
    } else {
        console.log("Name and content are required!")
    }
});