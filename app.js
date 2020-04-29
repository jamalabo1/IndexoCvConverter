const express = require('express');
const path = require('path');
var i18n = require('i18n');

const handlebars = require('hbs');
const indexRouter = require('./routes/index');
const handlebarsConfig = require('./i18n/hbsConf');

for (const helper in handlebarsConfig.helpers) {
    handlebars.registerHelper(helper, handlebarsConfig.helpers[helper]);
}


const app = express();


i18n.configure({
    locales: ['he', 'ar'],
    directory: __dirname + "/locales",
    defaultLocale: 'ar'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(i18n.init);


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/cv-static', indexRouter);
app.use("/cv-static", express.static(path.join(__dirname, 'cv-static')));


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
// });

app.listen(process.env.PORT || 1337);
// module.exports = app;
