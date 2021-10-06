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
  if (mailbox === 'inbox'){
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      console.log(emails);
      for (const email in emails){
        sender = emails[email].sender;
        subject = emails[email].subject;
        timestamp = emails[email].timestamp;
        let div = document.createElement('div')
        div.style.border = '1px solid black';
        div.style.marginTop = '10px';
        div.style.padding = '10px';
        div.innerHTML = `${sender}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ${subject}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${timestamp}`;
        document.querySelector('#emails-view').append(div);
      }
    })
  }
 
}

function send_email(event){
  event.preventDefault()
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

