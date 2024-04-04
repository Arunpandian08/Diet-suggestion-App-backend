# :rocket: IN THIS REPOSITORY

## 🧬Diet Suggestion App:

**🩸You can see the App in 📌[Netlify.com](https://diet-suggestion-app-frontend.netlify.app/)**

**🩸Backend Deployed in 📌[Rendor.com](https://diet-suggestion-app-backend.onrender.com)**

---
**📂Folder Structure (MVC)**
+ Controllers
  + foodController.js
  + userController.js
+ DataBase
  + DbConfig.js
+ Middlewares
  + authUser.js
+ Models
  + foodSchema.js
  + userSchema.js
+ Routers
  + foodRouter.js
  + userRouter.js
+ .env (For storing Credentials Like JWT,DB Connection String,Password,etc.,) 
+ index.js            
---
**🛗 Third Parties:**
+ Express Js
+ Cors
+ dotenv
+ Mongoose
+ Nodemailer
+ JsonWebToken
+ Bcrypt
+ Crypto
+ Nodemon 
---
***The End Points are,*** <br>

   **🔛User Routes**
  ----
  + **Register:**
    + [/api/user/register](https://diet-suggestion-app-backend.onrender.com/api/user/register)
    + Request from Body
      + Name
      + Contact Number
      + Gender
      + Email 
      + Password
  + **Login:** 
    + [/api/user/login](https://diet-suggestion-app-backend.onrender.com/api/user/login)
    + Request From Body
      + Email
      + Password <br>
       
If  user Forget Their password 
+ **Forget Password:** 
    + [/api/user/forgetpassword](https://diet-suggestion-app-backend.onrender.com/api/user/forgetpassword)
    + Request from body
      + Email
   
    + Using Crypto to create Random String.
    ```javascript
    const token = crypto.randomBytes(10).toString("hex");
    ``` 
    + Using Nodemailer 📩 for sending Reset Password URL. 
    ```javascript
     // Construct email message
     const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Reset Password",
      html: `<p>Click <a href="/resetURL"><strong>here</strong></a> to reset your password</p>`,
    };

    // Create a transporter object using SMTP transport
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Send mail
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending mail:", error);
        return response.status(500).json({ message: "Failed to send mail" });
      }
      console.log("Email sent:", info.response);
      response.status(200).json({ message: "Please check your email" });
    });

    ```
+  **Validate Reset Code:**
   + [/api/user/validateresetcode/:code](https://diet-suggestion-app-backend.onrender.com/api/user/validateresetcode/:code)
  
+ **Reset Password:** 
    + [/api/user/resetpassword](https://diet-suggestion-app-backend.onrender.com/api/user/resetpassword)
    + Request From Body
      + Email
      + New Password
      + Confirm Password 
---
**Added Required Diet Foods Images and data are Inserted in DB**  
     