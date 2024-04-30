const { response } = require("express");
const express = require("express");
const uuid = require("uuid");
const port = 3000;

const app = express();
app.use(express.json()); // Middleware para lidar com o corpo da requisição

const users = [];

const CheckUserID = (request, response, next) => {
   const { id } = request.params

   const index = users.findIndex(user => user.id === id)

   if (index < 0) {
      return response.status(404).json({ message: "User not found" })
   } 
   request.userIndex = index
   request.userId = id
   next()
}

app.get('/users', (request, response) => {
   return response.json(users);
});

app.post('/users', (request, response) => {
   const { name, age } = request.body; // Correção na atribuição dos valores

   const newUser = { id: uuid.v4(), name, age }; // Correção na variável do novo usuário
   users.push(newUser); // Correção para adicionar ao array de usuários

   return response.status(201).json(newUser);
});

app.put('/users/:id',CheckUserID, (request, response) => {
   const { name, age } = request.body
   const index = request.userIndex
   const id = request.id

   const updatedUser = { id, name, age }

   users[index] = updatedUser

   return response.json(updatedUser)


})

app.delete('/users/:id',CheckUserID, (request, response) => {
   const index = request.userIndex
   users.splice(index, 1)

   return response.status(204).json()
})

app.listen(port, () => {
   console.log('Server is running on port ${port}');
});