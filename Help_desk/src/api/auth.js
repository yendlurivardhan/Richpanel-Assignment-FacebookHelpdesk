const API = import.meta.env.VITE_BACKEND_URL;

export const registerUser = async (name, email, password) => {
  try {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("⚠️ Server Error:", errorData);
      throw new Error(errorData.message || "Registration failed");
    }

    return res.json();
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    throw err;
  }
};


export const loginUser = async (email, password) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
};
