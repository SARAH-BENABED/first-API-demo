const form = document.getElementById("registerForm") ;

form.addEventListener("submit", async function(event) {
    event.preventDefault() ;
    
    const email = document.getElementById("email").value ;
    const password = document.getElementById("password").value ;

    const manager = {
        email : email ,
        password : password
    } ;


    try {
        const response = await fetch("https://first-api-demo-spring-bot-2.onrender.com/auth/register",{
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(manager) 
        }) ;

        if(!response.ok) {
            const errorText = await response.text() ;
            throw new Error(errorText) ;
        }
      
        
        window.location.href = "login.html" ;

    } catch(error) {
        document.getElementById("errorMsg").innerText = error.message ;

    }
 

})