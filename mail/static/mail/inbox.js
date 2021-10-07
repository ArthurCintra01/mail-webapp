document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email); 
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  const form = document.getElementById('compose-form');
  form.addEventListener('submit', send_email)
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // show emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    for (const email in emails){
      sender = emails[email].sender;
      subject = emails[email].subject;
      timestamp = emails[email].timestamp;
      let div = document.createElement('div');
      if (emails[email].read === true){
        div.style = 'display: inline-block; width: 100%; cursor: pointer; background-color: #dfdfdf; border: 1px solid #afafaf; border-radius: 5px; margin-top: 10px; padding-top: 10px;  padding-bottom: 10px;  padding-left: 15px;';
      }else{
        div.style = 'display: inline-block; width: 100%; cursor: pointer; border: 1px solid #afafaf; border-radius: 5px; margin-top: 10px; padding-top: 10px;  padding-bottom: 10px;  padding-left: 15px;';
      }
      div.innerHTML = `<div style="display:inline-block;"><strong>${sender}</strong></div>
      <div style="display:inline-block; padding-left: 15px; width: 70%;">${subject}</div>
      <div style="display:inline-block;">${timestamp}</div>`;
      if (mailbox === 'sent'){
        div.addEventListener('click', () => load_email(emails[email],true));
      }else{
        div.addEventListener('click', () => load_email(emails[email],false));
      }
      document.querySelector('#emails-view').append(div);
    }
  })
}

function archive(email){
  if(email.archived === true){
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
    .then(() => {
        load_mailbox('inbox');
    });
  }else{
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
    .then(() => {
        load_mailbox('inbox');
    });
  }
}

function load_email(email, is_sent){
  fetch(`emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
  if (email.archived === true){
    is_archived = 'Unarquive';
  }
  else{
    is_archived = 'Archive';
  }
  document.querySelector('#emails-view').innerHTML = 
  `<div id="email_info" style='padding-bottom:20px; border-bottom: 1px solid #c0c0c0;'><strong>From:</strong> ${email.sender}<br>
  <strong>To:</strong> ${email.recipients}<br>
  <strong>Subject:</strong> ${email.subject}<br>
  <strong>Timestamp:</strong> ${email.timestamp}<br>
  </div>
  <p style="margin-top:10px;">${email.body}</p>`;
  let reply_btn = document.createElement('button');
  reply_btn.style = "font-size: 0.8em; padding: 6px; margin-top:10px;"
  reply_btn.classList = "btn btn-outline-primary";
  reply_btn.innerHTML = 'Reply';
  reply_btn.addEventListener('click', ()=> reply_email(email));
  document.querySelector('#email_info').append(reply_btn);
  if (is_sent === false){
    let archive_btn = document.createElement('button');
    archive_btn.style = "font-size: 0.8em; padding: 6px; margin-top:10px; margin-left: 5px;";
    archive_btn.classList = "btn btn-outline-primary";
    archive_btn.innerHTML = `${is_archived}`;
    archive_btn.addEventListener('click', ()=> archive(email))
    document.querySelector('#email_info').append(archive_btn);
  }
}

function reply_email(email){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#compose-recipients').value = `${email.sender}`;
  let subject = email.subject;
  if (subject.includes("Re:")){
    document.querySelector('#compose-subject').value = `${email.subject}`;
  }else{
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  } 
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
  const form = document.getElementById('compose-form');
  form.addEventListener('submit', send_email)
}

function send_email(event){
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value
  const subject = document.querySelector('#compose-subject').value
  const body = document.querySelector('#compose-body').value
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then( () => {
      load_mailbox('sent');
  });
} 

