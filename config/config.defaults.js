module.exports = {
	env: 'development',
	site: {
		port: 3000
	},
	mongoose: {
		uri: 'mongodb://localhost:27017/terrificio'
	},
	auth : {
		ldap: {
			enable: false,
			url: 'ldap://<host>:<port>',
			adminDn: 'cn=xxx,o=xxx',
			adminPassword: 'your-pass',
			searchBase: 'o=xxx',
			searchFilter: 'your-ldap-query'
		},
		twitter: {
			enable: false,
			consumerKey: 'your-consumer-key',
			consumerSecret: 'your-consumer-secret',
			callbackURL: 'http://<server>/auth/twitter/callback'
		}
	}
};
