const model = require('./model');

let
    Blog = model.Blog,
    User = model.User;
    Comment = model.Comment;

    var userInfo = {
        name: 'John8',
        admin: false,
        email: 'john4-' + Date.now() + '@garfield.pet',
        passwd: 'hahaha'
    };    
    
(async () => {
    
    /*
    var user = await User.create({
        name: 'John3',
        admin: false,
        email: 'john3-' + Date.now() + '@garfield.pet',
        passwd: 'hahaha'
    });
    */
    
    //var user = await User.create(userInfo);
    //console.log('created: ' + JSON.stringify(user));
    
    /*   
   var Blog = await Blog.create({
        ownerId: user.id,
        name: 'Garfield',
        gender: false,
        birth: '2007-07-07',
    });
    console.log('created: ' + JSON.stringify(cat));
    var dog = await Pet.create({
        ownerId: user.id,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
    });
    console.log('created: ' + JSON.stringify(dog));
    */
})().catch((e)=>{
    console.log(`failed: ${e}`);
});

User.createUser(userInfo);