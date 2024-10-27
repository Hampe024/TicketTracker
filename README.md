# TicketTracker
System devoloped for a course at BTH

## Prerequisites

### Node.js and npm
[Node.js website]([https://ngrok.com/](https://nodejs.org/en/download/package-manager))

### MongoDB
Install MongoDB and have it run on port 27017(default)
```
sudo apt-get install -y mongodb-org
mongosh --port 27017
```

### Ngrok
Visit [Ngrok](https://ngrok.com/) and make an account.<br>
Follow their installation and add authtoken.<br>
Claim a static domain to use, we will get back to this domain later.

### CloudMailin
Visit [CloudMailin](https://www.cloudmailin.com/) and make an account.<br>
You will then be guided to setup both send and recive email, for now you can skip send email.

Set up recive email by adding this url:
```
<your ngrok domain>/recive-email
```
The next page tells you a email adress, save this as it is the adress that customer will use to create/update tickets via email.

### Mailjet
For this you need to make a .env file at the root of the repo.

Visit [Mailjet](https://www.mailjet.com) and make an account.

#### Get api keys
Go to [/account/apikey](https://app.mailjet.com/account/apikeys), save both api key and secret key in the .env file
```
MAILJET_API_KEY=<api>
MAILJET_SECRET_KEY=<secret>
```

#### Make sender adress
Go to [/account/sender](https://app.mailjet.com/account/sender) and add a sender adress at the bottom, make sure to verify it too, then add it to your .env file
```
MAILJET_SEND_EMAIL=<email>
```

## Startup

### MongoDB
Start mongo in the background
```
sudo systemctl start mongod
```

### Ngrok
Use the domain that you claimed earlier
```
ngrok http --url <domain> 3000
```

### Backend
In /backend
```
node index
```

### Frontend
In /frontend
```
npm run run
```

## Known bugs/issues

### 1
Customer accounts can be created by either registering, or by sending in a ticket. But agent and admin accounts can only be created using the admin dashboad. This means that the first admin user has to be created via api fetch. This can be done by sending a POST request to 'http://localhost:3000/user' containing this body:
```
{
    "name": "John Doe",
    "email": "admin1@mail.com",
    "role": "admin",
    "password": "test",
    "firstTimeLogIn": false
}
```

### 2
Sometimes when customers send an email to the CloudMailin adress, multiple api calls will be made no Ngrok with some time delay, leading to multiple tickets or comments being added to the system. This is belived to be an issue on Cloudmailins part.
