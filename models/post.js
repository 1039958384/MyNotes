var mongodb = require('./db');

function Post(username, post, time) {
	
	this.user = username;
	this.post = post;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
	
};

module.exports = Post;

//保存数据
Post.prototype.save = function save(callback) {
// 存入 Mongodb 的文档
	var post = {
		user: this.user,
		post: this.post,
		time: this.time,
	};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// 为 user 属性添加索引
			collection.ensureIndex('user');
			// 写入 post 文档
			collection.insert(post, {safe: true}, function(err, post) {
				mongodb.close();
				callback(err, post);
			});
		});
	});
};



//读取全部数据
/*Post.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			// 查找 user 属性为 username 的文档，如果 username 是 null 则匹配全部
			var query = {};
			if (username) {
				query.user = username;
			}
			collection.find(query).sort({time: -1}).toArray(function(err, docs) {
				mongodb.close();
				if (err) {
					callback(err, null);
				}
				// 封装 posts 为 Post 对象
				var posts = [];
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.post, doc.time);
					posts.push(post);
				});
				callback(null, posts);
			});
		});
	});
};*/

//分页读取数据
Post.get = function get(username, index, offset, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			// 查找 user 属性为 username 的文档，如果 username 是 null 则匹配全部
			var query = {};
			if (username) {
				query.user = username;
			}
			
			var totalCount = collection.find(query).count();
			
			collection.find(query).sort({time: -1}).skip(index*offset).limit(offset).toArray(function(err, docs) {
				mongodb.close();
				if (err) {
					callback(err, null);
				}
				// 封装 posts 为 Post 对象
				var posts = [];
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.post, doc.time);
					posts.push(post);
				});
				callback(null, posts,totalCount);
			});
		});
	});
};

//按照用户名和发表时间删除文档-----按照发表时间删除可能不准确---应该匹配整个文档删除
Post.remove = function remove(username, time, callback){
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.remove({"user":username,"post.date":time},function(err){
				mongodb.close();
				callback(err);
			});
		});
	});
};

//更新文档内容
Post.update = function update(username,oldPost,newPost,callback){
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.update({"user":username,"post":oldPost},{$set:{"post":newPost,"time":new Date()}},function(err){
	
				mongodb.close();
				callback(err);
			});
		});
	});
};
