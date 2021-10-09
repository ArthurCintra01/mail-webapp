# Projeto email webapp

Consiste em um site de emails, onde pode ser criado usuarios e trocar, responder e arquivar emails entre eles.
O app faz requisições para um API local e salva os emails em uma database local, então apenas é possivel trocar emails localmente.

## Tecnologias

* Python
* Django Web Framework
* SQLite3
* Javascript
* HTML e CSS

## Features do site

* Send Email
* Check Mailbox (Inbox, Sent and Archived)
* View Email
* Archive and Unarchive
* Reply

## Para inicializar:
```
python manage.py makemigrations
```
```
python manage.py migrate
```
```
python manage.py runserver
```
