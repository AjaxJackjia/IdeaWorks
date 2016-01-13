# backbone.js modification

因为model的save方法,后台接收不到post参数,所以为了适应需求,将backbone源码做如下改动:

1. 第``69``行代码, 改为``Backbone.emulateJSON = true;``;

2. 注释掉backbone.js第``1382``行代码, 添加``1383``行代码, 如下所示:

```	
//params.data = params.data ? {model: params.data} : {};
params.data = params.data ? JSON.parse(params.data) : {};
```

# mysql中文乱码问题

统一设置数据库client/db/server的编码为utf-8, 保证写入和读出的解析规则是一样的.

修改``/etc/mysql/my.cnf``, 在``[mysqld]``最后加上如下代码:

```
character-set-server=utf8
collation-server=utf8_unicode_ci
```
然后重启mysql服务, ``sudo service mysql restart``. 


# backbone model save时总是发送到POST请求

原因是model在fetch的时候没有设置id, 当model没有id的时候, save触发的是create操作, 所以是发到post请求那边. 为了避免这种情况, 我们在fetch或者save的时候利用parse函数, 将model的id提前设置.


# backbone collection更新多个model怎么办?

找到的方案是为collection增加一个save方法, 里面重写Backbone的sync方法, 自己设定参数(create, update, delete等), 然后调用重写sync方法来作用. 本质上其实是增加一个wrapper, 将collection里面要操作的model写到一个model里面(BulkModel), 然后对BulkModel设定url与toJSON方法, 最后作用的是BulkModel.

# 使用jersey上传文件后台总是要么接收不到参数，要么解析不出来？

后面试了查了N多资料才知道，是因为少两个package，一个是与jersey-core 1.17兼容的jersey multipart 1.17，这个包是jersey解析mime type使用到的包，另一个是jersey multipart使用的mimepull包，这个包不能用1.6版本，1.5版本才可以运行。

# model fetch，save，destroy options中函数参数顺序

fetch option中的参数顺序为 model, response, options；

save option中的参数顺序为 model, response, options；

destroy option中的参数顺序为 model, response, options；

# collection fetch，create中options参数顺序

fetch option中的参数顺序为 collection, response, options；

create option中的参数顺序为 ？；

调用save方法的话(直接降级为一个ajax调用)，option中的参数顺序为 response， error，type，例：error中参数返回 Object，error，Unauthorized

# 网站部署

1. mysql数据恢复;
2. 备份根目录下的uploads文件夹(注明日期);
3. 打包war并上传到网站;
4. 使用之前备份的uploads文件夹恢复内容;
5. 测试网站可用性;

# 163邮箱发信失败报550错误

1. 需要将手机与163邮箱绑定，并且在设置中开启客户端授权密码；
2. 在后台程序中，需要将客户端授权密码当做邮箱密码来使用进行发信；
3. 发信测试成功；

PS: 在国内使用163账号测试发邮件没有问题，当把程序部署到东京服务器的时候，后台发送邮件时与163服务器连接超时，导致发信失败；此时需要考虑到国际环境，所以后面换成了Gmail账号，测试发信成功，如果是测试程序在国内的话，gmail发邮件是不行的，国内连接超时。所以邮件需要看最终部署的地方，国内的话，建议国内邮件服务；国外的话，建议Gmail邮件服务。





