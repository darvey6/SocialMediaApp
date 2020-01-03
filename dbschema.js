let db = {
    users: [
        {
            userId: 'testuser1234asdf',
            email: 'testuser1@email.com',
            handle: 'user1',
            createdAt: '2019-03-15T10:59:52.798Z',
            imageUrl: 'image/coolimage/aaaa',
            bio: 'Hello, my name is user1, nice to meet you',
            website: 'https://github.com/darvey6',
            location: 'Vancouver, CA'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2019-07-31T23:33:54.157Z',
            likeCount: 5,
            commentCount: 2


        }
    ]
};

const userDetails = {
    // Redux data
    // what user information is hold in our redux state in front end. Used to populate our profile with.

    credentials: {
      userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2019-03-15T10:59:52.798Z',
      imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
      bio: 'Hello, my name is user, nice to meet you',
      website: 'https://user.com',
      location: 'Lonodn, UK'
    },
    //need to check if posts are liked by User and to show different icon if it is/isnt
    likes: [
      {
        userHandle: 'user',
        screamId: 'hh7O5oWfWucVzGbHH2pa'
      },
      {
        userHandle: 'user',
        screamId: '3IOnFoQexRcofs5OhBXO'
      }
    ]
  };