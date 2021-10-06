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
      // getting data
      sender = emails[email].sender;
      subject = emails[email].subject;
      timestamp = emails[email].timestamp;
      //creating div
      let div = document.createElement('div');
      // div.style='-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none; -o-user-select:none;'
      if (emails[email].read === true){
        div.style = 'cursor: pointer; background-color: #c0c0c0; border: 1px solid black; margin-top: 10px; padding: 10px;';
      }else{
        div.style = 'cursor: pointer; border: 1px solid black; margin-top: 10px; padding: 10px;';
      }
      div.innerHTML = `<div style="display:inline-block;"><strong>${sender}</strong></div>
      <div style="display:inline-block; padding-left: 15px; width: 70%;">${subject}</div>
      <div style="display:inline-block;">${timestamp}</div>`;
      div.addEventListener('click', () => load_email(emails[email]));
      document.querySelector('#emails-view').append(div);
    }
  })
}

function load_email(email){
  fetch(`emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
  document.querySelector('#emails-view').innerHTML = 
  `<div style='padding-bottom:20px; border-bottom: 1px solid #c0c0c0;'><strong>From:</strong> ${email.sender}<br>
  <strong>To:</strong> ${email.recipients}<br>
  <strong>Subject:</strong> ${email.subject}<br>
  <strong>Timestamp:</strong> ${email.timestamp}<br>
  <button id="reply" style="font-size: 0.8em; padding: 6px; margin-top:10px;"class="btn btn-outline-primary">Reply</button></div>
  <p style="margin-top:10px;">${email.body}</p>`;
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
  .then(result => {
      // Print result
      console.log(result);
  });
  load_mailbox('sent');
} 

