import Parse from "../parseConfig";

// 🔹 Função para login
export const login = async (email: string, senha: string) => {
  try {
    const user = await Parse.User.logIn(email, senha);
    saveUserSession(user);
    return getCurrentUser();
  } catch (erro) {
    console.error("Erro no login:", erro);
    throw erro;
  }
};

// 🔹 Função para logout
export const logout = async () => {
  try {
    await Parse.User.logOut();
    localStorage.removeItem("user");
  } catch (erro) {
    console.error("Erro ao sair:", erro);
  }
};

// 🔹 Função para obter usuário logado
export const getCurrentUser = () => {
  const user = Parse.User.current();
  if (user) {
    return {
      id: user.id,
      username: user.get("username"),
      email: user.get("email"),
      createdAt: user.get("createdAt"),
      updatedAt: user.get("updatedAt"),
    };
  }
  return null;
};

// 🔹 Função para registrar um novo usuário
export const registerUser = async (email: string, senha: string, nome: string) => {
  const user = new Parse.User();
  user.set("username", nome);
  user.set("email", email);
  user.set("password", senha);

  try {
    await user.signUp();
    return user;
  } catch (erro) {
    console.error("Erro ao registrar usuário:", erro);
    throw erro;
  }
};

// 🔹 Função para salvar usuário no localStorage
const saveUserSession = (user: Parse.User) => {
  localStorage.setItem("user", JSON.stringify(user.toJSON()));
};

// 🔹 Função para obter usuário do localStorage
export const getUserSession = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  return !!Parse.User.current(); // Retorna true se o usuário estiver autenticado
};
