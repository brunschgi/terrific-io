/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	path = require('path'),
	doT = require('express-dot'),
	mongoose = require('mongoose'),
	bunyan = require('bunyan'),
	cfg = require('./config'),
	passport = require('passport'),
	upload = require('jquery-file-upload-middleware'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	TwitterStrategy = require('passport-twitter').Strategy,
	LdapStrategy = require('passport-ldapauth').Strategy,
	app = express();

/**
 * Environment configuration
 */
var logger = bunyan.createLogger({name: "terrificio", level: 'trace'});

// all environments
app.set('port', process.env.PORT || cfg.site.port);
app.set('views', __dirname + '/terrific/views');
app.set('view engine', 'dot');
app.engine('html', doT.__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.compress());
app.use(express.cookieParser('terrificio'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

	// always expire -> disable caching
	app.use(function (req, res, next) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		next();
	});
}

// production only
if ('production' == app.get('env')) {
	app.use(express.errorHandler());
}


/**
 * Mongo DB Connection
 */
var db = mongoose.connect(cfg.mongoose.uri);


/**
 * Routes
 */

// data
var data = require('./controllers/Data')(app);
app.get('/data/load', data.load);

// general
var site = require('./controllers/Site')(app);
app.get('/', /* ensureLoggedIn('/login'), */ site.app);
app.get('/login', site.login);

// user
var user = require('./controllers/User')(app);
app.get('/api/users', /* ensureLoggedIn('/login'), */ user.search);
app.post('/api/users', /* ensureLoggedIn('/login'), */ user.create);
app.get('/api/users/:username', /* ensureLoggedIn('/login'), */ user.read);
app.put('/api/users/:username', /* ensureLoggedIn('/login'), */ user.update);
app.delete('/api/users/:username', /* ensureLoggedIn('/login'), */ user.delete);

// module
var module = require('./controllers/Module')(app);
app.get('/api/modules', /* ensureLoggedIn('/login'), */ module.search);
app.post('/api/modules', /* ensureLoggedIn('/login'), */ module.create);
app.get('/api/modules/:id', /* ensureLoggedIn('/login'), */ module.read);
app.get('/api/modules/render/:id', /* ensureLoggedIn('/login'), */ module.render);
app.put('/api/modules/:id', /* ensureLoggedIn('/login'), */ module.update);
app.delete('/api/modules/:id', /* ensureLoggedIn('/login'), */ module.delete);
app.put('/api/modules/:id/tags', /* ensureLoggedIn('/login'), */ module.updateTags);
app.put('/api/modules/:id/resources', /* ensureLoggedIn('/login'), */ module.updateResources);
app.post('/api/modules/precompile', /* ensureLoggedIn('/login'), */ module.precompile);

// tag
var tag = require('./controllers/Tag')(app);
app.get('/api/tags', /* ensureLoggedIn('/login'), */ tag.search);
app.post('/api/tags', /* ensureLoggedIn('/login'), */ tag.create);
app.delete('/api/tags/:id', /* ensureLoggedIn('/login'), */ tag.delete);

// resource
var resource = require('./controllers/Resource')(app, upload);
app.get('/api/resources', /* ensureLoggedIn('/login'), */ resource.search);
app.post('/api/resources', /* ensureLoggedIn('/login'), */ resource.create);
app.delete('/api/resources/:id', /* ensureLoggedIn('/login'), */ resource.delete);
app.use('/api/resources/upload', resource.upload);

/**
 * Passport configuration
 */
app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// configure twitter
passport.use(new TwitterStrategy({
		consumerKey: cfg.auth.twitter.consumerKey,
		consumerSecret: cfg.auth.twitter.consumerSecret,
		callbackURL: cfg.auth.twitter.callbackURL
	},
	function (token, tokenSecret, profile, done) {
		done(null, { id: 'dummy', name: 'Dummy User' });
	}
));

/*
 * Redirect the user to Twitter for authentication.
 * When complete, Twitter will redirect the user back to the application at /auth/twitter/callback
 */
app.get('/auth/twitter', passport.authenticate('twitter'));

/*
 * Twitter will redirect the user to this URL after approval.
 * Finish the authentication process by attempting to obtain an access token.
 * If access was granted, the user will be logged in. Otherwise, authentication has failed.
 */
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));


// configure ldap
passport.use(new LdapStrategy({
		server: {
			url: cfg.auth.ldap.url,
			adminDn:  cfg.auth.ldap.adminDn,
			adminPassword:  cfg.auth.ldap.adminPassword,
			searchBase: cfg.auth.ldap.searchBase,
			searchFilter:  cfg.auth.ldap.searchFilter,
			log4js: require('log4js'),
			verbose: true
		}
	},
	function (user, done) {
		return done(null, user);
	}
));

app.post('/auth/ldap', passport.authenticate('ldapauth', { session: false }), function (req, res) {
	res.send({ status: 'ok'});
});

// session serialize / deserialize user object
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	done(null, { id: 'dummy', name: 'Dummy User' });
});

// create server
http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
