const API = import.meta.env.VITE_API_URL

export const registerUser = async (name,email,password)=>{
    const res = await fetch(`${API}/register`,{
        method:"POST",
        headers:{"content-Type":"application/json"},
        body:JSON.stringify({name,email,password})
    })
    return res.json()
}

export const loginUser = async (email,password)=>{
    const res = await fetch(`${API}/login`,{
        method:"POST",
        headers:{"content-Type":"application/json"},
        body: JSON.stringify({ email, password })   
    })
    return res.json()
}