module.exports = {
    ensureAuthenticatedasUser: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('err_msg', 'Please log in to view this resource')
        res.redirect('/login')
    },

    ensureAuthenticatedasAdmin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.isAdmin == true) {
            return next();
        }
        console.log('here');
        // res.json('login as admin do this')
       req.flash("err_msg", "Please log as admin to view this resource");
       res.redirect("/login");
    }
}
