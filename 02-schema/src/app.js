const { GraphQLServer } = require("graphql-yoga");

const moviesList = [
  { id: 1, title: "Peaceful Warrior", duration: 0, duration: 129 },
  { id: 2, title: "Gone in Sixty Seconds", duration: 60, duration: 145 },
  { id: 3, title: "Matrix", duration: 404, duration: 185 },
];

const songsList = [
  { id: 1, title: "Heart of courage" },
  { id: 2, title: "For the Win" },
  { id: 3, title: "Immortal" },
];

const resolvers = {
  Media: {
    __resolveType(obj, context, info) {
      return "Movie";
    },
  },
  Query: {
    demo: () => "Hello GraphQL Schema!",
    movies: () => moviesList,
    movie: (parent, args) => moviesList.find((movie) => movie.id == args.id),
    song: (parent, args) => songsList.find((song) => song.id == args.id),
  },
  Mutation: {
    createMovie: (parent, args) => {
      const id = moviesList.length + 1;
      const movie = {
        id: id,
        title: args.movie.title, // jeśli w Mutation podajesz jako argument jakiś obiekt np:   createMovie(movie: MovieInput): Movie! to wtedy to movie staje się obiektem więc aby np dostać title musisz napisać args.movie.title gdzie to 'title' z 'args' to nazwa w mutation --^ . Jakbyś podawał ręcznie wszystkie pola, np: createMovie(title: "adas" duration: "436356") to wtedy nie trzeba odwoływać się do obiektu movie no bo nie twrzysz tylko bezpośrednio przekazujesz te dane
        duration: args.movie.duration,
      };
      moviesList.push(movie);
      return movie;
    },
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
