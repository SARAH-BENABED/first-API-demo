const form = document.getElementById("loginForm") ;

form.addEventListener("submit", async function(event) {
    event.preventDefault() ;
    
    const email = document.getElementById("email").value ;
    const password = document.getElementById("password").value ;

    try {
        const response = await fetch("https://first-api-demo-spring-bot-2.onrender.com/auth/login",{
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body : JSON.stringify({
                email : email,
                password : password 
            }) 
        }) ;

        if(!response.ok) {
            const errorText = await response.text() ;
            throw new Error(errorText) ;
        }
      
        const token = await response.text() ;
        localStorage.setItem("token", token) ;

        window.location.href = "patient.html" ;

    } catch(error) {
        document.getElementById("errorMsg").innerText = error.message ;

    }
 

})