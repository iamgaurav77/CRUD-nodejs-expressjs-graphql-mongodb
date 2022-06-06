const {buildSchema} = require('graphql');

module.exports = buildSchema(`

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        age: Int!
    }

    input UserInputData {
        name: String!
        email: String!
        password: String!
        age: Int!
    }

    type RootQuery {
        hello: String
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        readUser(email:String!):User!
        updateUser(email:String!,name:String!,age:Int!):User!
        deleteUser(email:String!):Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);