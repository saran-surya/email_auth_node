# Setting up ***[email_auth](https://pub.dev/packages/email_auth)*** for production.

### NODE JS plugin for effectively working with email_auth (Flutter)

---

| META DATA               | Description |
| ----------------------- | ----------- |
| Current release version | **_v2_**    |
| Author                  | Saran Surya |



## HOT FIXES
- ### Only supports OUTLOOK (Out of the BOX), Kindly proceed with an outlook account
- HTML fixes, Basic style changes
- Supports OTP length


## UPDATES
- ### ***v2*** 
  - An enchanced home page, with a possible integration of admin panel in the future ***(v2.xx ~ v3)***
  - Live log viewer will be integrated when the Admin panel has been integrated
  - #### Added support for log file implementation, Now all ERRORS / WARNINGS / INFO from server are stored in a log file, that can be retrived. 
    - #### Cleaner console : Enable console logging with the flag ```npm start --log```


## DEPRECATED METHODS / OPERATIONS
- ### Support for GMAIL has been transffered to ***OUTLOOK***, As ***Google*** has removed the access to less secure apps. 
  - #### REFER : [#66](https://github.com/saran-surya/email_auth/discussions/66#discussion-4027810)
  - Expect a patch for choosing between Google and Outlook as an option while configuring the servers using the CLI ***(v2.xx ~ v3)***
- ### TEST SERVERS are marked OBSOLETE. 
  - #### REFER : [#74](https://github.com/saran-surya/email_auth/discussions/74#discussioncomment-4270459)
  - Expect them to be up in next version releases ***(v2.xx ~ v3)***

<!-- 
# **_Test server working status : <img src=https://app-authenticator.herokuapp.com/test/img width=55>_**

## Node Extension to host your apps to a server for optimised production speeds using email_auth.

# NOTE:

- KINDLY USE TEST SERVER, EXPECT A PATCH IN THE COMING WEEKS

# KINDLY USE OUTLOOK account with the server to work on.

## Thanks [FOR THE IDEA ON OUTLOOK](https://github.com/saran-surya/email_auth_node/issues/37#issue-1305691263) -->

___ 

# Visit the page here for the detailed steps 📌
## [Detailed setup of email-auth-node](https://saran-surya.github.io/email-auth-node/)

### Overview summary

- Create a outlook account
- Import the repository and mark it private
- Clone it to your local system
- Perform `npm install`
- Perform `npm link` ```(optional not mandatory)```
- Create the configurations `npx email-auth-node --generate`
- Create a account on Heroku
- Create an app on heroku and connect it with the github repo you created
- Publish the server on heroku
- Add a auth.config.dart file in the flutter project with the data from the config file of the generated config
- Work seamlessly with email_auth with your custom production server


## If you love the project, Kindly consider starring the repo ⭐

## 💚 Thankyou.
