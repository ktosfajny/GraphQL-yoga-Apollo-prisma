const { ApolloServer, gql } = require("apollo-server");
const { readFileSync } = require("fs");
const { prisma } = require("./generated/prisma-client");

// ZAMIAST GraphQL-Yoga będziemy korzystać z Apollo ponieważ nowe wersje Apollo wprowadizły takie zmiany że korzystanie z graphql-yoga nie ma już sensu i mozna od razu korzystać z Apollo

// usunęliśmy także te tablice z danymi ponieważ zastąpimy je prawdziwą bazą danych
// yarn add apollo-server graphql prisma-client-lib
// yarn global add prisma
// yarn remove graphql-yoga <--- usuwamy graphql-yoga bo już nie będzie potrzebny

const resolvers = {
  Query: {
    movies: async () => await prisma.movies(),
    directors: async () => await prisma.directors(),
    movie: async (parent, args, context, info) => {
      return prisma.movie({ id: args.id });
    },
    director: async (parent, args, context, info) => {
      return prisma.director({ id: args.id });
    },
  },
  Mutation: {
    createMovie: async (parent, args) => {
      const movie = {
        title: args.title,
        duration: args.duration,
        director: {
          connect: { id: args.director },
        },
      };
      return prisma.createMovie(movie);
    },
    createDirector: async (parent, args) => {
      const director = { name: args.name };
      return prisma.createDirector(director);
    },
  },
  Movie: {
    duration: ({ duration }, args) => {
      if (args.unit == "MINUTES") return Math.round(duration / 60);
      if (args.unit == "HOURS") return Math.round(duration / 3600);

      return duration;
    },
    director: async (parent, args, context, info) => {
      return prisma.movie({ id: parent.id }).director();
    },
  },
  Director: {
    movies: (parent, args, context, info) => {
      return moviesList.filter((movie) => movie.director_id == parent.id);
    },
  },
};

// tu jest zmiana -> odczytujemy plik z schema a wczesniej podawaliśmy tylko ściezkę do niego bo graphql-yoga czytał te pliki .graphql
const server = new ApolloServer({
  // poniżej dla typeDefs wczesniej podawaliśmy ściezkę do pliku ale teraz musimy odczytać jego zawartość
  typeDefs: gql`
    ${readFileSync(__dirname.concat("/schema.graphql"), "utf8")}
  `,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
