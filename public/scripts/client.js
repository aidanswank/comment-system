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
    // console.log(obj)

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

function makePost(data)
{
    var ul = document.createElement('ul');
    ul.id = "yuel_" + data._id;
    var li = document.createElement('li');
    li.id = "postlist_" + data._id;
    li.textContent = data.content+" ";

    var a = document.createElement('a');
    var linkText = document.createTextNode("reply");
    a.appendChild(linkText);
    // console.log(linkText);
    a.id = "replybutton_" + data._id;
    a.href = "javascript:void(0);";//fake

    var a2 = document.createElement('a');
    var linkText2 = document.createTextNode("delete");
    a2.appendChild(linkText2);
    // console.log(linkText);
    a2.id = "deletebutton_" + data._id;
    a2.href = "javascript:void(0);";//fake

    
    var span_options = document.createElement('span');
    span_options.id = "options_"+data._id;
    span_options.style = "display:none; float:right;"

    span_options.append("[");
    span_options.append(a);
    span_options.append("]");


    span_options.append("[");
    span_options.append(a2);
    span_options.append("]");

    li.append(span_options);

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


// Safe guard, so i dont go too deep in the rabbit hole!
var MAX_DEPTH = 3;
// post id, html context, recursive depth
function makeMe(id, c, depth)
{
    if(depth > MAX_DEPTH)
    {
        console.log("You gone too far!")
        return;
    }

    getNumReplies(id)
    .then(reply_data => {
        if(reply_data.count!=0)
        {
            // console.log(reply_data);
            getReplies(reply_data.id)
            .then(response => response.json()) // -___-
            .then(replies => {
                // console.log(replies);
                for(var i = 0; i < replies.length; i++)
                {
                    var data = {}
                    data._id = replies[i]._id;
                    data.content = replies[i].content;
                    // appendPost(contents,data);
                    var contents2 = makePost(data);
                    
                    makeMe(replies[i]._id, contents2, depth+1); // 0 _ 0 OMg recursive !
                                
                    c.appendChild(contents2);
                    // c.insertBefore(contents2,c.nextSibling);
                    
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
            const contents = document.createElement('div');
            // contents.insertBefore(hr,contents.nextSibling);

            contents.classList.add('postArea');

            var p = document.createElement('p');

            // contents.insertBefore(hr,contents);
            p.textContent = result[i].content+" ";

            contents.appendChild(p);

            var a = document.createElement('a');
            var linkText = document.createTextNode("[reply]");
            a.appendChild(linkText);
            a.id = "replybutton_" + result[i]._id;

            p.appendChild(a);

            const replyform = document.createElement('form');
            replyform.id = "replyform_"+result[i]._id;
            
            const textarea = document.createElement('textarea');
            //i guess it has to be name not id to retrive val
            textarea.name = "content";
            const submitbutton = document.createElement('button');
            submitbutton.textContent = "submit";
            replyform.appendChild(textarea);
            // replyform.appendChild(document.createElement('br'));
            replyform.appendChild(submitbutton);
            replyform.style.display = "none";

            contents.appendChild(replyform);
            
            // var contents = makePost(result[i]);
            
            
            //snippet
            // console.log(result[i]._id);
            // var id = result[i]._id;
     
            makeMe(result[i]._id, contents, 0);
            // hr.append(contents);
            posts_area.appendChild(contents);
            // posts_area.appendChild(document.createElement('br'));


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

// function refreshReplies(post_id)
// {
//     getReplies(post_id)
//     .then(response => response.json())
//     .then(replies => {
//         console.log(replies);
//     });
// }

// submit event delegation
posts_area.addEventListener("mouseover", function(event)
{
    const targetID = event.target.id;
    var arr = targetID.split("_");
    // console.log(arr[1]);
    if(arr[0]=="postlist"||arr[0]=="replybutton")
    {
        var element = document.getElementById("options_"+arr[1]);
        element.style = "display: inline; float:right;";
        var postlist = document.getElementById("postlist_"+arr[1]);
        postlist.style = "background-color: rgba(0,0,0,0.1);";
    }
});

posts_area.addEventListener("mouseout", function(event)
{
    const targetID = event.target.id;
    var arr = targetID.split("_");
    console.log(arr);
    if(arr[0]=="postlist"||arr[0]=="replybutton")
    {
        var element = document.getElementById("options_"+arr[1]);
        element.style = "display: none;";
        var postlist = document.getElementById("postlist_"+arr[1]);
        postlist.style = "background-color: rgba(0,0,0,0.0);";
    }
});

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
            //   listAllPosts();
            // refreshReplies(arr[1]);
            // thread.innerHTML='';
            // console.log(thread);
            // recursiveDelete(arr[1]);
            // document.getElementById("postlist_"+arr[1]);
            
            document.getElementById("replyform_"+arr[1]).value = '';
            showHide("replyform_"+arr[1]);
            
            getReplies(arr[1])
            .then(response => response.json())
            .then(replies => {
                console.log(replies);
                for(var i = 0; i < replies.length; i++)
                {
                    var postlisting = document.getElementById("yuel_"+replies[i]._id);
                    // console.log(postlisting);
                    if(postlisting)
                    {
                        postlisting.remove();
                    }
                }
            });

            var postlisting = document.getElementById("postlist_"+arr[1]);
            makeMe(arr[1],postlisting);

            
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