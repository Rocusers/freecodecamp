var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    debug = require('debug')('freecc:cntr:userController');

// returns number of days between two timestamps
function dayDifference(timestamp1, timestamp2) {
    return Math.abs((timestamp2 - timestamp1) / 86400000);
}

// calculates the last streak and the longest streak (continuous timestamps where each is at most
// 24 hours from the next one), and returns an array of [current streak, longest streak]
function calculateStreaks(calendar) {
    if (!calendar || !calendar.length || calendar.length < 2)
        return [1, 1];
    
	const sortedCalendar = calendar.sort();
	let longestStreak = 1;
	let currentStreak = 0;
    let currentStreakStart = 0;
	let numCalendarEntries = sortedCalendar.length;
    sortedCalendar.forEach(function (calendarEntry, index, calendar) {
        if (index === 0) return;
        
        if (dayDifference(calendarEntry, calendar[index - 1]) <= 1) {
            currentStreak++;
            
            let currentStreakLength = Math.ceil(dayDifference(calendarEntry, calendar[currentStreakStart]));
            if (currentStreakLength > longestStreak) {
                longestStreak = currentStreakLength;
            }
        } else {
            currentStreak = 0;
            currentStreakStart = index;
        }
    });
    return [Math.ceil(dayDifference(calendar[numCalendarEntries - 1], calendar[currentStreakStart])), longestStreak];
}

module.exports = function(app) {
  var router = app.loopback.Router();
  var User = app.models.User;
  var Story = app.models.Story;

  router.get('/login', function(req, res) {
    res.redirect(301, '/signin');
  });
  router.get('/logout', function(req, res) {
    res.redirect(301, '/signout');
  });
  router.get('/signin', getSignin);
  router.get('/signout', signout);
  router.get('/forgot', getForgot);
  router.post('/forgot', postForgot);
  router.get('/reset-password', getReset);
  router.post('/reset-password', postReset);
  router.get('/email-signup', getEmailSignup);
  router.get('/email-signin', getEmailSignin);
  router.get('/account/api', getAccountAngular);
  router.post('/account/password', postUpdatePassword);
  router.post('/account/delete', postDeleteAccount);
  router.get('/account/unlink/:provider', getOauthUnlink);
  router.get('/account', getAccount);
  // Ensure this is the last route!
  router.get('/:username', returnUser);

  app.use(router);

  function getSignin(req, res) {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/signin', {
      title: 'Free Code Camp Login'
    });
  }

  function signout(req, res) {
    req.logout();
    res.redirect('/');
  }

  function getEmailSignin(req, res) {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/email-signin', {
      title: 'Sign in to your Free Code Camp Account'
    });
  }

  function getEmailSignup(req, res) {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/email-signup', {
      title: 'Create Your Free Code Camp Account'
    });
  }

  function getAccount(req, res) {
    if (!req.user) {
      return res.redirect('/');
    }
    res.render('account/account', {
      title: 'Manage your Free Code Camp Account'
    });
  }

  function getAccountAngular(req, res) {
    res.json({
      user: req.user || {}
    });
  }

  function returnUser(req, res, next) {
    const username = req.params.username.toLowerCase();
    const { path } = req;
    User.findOne(
      { where: { username } },
      function(err, user) {
        if (err) {
          return next(err);
        }
        if (!user) {
          req.flash('errors', {
            msg: `404: We couldn't find path ${ path }`
          });
          return res.redirect('/');
        }
        if (!user.isGithubCool && !user.isMigrationGrandfathered) {
          req.flash('errors', {
            msg: `
              user ${ username } has not completed account signup
            `
          });
          return res.redirect('/');
        }

        var cals = user
          .progressTimestamps
          .map(objOrNum => {
            return typeof objOrNum === 'number' ?
              objOrNum :
              objOrNum.timestamp;
          });
          
        [user.currentStreak, user.longestStreak] = calculateStreaks(cals);

        const data = user
          .progressTimestamps
          .map((objOrNum) => {
            return typeof objOrNum === 'number' ?
              objOrNum :
              objOrNum.timestamp;
          })
          .reduce((data, timeStamp) => {
            data[(timeStamp / 1000)] = 1;
            return data;
          }, {});

        const challenges = user.completedChallenges.filter(function(obj) {
          return obj.challengeType === 3 || obj.challengeType === 4;
        });

        res.render('account/show', {
          title: 'Camper ' + user.username + '\'s portfolio',
          username: user.username,
          name: user.name,
          isMigrationGrandfathered: user.isMigrationGrandfathered,
          isGithubCool: user.isGithubCool,
          location: user.location,
          githubProfile: user.github,
          linkedinProfile: user.linkedin,
          googleProfile: user.google,
          facebookProfile: user.facebook,
          twitterHandle: user.twitter,
          picture: user.picture,
          progressTimestamps: user.progressTimestamps,
          calender: data,
          challenges: challenges,
          moment: moment,
          longestStreak: user.longestStreak,
          currentStreak: user.currentStreak
        });
      }
    );
  }

  function postUpdatePassword(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long')
      .len(4);

    req.assert('confirmPassword', 'Passwords do not match')
      .equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/account');
    }

    User.findById(req.user.id, function(err, user) {
      if (err) { return next(err); }

      user.password = req.body.password;

      user.save(function(err) {
        if (err) { return next(err); }

        req.flash('success', { msg: 'Password has been changed.' });
        res.redirect('/account');
      });
    });
  }

  function postDeleteAccount(req, res, next) {
    User.destroyById(req.user.id, function(err) {
      if (err) { return next(err); }
      req.logout();
      req.flash('info', { msg: 'Your account has been deleted.' });
      res.redirect('/');
    });
  }

  function getOauthUnlink(req, res, next) {
    var provider = req.params.provider;
    User.findById(req.user.id, function(err, user) {
      if (err) { return next(err); }

      user[provider] = null;
      user.tokens =
        _.reject(user.tokens, function(token) {
          return token.kind === provider;
        });

      user.save(function(err) {
        if (err) { return next(err); }
        req.flash('info', { msg: provider + ' account has been unlinked.' });
        res.redirect('/account');
      });
    });
  }

  function getReset(req, res) {
    if (!req.accessToken) {
      req.flash('errors', { msg: 'access token invalid' });
      return res.render('account/forgot');
    }
    res.render('account/reset', {
      title: 'Password Reset',
      accessToken: req.accessToken.id
    });
  }

  function postReset(req, res, next) {
    const errors = req.validationErrors();
    const { password } = req.body;

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    User.findById(req.accessToken.userId, function(err, user) {
      if (err) { return next(err); }
      user.updateAttribute('password', password, function(err) {
      if (err) { return next(err); }

        debug('password reset processed successfully');
        req.flash('info', { msg: 'password reset processed successfully' });
        res.redirect('/');
      });
    });
  }

  function getForgot(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    res.render('account/forgot', {
      title: 'Forgot Password'
    });
  }

  /**
  * POST /forgot
  * Create a random token, then the send user an email with a reset link.
  */

  function postForgot(req, res) {
    const errors = req.validationErrors();
    const email = req.body.email.toLowerCase();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/forgot');
    }

    User.resetPassword({
      email: email
    }, function(err) {
      if (err) {
        req.flash('errors', err);
        return res.redirect('/forgot');
      }

      req.flash('info', {
        msg: 'An e-mail has been sent to ' +
        email +
        ' with further instructions.'
      });
      res.render('account/forgot');
    });
  }

  function updateUserStoryPictures(userId, picture, username, cb) {
    Story.find({ 'author.userId': userId }, function(err, stories) {
      if (err) { return cb(err); }

      const tasks = [];
      stories.forEach(function(story) {
        story.author.picture = picture;
        story.author.username = username;
        tasks.push(function(cb) {
          story.save(cb);
        });
      });
      async.parallel(tasks, function(err) {
        if (err) {
          return cb(err);
        }
        cb();
      });
    });
  }
};
