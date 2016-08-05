var express = require('express');
var router = express.Router();

var crypto = require('crypto');//加密并生成各种散列值

var User = require('../models/user.js');
var Post = require('../models/post.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{title:'首页'});
});




//获取登录页面
router.get('/login', checkNotLogin);
router.get('/login', function (req, res) {
    res.render('login',{title:'登录'});
});

//用户点击提交登录信息
router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
    //给密码加密
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	
	User.get(req.body.username, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/login');
		}
		if (user.password != password) {
			req.flash('error', '用户口令错误');
			return res.redirect('/login');
		}
		
		req.session.user = user;
		req.flash('success', '登入成功');
		res.redirect('/');
	});
});



//用户访问注册页面
router.get('/reg', checkNotLogin);
router.get('/reg', function (req, res) {
    res.render('reg',{title:'注册'});
});

//用户点击提交注册信息
router.post('/reg', checkNotLogin);
router.post('/reg', function (req, res) {
    //加密并生成口令的散列值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	
	var newUser = new User({
		name: req.body.username,
		password: password
	});
	
	
	//检查用户名是否已经存在
	User.get(newUser.name, function(err, user) {
		if (user)
			err = 'Username already exists.';
		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}
		
		//如果不存在则新增用户
		newUser.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success', '注册成功');
			res.redirect('/');
		});
	});
});




//用户访问手记页面
router.get('/publish', checkLogin);
router.get('/publish', function (req, res) {
	res.render('publish',{title:'发布手记'});
});

//用户发布新手记内容
router.post('/publish', checkLogin);
router.post('/publish', function (req, res) {
	
	var currentUser = req.session.user;
	
	var post = new Post(currentUser.name, req.body);
	
	post.save(function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发表成功');
		
		res.redirect('/article/page/1');
	});
	
});



//用户访问文章列表页面
router.get('/article/page/:index', checkLogin);
router.get('/article/page/:index', function (req, res) {
	User.get(req.session.user.name, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		
		var index = req.params.index;
		
		Post.get(req.session.user.name, index-1, 5, function(err, posts,totalCount) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			
			res.render('article',{
				title:'我的手记',
				user : req.session.user.name,
				posts : posts,
                totalPosts : totalCount._result,
                page : index				
			});
		});
	});
    
});



//用户访问文章详情页面
router.get('/detail/:page/:index', checkLogin);
router.get('/detail/:page/:index', function (req, res) {
	
	var page = req.params.page;
	var index = req.params.index;

	var index = (parseInt(page)-1)*5 + parseInt(index);
	
	Post.get(req.session.user.name, index, 1, function(err, posts,totalCount) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		
		res.render('detail',{
			title:'手记详情',
			user : req.session.user.name,
			posts : posts,
            totalPosts : totalCount._result,
            currentPage : page,
            currentIndex : index			
		});
	});
});




//用户访问更新文章页面
router.get('/edit/:page/:index', checkLogin);
router.get('/edit/:page/:index', function (req, res) {

	var index = (parseInt(req.params.page)-1)*5 + parseInt(req.params.index);
	
	Post.get(req.session.user.name, index, 1, function(err, posts,totalCount) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		
		res.render('edit',{
			title:'修改文章',
			posts : posts		
		});
	});
});

//用户提交更新后的文章
router.post('/update', checkLogin);
router.post('/update', function (req, res) {

	var oldPost = JSON.parse(req.body.oldPost);
	var newPost = JSON.parse(req.body.newPost);
	
	
	Post.update(req.session.user.name,oldPost,newPost,function(err){
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '修改成功');
		res.redirect('/article/page/1');
	});
});



//用户删除文章
router.post('/delete', checkLogin);
router.post('/delete', function (req, res) {

	var time = req.body.time;
	
	Post.remove(req.session.user.name, time, function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '删除成功');
		res.redirect('/article/page/1');
	});
});

//用户退出登录
router.get('/logout',checkLogin);//检查是否已登录
router.get('/logout', function(req, res) {
	req.session.user = null;
	req.flash('success', '登出成功');
	res.redirect('/');
});


//用户权限控制
function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', '您还未登录');
		return res.redirect('/login');
	}
	next();
}
function checkNotLogin(req, res, next) {
	if (req.session.user) {
		req.flash('error', '您已退出登录');
		return res.redirect('/');
	}
	next();
}

module.exports = router;
