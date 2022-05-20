const API_URL = 'http://localhost:3000/';

const form = document.getElementById('myform'); // grabbing an element on the page

const posts_area = document.getElementById('posts');

function itsWorking(){
    console.log("WOW CRAXYZZYY")
}

async function getNumReplies(id)
{
    var obj = {};
    obj.id = id;

    let rawdata = await fetch(`${API_URL+"get-num-replies"}`,
    {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          'content-type': 'application/json'
        }
    }
        );

    let jsondata = await rawdata.json();

    return jsondata;
}

async function getReplies(id)
{
    var obj = {};
    obj.id = id;
    console.log(obj)

    var mydata = fetch(`${API_URL+"get-replies"}`,
    {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'content-type': 'application/json'
        }
    });

    // var myjsondata = await mydata.json();

    // console.log(jsondata)

    return mydata;
}


// //snippet
// getNumReplies("62868036888f946c5822573c")
// .then(result => {
//     console.log(result);
// });

function appendPost(parent,data)
{

    var contents = makePost(data);

    parent.appendChild(contents);
}

function makePost(data)
{
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.textContent = data.content+" ";

    var a = document.createElement('a');
    var linkText = document.createTextNode("[reply]");
    a.appendChild(linkText);
    a.id = "replybutton_" + data._id;
    a.href = "javascript:void(0);";//fake

    li.appendChild(a);

    const replyform = document.createElement('form');
    replyform.id = "replyform_"+data._id;
    
    const textarea = document.createElement('textarea');
    //i guess it has to be name not id to retrive val
    textarea.name = "content";
    const submitbutton = document.createElement('button');
    submitbutton.textContent = "submit";
    replyform.appendChild(textarea);
    replyform.appendChild(document.createElement('br'));
    replyform.appendChild(submitbutton);
    replyform.style.display = "none";

    li.appendChild(document.createElement('br'));
    li.appendChild(replyform);

    ul.appendChild(li);

    // var data = {}
    // data._id = "idk";
    // data.content = "idk";
    // ul.appendChild(makePost(data));

    // console.log(li)

    return ul;
}


function makeMe(id, c)
{
    getNumReplies(id)
    .then(reply_data => {
        if(reply_data.count!=0)
        {
            console.log(reply_data);
            getReplies(reply_data.id)
            .then(response => response.json())
            .then(replies => {
                console.log(replies);
                for(var i = 0; i < replies.length; i++)
                {
                    var data = {}
                    data._id = replies[i]._id;
                    data.content = replies[i].content;
                    // appendPost(contents,data);
                    var contents2 = makePost(data);
                    
                    makeMe(replies[i]._id, contents2);
                    
                    c.appendChild(contents2);
                    
                }
            });
        }
    });
}

function listAllPosts()
{
    // posts_area.innerHTML = '';
    fetch(`${API_URL+"get-posts"}`)
    .then(response => response.json())
    .then(result => {

        console.log(result);
        for(var i = 0; i < result.length; i++)
        {
            var hr = document.createElement('hr')

            const contents = document.createElement('p');
            contents.textContent = result[i].content+" ";

            var a = document.createElement('a');
            var linkText = document.createTextNode("[reply]");
            a.appendChild(linkText);
            a.id = "replybutton_" + result[i]._id;

            contents.appendChild(a);

            const replyform = document.createElement('form');
            replyform.id = "replyform_"+result[i]._id;
            
            const textarea = document.createElement('textarea');
            //i guess it has to be name not id to retrive val
            textarea.name = "content";
            const submitbutton = document.createElement('button');
            submitbutton.textContent = "submit";
            replyform.appendChild(textarea);
            replyform.appendChild(document.createElement('br'));
            replyform.appendChild(submitbutton);
            replyform.style.display = "none";

            contents.appendChild(document.createElement('br'));
            contents.appendChild(replyform);

            // var contents = makePost(result[i]);


            //snippet
            // console.log(result[i]._id);
            // var id = result[i]._id;
  
            makeMe(result[i]._id, contents);
            hr.append(contents);
            posts_area.appendChild(hr);


            // console.log(posts_area);

            // document.getElementById(replyforum.id).addEventListener('click', itsWorking)
        }
    });
}

listAllPosts();

function showHide(id) {
    // console.log("show/hide")
    var x = document.getElementById(id);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// click event delegation
posts_area.addEventListener("click", function(e)
{
    const targetID = e.target.id;
    var arr = targetID.split("_");
    // console.log(arr);
    
    if(arr[0] == "replybutton")
    {
        showHide("replyform_"+arr[1]);
    }
});

// submit event delegation
posts_area.addEventListener("submit", function(event)
{
    event.preventDefault();

    const targetID = event.target.id;
    var arr = targetID.split("_");
    // console.log(arr);

    var myform = document.getElementById("replyform_"+arr[1]);
    // console.log(myform);
    const formData = new FormData(myform);
    const name = "aidan";
    const content = formData.get('content');
    const reply_to = arr[1];
    // console.log(content);
    if (name.trim() && content.trim()) {
        var mypost = {name,content,reply_to}
        console.log(mypost);
        fetch(`${API_URL+"make-post"}?skip=${1}&limit=${2}`, {
            method: 'POST',
            body: JSON.stringify(mypost),
            headers: {
              'content-type': 'application/json'
            }
          }).then(response => response.json())
          .then(createdContent => {
              console.log('created',createdContent);
          })
    }
});

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
        fetch(`${API_URL+"make-post"}?skip=${1}&limit=${2}`, {
            method: 'POST',
            body: JSON.stringify(mypost),
            headers: {
              'content-type': 'application/json'
            }
          }).then(response => response.json())
          .then(createdContent => {
              console.log('created',createdContent);
          })
    } else {
        console.log("Name and content are required!")
    }

});