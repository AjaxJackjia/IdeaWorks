# DB

mysql - ** ideaworks **

# Tables
====================

** Entity: ** user, project, milestone, topic, file, activity.

** Relation: ** project\_member, topic\_discussion.

## Table - user
====================

This table stores user basic information. 

### fields

** id ** - varchar - **主键** - 由字母跟数字组成, 唯一标识user;

** nickname ** - varchar - user在网站上展示的名字, 默认与id相同, 用户可以自行修改;

** signature ** - varchar - 一句话简短介绍自己;

** realname ** - varchar - user的	真实姓名;

** phone ** - varchar - 电话;

** email ** - varchar - 电子邮箱;

** logo ** - varchar - user头像地址(只存文件名, 目录地址通过配置文件来设定);

** usertype ** - tinyint - 本科生/硕士研究生/博士研究生/副教授/教授;

** major ** - varchar - 专业名称; (后面需要改为代号来标识)

** department ** - varchar - 院系; (后面需要改为代号来标识)

** college ** - varchar - 学校; (后面需要改为代号来标识)

** address ** - varchar - 地址;

** introduction ** - varchar - 个人简介;

** interests ** - varchar - 个人兴趣;

** isDeleted ** - tinyint - 是否被删除;

## Table - project
====================

This table stores project basic information. 

### fields

** id ** - integer - **主键** - project唯一标识, 自增;

** title ** - varchar - project标题;

** creator ** - varchar - **外键** - project创建者 (user id);

** advisor ** - varchar - **外键** - project leader (user id);

** abstract ** - varchar - project摘要, 简单介绍;

** status ** - tinyint - project状态, 正在进行/已经结束;

** security ** - smallint - 仿照linux权限管理, (rwx)(rwx)(rwx), 默认为744, project管理员为774, 超级管理员为777;

** logo ** - varchar - project icon地址 (只存文件名, 目录地址通过配置文件来设定);

** createtime ** - timestamp - project创建时间;

** modifytime ** - timestamp - project最新修改时间;

** isDeleted ** - tinyint - 若删除project,则置此field为1;


## Table - milestone
====================

This table stores project milestone. 

### fields

** id ** - integer - **主键** - milestone唯一标识, 自增;

** projectid ** - integer - **外键** - project唯一标识;

** title ** - varchar - milestone标题;

** creator ** - varchar - **外键** - milestone创建者(user id);

** createtime ** - timestamp - milestone创建时间;

** modifytime ** - timestamp - milestone最新修改时间;

** description ** - varchar - milestone简单介绍;


## Table - topic 
====================

This table stores project forum topic detail information. 

### fields

** id ** - integer - **主键** - topic唯一标识, 自增;

** projectid ** - integer - **外键** - project唯一标识;

** title ** - varchar - topic标题;

** creator ** - varchar - **外键** - topic创建者(user id);

** createtime ** - timestamp - topic创建时间;

** modifytime ** - timestamp - topic最新修改时间;

** description ** - varchar - topic简单介绍;


## Table - file 
====================

This table stores project file detail information, but do not store files.

### fields

** id ** - integer - **主键** - file唯一标识, 自增;

** projectid ** - integer - **外键** - project唯一标识;

** filename ** - varchar - 文件名;

** creator ** - varchar - **外键** - 文件创建者(user id);

** createtime ** - timestamp - 文件创建时间;

** description ** - varchar - 文件简单介绍;


## Table - activity 
====================

This table stores project activity log information. 

### fields

** id ** - integer - **主键** - activity唯一标识, 自增;

** projectid ** - integer - **外键** - project唯一标识;

** operator ** - varchar - **外键** - activity执行者;

** title ** - varchar - activity具体动作;

** time ** - timestamp - activity创建时间;


## Table - project\_member 
====================

This table stores project members. 

### fields

** projectid ** - integer - **主键** - project唯一标识;

** userid ** - varchar - **主键** - user唯一标识;

** jointime ** - timestamp - 参与project时间;


## Table - topic\_discussion 
====================

This table stores project forum topic discussion detail information. 

### fields

** messageid ** - integer - **主键** - discussion message唯一标识, 自增;

** topicid ** - integer - **外键** - topic唯一标识;

** operator ** - varchar- **外键** - message作者;

** time ** - timestamp - 发出message时间;

** msg ** - varchar - message具体内容;


