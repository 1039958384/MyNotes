$(function(){
	
	login();//登录验证
	reg();//注册验证
	publish();//发布和修改验证
	delete_article();//删除文章
	
	
	//登录表单的本地验证和post
	function login(){
		var loginForm = $("#login form");
		var loginFormBtn = $("#login form button");
		var loginUsName = $("#login input[name=username]");
		var loginPawd = $("#login input[name=password]");
		
		loginUsName.bind("change",function(){
			check_username();
		});
		
		loginPawd.bind("change",function(){
			check_password();
		});
		
		loginFormBtn.bind("click",function(event){
			var flag = true;
			if(!check_username()){
				flag = false;
			}else if(!check_password()){
				flag = false;
			}
			
			if(flag){//全部验证通过时,才提交表单
				loginForm.submit();
			}
		});
		
		function check_username(){
			var username = loginUsName.val().trim();
			var reg1 = /^\S{4,20}$/g;
			if(!reg1.test(username)){
				loginUsName.css("border","1px solid red");
				var tip1 = $("#login .tip").eq(0).html("用户名必须由4~20位字符组成")
							.css("color","red").css("font-size","12px");
				loginUsName.after(tip1);
				return false;
			}else{
				loginUsName.css("border","1px solid green");
				loginUsName.after($("#login .tip").eq(0).html(""));
				return true;
			}
		}
	    function check_password(){
			var password = loginPawd.val().trim();
			var reg2 = /^\w{6,20}$/g;
			if(!reg2.test(password)){
				loginPawd.css("border","1px solid red");
				var tip2 = $("#login .tip").eq(1).html("只能是6~20位数字、字母或下划线")
							.css("color","red").css("font-size","12px");
				loginPawd.after(tip2);
				return false;
			}else{
				loginPawd.css("border","1px solid green");
				loginPawd.after($("#login .tip").eq(1).html(""));
				return true;
			}
		}
	
	}
	
	//用户注册表单的本地验证和post
	function reg(){
		var regForm = $("#reg form");
		var regFormBtn = $("#reg form button");
		var regUser = $("#reg input[name=username]");
		var regPawd = $("#reg input[name=password]");
		var regPawd1 = $("#reg input[name=password-repeat]");
		
		//验证用户名
		regUser.bind("change",function(){
			check_user();
		});
		//验证密码
		regPawd.bind("change",function(){
			check_password();
		});
		//验证两次密码输入是否一致
		regPawd1.bind("change",function(){
			check_password_repeat();
		});
		
		//所有验证通过后提交表单
		regFormBtn.bind("click",function(event){
			var flag = true;
			if(!check_user()){
				flag = false;
			}else if(!check_password()){
				flag = false;
			}else if(!check_password_repeat()){
				flag = false;
            }
			
            if(flag){//全部验证通过时,才提交表单
				regForm.submit();
			}			
		});
		
		function check_user(){
			var username = regUser.val().trim();
			var reg1 = /^\S{4,20}$/g;
			if(!reg1.test(username)){
				regUser.css("border","1px solid red");
				var tip1 = $("#reg .tip").eq(0).html("用户名必须由4~20位字符组成")
							.css("color","red").css("font-size","12px");
				regUser.after(tip1);
				return false;
			}else{
				regUser.css("border","1px solid green");
				regUser.after($("#reg .tip").eq(0).html(""));
				return true;
			}
		}
	
	    function check_password(){
			var password = regPawd.val().trim();
			var reg2 = /^\w{6,20}$/g;
			if(!reg2.test(password)){
				regPawd.css("border","1px solid red");
				var tip2 = $("#reg .tip").eq(1).html("只能是6~20位数字、字母或下划线")
							.css("color","red").css("font-size","12px");
				regPawd.after(tip2);
				return false;
			}else{
				regPawd.css("border","1px solid green");
				regPawd.after($("#reg .tip").eq(1).html(""));
				return true;
			}
		}
	    
	    function check_password_repeat(){
			var password1 = regPawd1.val().trim();
			if(password1 !== regPawd.val().trim()){
				regPawd1.css("border","1px solid red");
				var tip3 = $("#reg .tip").eq(2).html("两次密码输入不一致！")
							.css("color","red").css("font-size","12px");
				regPawd1.after(tip3);
				return false;
			}else{
				regPawd1.css("border","1px solid green");
				regPawd1.after($("#reg .tip").eq(2).html(""));
				return true;
			}
		}
	
	    
	}

	//发布手记的表单提交
	function publish(){
		var publish_form = $("#publish-form");
		var publishBtn = $("#publish-form button");
		var headInput = $("#publish-form input[name=heading]");
		var tags = $("#publish-form .tag span");
		var tags_choose=0;
		
		//得到编辑页面的旧的数据
		var oldPost = getOldPost();
		
		//验证文章标题
		headInput.bind("change",function(){
			check_heading();
		});
		
		//手记标签交互获取
		tags.hover(function(){
			this.style.color="red";
			this.style.border = "1px solid red";
		},function(){
			this.style.color="#333";
			this.style.border = "1px solid #ccc";
		});
		
		tags.click(function(){
			if($(this).attr("data-choose")==="false" || $(this).attr("data-choose")===undefined){
				if(tags_choose>=3){//最多可选3个标签
					return;
				}
				$(this).attr("data-choose","true");
				tags_choose = tags_choose+1;
				
				this.style.color="red";
				this.style.border = "1px solid red";
				$(this).attr("data-choose","true");
				$(this).bind("mouseout",function(){
					this.style.color="red";
					this.style.border = "1px solid red";
				});
			}else{
				$(this).attr("data-choose","false");
				tags_choose = tags_choose-1;
				this.style.color="#333";
				this.style.border = "1px solid #ccc";
				$(this).bind("mouseout",function(){
					this.style.color="#333";
					this.style.border = "1px solid #ccc";
				});
			}
		});
		
		//点击发布按钮--将数据保存到后台数据库中
		publishBtn.click(function(){
			var flag = true;
			if(!check_heading){
				flag = false;
			}
			if(!check_content()){
				flag = false;
			}
			if(!check_tags()){
				flag = false;
			}
			
			if(flag){
				if($(this).text().trim() === "发布"){
					var postData = getNewPost();
					$.ajax({
						url : "/publish" ,
						type : "post",
						data : postData,
						success : function(data){
							alert('发布成功！');
							location.href = '/article/page/1';
						},
						error: function(data){ 
							alert('发布失败！');
							location.href = 'error';
						}
					});
				}else if($(this).text().trim() === "修改"){
					if(oldPost !== null){
						var newPost = getNewPost();
						
						if(oldPost.heading===newPost.heading && oldPost.content===newPost.content &&oldPost.tags===newPost.tags){
						   alert("数据未修改");
						   return;
						}else{
							var postData = {
								'oldPost' : JSON.stringify(oldPost),
								'newPost' : JSON.stringify(newPost),
								time : oldPost.date
							};
							
							$.ajax({
								url : "/update" ,
								type : "post",
								data : postData,
								success : function(data){
									alert('修改成功！');
									location.href = '/article/page/1';
								},
								error: function(data){ 
									alert('修改失败！');
									location.href = 'error';
								}
							});	
						}	
					}
				}	
			}	
		});
		
		//得到旧数据
		function getOldPost(){
			if(publishBtn.text().trim() === "修改"){
				var heading = headInput.val().trim().replace(/\n/g, '<br/>');
				var content = $("#publish-form textarea").val().trim().replace(/\n/g, '<br/>');	
                var date = $("#publish-form .tag .date").text().trim();				
				var tags = $("#publish-form .tag .choosed").text().trim();
				
				var oldPost = {
					heading : heading,
					content : content,
					date : date,
					tags : tags
				};
			    return 	oldPost;
			}else{
				return null;
			}
		}
		
		//得到新的文章数据
		function getNewPost(){
			var date = new Date(),
			yy = date.getFullYear(),
			MM = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + parseInt(date.getMonth() + 1),
			dd = date.getDate() > 9 ? date.getDate() : "0" + parseInt(date.getDate()),
			hh = date.getHours() > 9 ? date.getHours() : "0" + parseInt(date.getHours()),
			mm = date.getMinutes() > 9 ? date.getMinutes() : "0" + parseInt(date.getMinutes()),
			ss = date.getSeconds()> 9 ? date.getSeconds() : "0" + parseInt(date.getSeconds());
		
			var tag_val="";	
			var tag = $("#publish-form .tag span[data-choose=true]");
			jQuery.each(tag,function(item){
				tag_val= tag_val + $(tag[item]).text().trim();
				if(item < tag.length-1){
					tag_val = tag_val+",";
				}
			});
				
			var postData = {
				heading : headInput.val().trim().replace(/\n/g, '<br/>'),
				content : $("#publish-form textarea").val().trim().replace(/\n/g, '<br/>'),
				date : yy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss,
				tags : tag_val
			};
			
			return postData;
		};
		
		//验证文章标题
		function check_heading(){
			var heading = headInput.val().trim();
			var reg = /^\S{10,}$/g;
			if(!reg.test(heading)){
				$("#publish-form .tip").eq(0).css("display","block");
				headInput.css("border","1px solid red").css("color","red");
				return false;
			}else{
				$("#publish-form .tip").eq(0).css("display","none");
				headInput.css("border","1px solid #999").css("color","#333");
				return true;
			}
		}
		
		//验证是否大于200字
		function check_content(){
			var content = $("#publish-form textarea").val().trim();
			if(content.length < 200){
				$("#publish-form .tip").eq(1).css("display","block");
				return false;
			}else{
				$("#publish-form .tip").eq(1).css("display","none");
				return true;
			}
		}
	    
		//验证标签选择个数是否符合要求
		function check_tags(){
			if(tags_choose===0){
				$("#publish-form .tip").eq(2).css("display","block");
				return false;
			}else{
				$("#publish-form .tip").eq(2).css("display","none");
				return true;
			}
		}
	};
	
    //删除文章
	function delete_article(){
		var deleteBtn = $(".article-page .articles .delete a");
		deleteBtn.bind("click",function(){
			var time = $(this).attr("data-time").trim();
			
			if (confirm('您确定要删除这篇文章吗？')) {
				$.ajax({
					url : '/delete' ,
					type : "post",
					data : {
						time:time
					},
					success : function(data){
						alert('删除成功！');
						location.href = '/article/page/1';
					},
					error: function(data){ 
						alert('删除失败！');
						location.href = 'error';
					}
				});
			}	
			
		});
	};
});