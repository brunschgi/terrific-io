var ObjectId = require('mongodb').ObjectID;

exports.User = {
    "admin" : { _id: "admin", password: "admin", name: "Admin", email: "admin@terrific.io", img_url: "admin.png", bio: "The admin" },
    "brunschgi" : { _id: "brunschgi", password: "brunschgi", name: 'Remo Brunschwiler', email: "remo@terrifically.org", img_url: "remobrunschwiler.png", bio: "Terrific!" }
};

exports.Tag = {
    login : { _id: new ObjectId(), name: "Login"},
    logout : { _id: new ObjectId(), name: "Logout"},
    navigation : { _id: new ObjectId(), name: "Navigation"},
    input : { _id: new ObjectId(), name: "Input & Selection"},
    table : { _id: new ObjectId(), name: "Table"},
    tooltip : { _id: new ObjectId(), name: "Tooltip"},
    button : { _id: new ObjectId(), name: "Button"},
    icon : { _id: new ObjectId(), name: "Icon"},
    loader : { _id: new ObjectId(), name: "Loader"},
    lab : { _id: new ObjectId(), name: "Lab"}
};

exports.Resource = {
    jquery : {
        _id: new ObjectId(),
        name : 'jquery-latest.min.js',
        src : '',
        size : 18000,
        type : 'js',
        global: true
    },
    prefixfree : {
        _id: new ObjectId(),
        name : 'prefixfree.min.js',
        src : '',
        size : 18000,
        type : 'js',
        global: true
    }
};

exports.Module = [
    {
        _id: new ObjectId(),
        name: "Loader dots",
        description: "Loader dots",
        html : { content: '<div class="loader"><div class="dot dot1"></div><div class="dot dot2"></div><div class="dot dot3"></div><div class="dot dot4"></div></div>' },
        css : { content: '.loader {    position: relative;    width: 80px;    margin: 100px auto;}.dot {    width: 20px;    height: 20px;    border-radius: 10px;    background: #333;    position: absolute;    animation-duration: 0.5s;    animation-timing-function: ease;    animation-iteration-count: infinite;}.dot1, .dot2 {    left: 0;}.dot3 { left: 30px; }.dot4 { left: 60px; }@keyframes reveal {    from { transform: scale(0.001); }    to { transform: scale(1); }}@keyframes slide {    to { transform: translateX(30px) }}.dot1 {    animation-name: reveal;}.dot2, .dot3 {    animation-name: slide;}.dot4 {    animation-name: reveal;    animation-direction: reverse;}' },
        js : { content: '' },
        user : exports.User.admin._id,
        collaborators: [ exports.User.brunschgi._id ],
        tags: [ exports.Tag.loader  ._id ],
        resources: [ exports.Resource.jquery._id, exports.Resource.prefixfree._id ]
    },
    {
        _id: new ObjectId(),
        name: "Test",
        description: "Test Description",
        html : { content: '<div class="test">Test</div>' },
        css : { content: '.test { background: #000; color: #efefef }' },
        js : { content: '$(".test").css({ background: "#999" });' },
        user : exports.User.brunschgi._id,
        collaborators: [ exports.User.admin._id ],
        tags: [ exports.Tag.lab._id ],
        resources: [ exports.Resource.jquery._id ]
    }
];