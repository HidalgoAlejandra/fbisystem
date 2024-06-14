//npm init --yes
//npm i express
//npm i --save jsonwebtoken
//npm i cors

const express = require("express");
const agentes = require("./data/agentes.js").results;
const app = express();
app.listen(3000, () => console.log("Servidor encendido en el puerto 3000"));
const jwt = require("jsonwebtoken");
const cors = require("cors");

const secretKey = "1234";
app.use(cors());

function generateToken(email) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 120,
      email,
    },
    secretKey
  );
}

app.get("/SignIn", (req, res) => {
  let email = req.query.email;
  let pass = req.query.password;
  let agent = agentes.find((u) => u.email == email && u.password == pass);
  console.log(email);
  let token = generateToken(email);
  agent
    ? res.send(`
  <p>Agente autenticado, bienvenido <b>${email}</b>
  Su token esta en el sessionStorage</p>
  <a href="https://localhost:3000/Dashboard?token=${token}"> Ir al Dashboard</a>
  <script>
    sessionStorage.setItem('token', JSON.stringify("${token}"))
  </script>`)
    : res.send("Usuario o contraseña incorrecta");
});

app.get("/Dashboard", (req, res) => {
  const token = req.query.token;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "401 Unauthorized",
        message: "Token inválido.",
      });
    } else res.send(`Bienvenido al Dashboard ${decoded.email}`);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
