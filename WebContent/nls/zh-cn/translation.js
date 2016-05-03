define({
    //portal module
    'portal': {
        'HeaderView': {
        	'HOME': '主页',
			'NEWS': '新闻',
			'PROJECTS': '项目',
			'LOGIN': '登录'
        },
        'FooterView': {
        	'HELP_CENTER': '帮助中心',
        	'ABOUT_US': '关于我们',
        	'CONTACT_US': '联系我们'
        },
        'AboutView': {
        	'TITLE': '关于我们',
        	'TEAM_TITLE': '团队',
        	'HISTORY_TITLE': '历史',
        	'FUTURE_TITLE': '未来'
        },
        'ContactView': {
        	'TITLE': '联系我们',
        	'LOCATION_TITLE': '地址',
        	'WORKING_TIME_TITLE': '工作时间',
        	'CONTACT_PERSON_TITLE': '联系人'
        },
        'HelpView': {
        	'TITLE': '在线帮助',
        	'REGISTER_TITLE': '怎样注册',
        	'JOIN_PROJECT_TITLE': '怎样加入项目'
        },
        'IntroductionView': {
        	'DETAIL_INFORMATION': '详细信息'
        },
        'NewsListView': {
        	'READ_MORE': '更多 '
        },
        'NewsView': {
        	'NEWS_NOT_FOUND': '您所查看的新闻不存在...',
        	'DETAIL_INFORMATION': '详细信息'
        },
        'ProjectListView': {
        	'READ_MORE': '更多 '
        },
        'ProjectView': {
        	'PROJECTS_NOT_FOUND': '您所查看的项目不存在...',
        	'DETAIL_INFORMATION': '详细信息'
        },
        'PortalBodyView': {
        	'WELCOME_TITLE': '欢迎来到IdeaWorks!',
        	'READ_MORE': '更多 ',
        	'FIND_NEW_IDEAS': '寻找新奇创意',
        	'HILIGHT_INSPIRATION': '碰撞智慧火花',
        	'SHARE_WITH_PEOPLE': '方便与人分享',
        	'LATEST_NEWS': '最新新闻',
        	'POPULAR_PROJECTS': '最受欢迎项目',
        	'MICROSCOPE_TITLE': '发现 & 创新 & 合作',
        	'JOINUS_TITLE': '美妙的IdeaWorks!',
        	'TRY_NOW': '现在体验!'
        }
    },
    
    /*
     * login module
     * */
    'login': {
    	'main': {
    		'SIGNIN_TITLE': '登录',
    		'SIGNUP_TITLE': '注册',
    		'SIGNIN_HTML_TITLE': '登录 :: IdeaWorks',
    		'SIGNUP_HTML_TITLE': '注册 :: IdeaWorks'
    	},
    	'SigninView': {
    		'USERNAME': '请输入用户名...',
    		'PASSWORD': '请输入密码...',
    		'CHECK_USERNAME_OR_PWD_EMPTY': '用户名或密码不能为空.',
    		'SIGN_IN': '登&nbsp;&nbsp;录',
    		'SIGNING_IN': '登录中...',
    		'FORGET_PWD': '忘记密码?',
    		'SIGN_IN_WITH': '使用其他账号登录:',
    		'SIGN_IN_WITH_WECHAT': '使用微信账号登录'
    	},
    	'SignupView': {
    		'SIGN_UP': '注&nbsp;&nbsp;册',
    		'SIGNING_UP': '注册中...',
    		'USERNAME_TITLE': '用户名:',
    		'USERNAME_HOLDER': '请输入用户名...',
    		'PASSWORD_TITLE': '密码:',
    		'PASSWORD_HOLDER': '请输入密码...',
    		'PASSWORD_CONFIRM_TITLE': '密码确认:',
    		'PASSWORD_CONFIRM_HOLDER': '请再一次输入密码...',
    		'USERTYPE_TITLE': '用户类型:',
    		'EMAIL_TITLE': '邮箱:',
    		'EMAIL_HOLDER': '请输入邮箱...',
    		'CHECK_USERNAME_EMPTY': '用户名为必填项',
    		'CHECK_USERNAME_VALID': '用户名必须只能包含小写字母和数字',
    		'CHECK_USERNAME_LENGTH': '用户名长度必须小于30个字符',
    		'CHECK_PWD_EMPTY': '密码为必填项',
    		'CHECK_PWD_CONFIRM': '密码两次输入不一致',
    		'CHECK_PWD_LENGTH': '密码必须大于6个字符',
    		'CHECK_EMAIL_EMPTY': '邮箱为必填项',
    		'CHECK_EMAIL_VALID': '不是有效邮箱',
    		'STUDENT': '学生',
    		'FACULTY': '教职员工',
    		'INDUSTRICAL_PARTICIPANT': '工业界人士',
    		'GOVERNMENT': '政府人员',
    		'OTHERS': '其他',
    		'SIGN_UP_SUCCESS': '注册成功!请使用刚才注册的用户名密码登录.',
    	},
    	'ForgetPasswordSubView': {
    		'TITLE': '忘记密码',
    		'USER_ID': '用户名:',
    		'USER_ID_HOLDER':'请输入你的用户名...',
    		'EMAIL': '邮箱: ',
    		'EMAIL_HOLDER': '请输入你在注册时用的邮箱...',
    		'CANCEL': '取消',
    		'CONFIRM': '确认',
    		'SUCCESS': '账户新密码已经发送到您的邮箱，请您尽快查收!',
    		'CHECK_USERNAME_EMPTY': '用户名为必填项',
    		'CHECK_USERNAME_VALID': '用户名必须只能包含小写字母和数字',
    		'CHECK_USERNAME_LENGTH': '用户名长度必须小于30个字符',
    		'CHECK_EMAIL_EMPTY': '邮箱为必填项',
    		'CHECK_EMAIL_VALID': '不是有效邮箱'
    	}
    },
    
    /*
     * user center module
     * */
    'my': {
    	'activity': {
    		//action
    		'CREATE': '创建',
    		'MODIFY': '修改',
    		'READ': '读取',
    		'DELETE': '删除',
    		'JOIN': '加入',
    		'REMOVE': '移除',
    		'LEAVE': '离开',
    		'UPLOAD': '上传',
    		'REPLY': '回复',
    		'APPLY': '申请',
    		'REJECT': '拒绝',
    		'AGREE': '同意',
    		//entity
    		'PROJECT': '项目',
    		'MEMBER': '成员',
    		'MILESTONE': '里程碑',
    		'TOPIC': '话题',
    		'MESSAGE': '消息',
    		'FILE': '文件',
    		'APPLICATION': '申请',
    		'TITLE': '题目',
    		'ADVISOR': '指导教授',
    		'ABSTRACT': '摘要',
    		'LOGO': '头像',
    		'STATUS': '状态',
    		'SECURITY': '安全性',
    		'DESCRIPTION': '描述',
    		//assist
    		'UNKNOWN': '未知',
    		'OF': '的',
    		'IN': '在',
    		'FROM': '从',
    		'TO': '改为',
    		'THIS': '这个',
    		'WITH': '和',
    		'YOU': '你',
    		'ONGOING': '正在进行',
    		'COMPLETE': '已结束',
    		'PUBLIC': '公开',
    		'GROUP': '仅对组员开放'
    	},
    	'dashboard': {
    		'BriefView': {
    			'PROJECTS': '项目',
    			'ACTIVITIES': '活动',
    			'RELATED_MEMBERS': '相关组员',
    			'FORUM_PARTICIPATIONS': '话题参与度'
    		},
    		'PopularTopicView': {
    			'POPULAR_TOPICS': '参与的话题',
    			'MSG': ' 条消息',
    			'MSGS': ' 条消息',
    			'NO_TOPICS': '没有相关话题...'
    		},
    		'RecentActivityView': {
    			'RECENT_ACTIVITIES': '参与项目中的最新动态',
    			'NO_ACTIVITIES': '没有最新动态...'
    		}
    	},
    	'notification': {
    		'NotificationSideView': {
    			'NOTIFICATIONS': '项目通知  ',
    			'NO_NOTIFICATIONS': '暂无通知...',
    			'CLOSE_NOTIFICATION': '关闭通知窗口',
    			'FETCH_NOTIFICATION_ERROR': '获取用户通知失败,请稍后重试.',
    			'LOAD_MORE': '加载更多...'
    		},
    		'NotificationItemView': {
    			'MARK_READ_ERROR': '标记通知已读失败,请稍后重试.',
    			'IN_PROJECT': '在项目  '
    		}
    	},
    	'advice': {
    		'CHECK_NOT_EMPTY': '反馈内容不能为空!',
    		'CHECK_LENGTH': '反馈内容最长为300字!',
    		'FEEDBACK_EEROR': '反馈失败，请稍后重试.',
    		'ADVICE_THANKYOU': '谢谢您的反馈，我们会努力改进!',
			'ADVICE_TITLE': '意见 & 建议',
			'ADVICE_CONTENT_TITLE': '请输入您宝贵的意见或者建议...',
			'CANCEL': '取消',
			'CONFIRM': '提交',
    	},
    	'projects': {
    		'ProjectListView': {
    			'NO_PROJECTS': '暂无项目...',
    			'CREATE_PROJECT_ERROR': '创建项目失败,请稍后重试.',
    			'DELETE_PROJECT_ERROR': '删除项目失败,请稍后重试.',
    			'EXIT_PROJECT_ERROR': '退出项目失败,请稍后重试.'
    		},
    		'ProjectListItemView': {
    			'ONGOING': '正在进行',
    			'COMPLETE': '已结束',
    			'UNKNOWN': '未知',
    		},
    		'ProjectDetailView': {
    			//detail info
    			'ADVISOR': '指导教授',
    			'CREATOR': '创建者',
    			'CREATE_TIME': '创建时间',
    			//menu list
    			'ABSTRACT': '摘要',
    			'MEMBERS': '成员',
    			'MILESTONE': '里程碑',
    			'FORUM': '论坛',
    			'FILES': '文件',
    			'ACTIVITY': '动态',
    			//提示
    			'NO_PROJECT_SELECT': '未选择项目...',
    			'FETCH_MEMBERS_ERROR': '获取项目成员失败,请稍后重试.',
    			'FETCH_MILESTONES_ERROR': '获取项目里程碑失败,请稍后重试.',
    			'FETCH_TOPICS_ERROR': '获取项目论坛话题失败,请稍后重试.',
    			'FETCH_FILES_ERROR': '获取项目文件失败,请稍后重试.',
    			'FETCH_ACTIVITIES_ERROR': '获取项目动态失败,请稍后重试.',
    			'EXIT_PROJECT_CONFIRM': '确定退出此项目吗?',
    			'DELETE_PROJECT_CONFIRM': '确定删除此项目吗?',
    			//project menu
    			'PROJECT_MENU': '项目菜单',
    			'PROJECT_MENU_EDIT': '编辑项目',
    			'PROJECT_MENU_LOGO': '修改图标',
    			'PROJECT_MENU_STATUS': '修改状态',
    			'PROJECT_MENU_SECURITY': '安全设置',
    			'PROJECT_MENU_APPLICATION': '申请管理',
    			'PROJECT_MENU_DELETE_PROJECT': '删除项目',
    			'PROJECT_MENU_EXIT_PROJECT': '退出项目',
    			//LogoUploadSubView 子页面提示
    			'UPLOAD_SUCCESS': '上传成功!',
    			'UPLOAD_LOGO_ERROR': '上传项目图标失败,请稍后重试.',
    			'CHECK_ALERT_EMPTY': '请选择你需要上传的图标.',
    			'CHECK_ALERT_MAX_SIZE': '上传文件大小的最大值为300k!',
    			'CHECK_ALERT_FILE_TYPE': '不支持当前的文件类型',
    			'CHECK_ALERT_BROWSER': '请使用Chrome浏览器或者Firefox浏览器来上传图标',
    			'CHANGE_PROJECT_LOGO': '修改项目图标',
    			'UPLOAD': '上传',
    			'UPLOAD_FILE': '文件:',
    			'UPLOAD_TIPS': '(支持的最大上传文件大小为300k. 支持的文件类型: gif, jpeg, jpg, png)',
    			//ProjectStatusSubView 子页面提示
    			'UPDATE_STATUS_ERROR': '更新项目状态失败,请稍后重试.',
    			'PROJECT_STATUS': '项目状态',
    			'PROJECT_STATUS_SAVE': '保存',
    			'PROJECT_STATUS_CANCEL': '取消',
    			'PROJECT_STATUS_ONGOING': '正在进行',
    			'PROJECT_STATUS_COMPLETE': '已结束',
    			//ProjectSecuritySubView 子页面提示
    			'UPDATE_SECURITY_ERROR': '更新项目安全设置失败,请稍后重试.',
    			'PROJECT_SECURITY': '项目安全设置',
    			'PROJECT_SECURITY_SAVE': '保存',
    			'PROJECT_SECURITY_CANCEL': '取消',
    			'PROJECT_SECURITY_PUBLIC': '项目细节对所有人公开',
    			'PROJECT_SECURITY_GROUP': '项目细节只对项目组员公开',
    			//ProjectApplicationSubView 子页面提示
    			'FETCH_APPLICATIONS_ERROR': '获取项目申请失败,请稍后重试.',
    			'UPDATE_APPLICATIONS_ERROR' : '更新项目申请状态,请稍后重试.',
    			'PROJECT_APPLICATION': '项目申请',
    			'PROJECT_APPLICATION_PROPOSER': '申请提出者',
    			'PROJECT_APPLICATION_MESSAGE': '备注',
    			'PROJECT_APPLICATION_APPLY_TIME': '申请加入时间',
    			'PROJECT_APPLICATION_STATUS': '申请状态',
    			'PROJECT_APPLICATION_ACTION': '操作',
    			'PROJECT_NO_APPLICATIONS': '暂无申请',
    			'PROJECT_APPLICATION_APPLIED': '已申请',
    			'PROJECT_APPLICATION_PASSED': '已通过',
    			'PROJECT_APPLICATION_REJECTED': '已拒绝',
    			'PROJECT_APPLICATION_UNKNOWN': '未知',
    			'PROJECT_APPLICATION_AGREE': '同意',
    			'PROJECT_APPLICATION_AGREE_CONFIRM': '确定同意这个申请吗?',
    			'PROJECT_APPLICATION_REJECT': '拒绝',
    			'PROJECT_APPLICATION_REJECT_CONFIRM': '确定拒绝这个申请吗?'
    		},
    		'ProjectDetailModifyView': {
    			'CHECK_TITLE': '项目标题必填',
    			'CHECK_ADVISOR': '指导教授必填',
    			'CREATE_PROJECT': '创建项目',
    			'EDIT_PROJECT': '修改项目',
    			'CREATE': '创建',
    			'SAVE': '保存',
    			'CANCEL': '取消',
    			'UPDATE_PROJECT_ERROR': '修改项目失败，请稍后重试.',
    			'TITLE': '标题:',
    			'TITLE_PLACEHOLDER': '项目标题...',
    			'ADVISOR': '指导教授:',
    		},
    		'ProjectDetailAbstractView': {
    			'NO_ABSTRACT': '暂无摘要...',
    			'EDIT_ABSTRACT': '编辑摘要',
    			'EDIT_ABSTRACT_TIPS': '请描述一下你的项目...',
    			'UPDATE_ABSTRACT_ERROR': '更新项目摘要失败，请稍后重试.',
    			'MODIFY_ABSTRACT_TITLE': '修改项目摘要',
    			'CANCEL': '取消',
    			'SAVE': '保存'
    		},
    		'ProjectDetailMembersView': {
    			'ADVISOR': '指导教授',
    			'ADVISOR_PLACEHOLDER': '暂无指导教授...',
    			'MEMBERS': '组员',
    			'MEMBERS_PLACEHOLDER': '暂无组员...',
    			//AddMemberSubView 子页面
    			'ADD_PROJECT_MEMBERS_ERROR': '增加项目成员失败，请稍后重试.',
    			'INVITE_MEMBERS': '邀请会员',
    			'CANCEL': '取消',
    			'INVITE': '邀请',
    			//MemberDetailSubView 子页面
    			'FETCH_MEMBER_ERROR': '获取成员信息失败，请稍后重试.',
    			'MEMBER_DETAIL_INFORMATION': '成员详细信息',
    			'OK': '&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;',
    			'DETAIL_SIGNATURE_EMPTY': '签名为空...',
    			'DETAIL_REALNAME': '真实姓名: ',
    			'DETAIL_PHONE': '电话: ',
    			'DETAIL_EMAIL': '邮箱: ',
    			'DETAIL_SKYPE': 'Skype账号: ',
    			'DETAIL_WECHAT': '微信账号: ',
    			'DETAIL_MAJOR': '专长: ',
    			'DETAIL_DEPARTMENT': '院系: ',
    			'DETAIL_COLLEGE': '大学: ',
    			'DETAIL_ADDRESS': '地址: ',
    			'DETAIL_INTERESTS': '兴趣: ',
    			'DETAIL_INTRODUCTION': '自我介绍: ',
    			'DETAIL_PRIVACY_TIPS': '由于该成员的隐私设置，你无法浏览他/她的详细信息... '
    		},
    		'ProjectDetailMilestoneView': {
    			'CERATE_MILESTONE_ERROR': '创建里程碑失败,请稍后重试.',
    			'DELETE_MILESTONE_ERROR': '删除里程碑失败,请稍后重试.',
    			'ADD_NEW_MILESTONE': '创建新的里程碑',
    			//CreateMilestoneSubView 子页面
    			'CREATE_MILESTONE': '创建里程碑',
    			'CREATE': '创建',
    			'CANCEL': '取消',
    			'CREATE_TITLE': '标题:',
    			'CREATE_TITLE_HOLDER': '里程碑标题...',
    			'CREATE_DESCRIPTION': '描述:',
    			'CREATE_DESCRIPTION_HOLDER': '里程碑描述...',
    			'CHECK_MILESTONE_TITLE': '里程碑标题是必填项',
    			'CHECK_MILESTONE_DESCRIPTION': '里程碑描述是必填项'
    		},
    		'ProjectDetailMilestoneItemView': {
    			'DELETE_CONFIRM': '确定要删除这个里程碑?',
    			'EDIT': '编辑',
    			'DELETE': '删除',
    			'DESCRIPTION': '描述',
    			'SHOW_DETAIL': '展示里程碑细节',
    			'CREATE_AT': ' 创建这个里程碑于 ',
    			//ModifyMilestoneSubView 子页面
    			'MODIFY_MILESTONE': '修改里程碑',
    			'CANCEL': '取消',
    			'SAVE': '保存',
    			'MODIFY_TITLE': '标题:',
    			'MODIFY_TITLE_HOLDER': '里程碑标题...',
    			'MODIFY_DESCRIPTION': '描述:',
    			'MODIFY_DESCRIPTION_HOLDER': '里程碑描述...',
    			'CHECK_MILESTONE_TITLE': '里程碑标题是必填项',
    			'CHECK_MILESTONE_DESCRIPTION': '里程碑描述是必填项',
    			'UPDATE_MILESTONE_ERROR': '更新里程碑失败,请稍后重试.'
    		},
    		'ProjectDetailForumView': {
    			'CERATE_TOPIC_ERROR': '创建话题失败,请稍后重试.',
    			'DELETE_TOPIC_ERROR': '删除话题失败,请稍后重试.',
    			'ADD_NEW_TOPIC': '创建新话题',
    			//CreateTopicSubView 子页面
    			'CHECK_TOPIC_TITLE': '话题标题是必填项',
    			'CHECK_TOPIC_DESCRIPTION': '话题描述是必填项',
    			'CREATE_TOPIC': '创建话题',
    			'CANCEL': '取消',
    			'CREATE': '创建',
    			'CREATE_TITLE': '标题:',
    			'CREATE_TITLE_HOLDER': '话题标题...',
    			'CREATE_DESCRIPTION': '描述:',
    			'CREATE_DESCRIPTION_HOLDER': '话题描述...'
    		},
    		'ProjectDetailForumTopicView': {
    			'DELETE_CONFIRM': '确定删除这个话题?',
    			'SHOW_DETAIL': '展示话题细节',
    			'CREATE_AT': ' 创建这个话题于 ',
    			'EDIT': '编辑',
    			'DELETE': '删除',
    			'DESCRIPTION': '描述',
    			//ModifyTopicSubView 子页面
    			'CHECK_TOPIC_TITLE': '话题标题是必填项',
    			'CHECK_TOPIC_DESCRIPTION': '话题描述是必填项',
    			'UPDATE_MILESTONE_ERROR': '更新话题失败,请稍后重试.',
    			'MODIFY_TOPIC': '修改话题',
    			'CANCEL': '取消',
    			'SAVE': '保存',
    			'MODIFY_TITLE': '标题:',
    			'MODIFY_TITLE_HOLDER': '话题标题...',
    			'MODIFY_DESCRIPTION': '描述:',
    			'MODIFY_DESCRIPTION_HOLDER': '话题描述...'
    		},
    		'ProjectDetailForumTopicMessageView': {
    			'DISCUSSION': '讨论',
    			'REFRESH_TIPS': '刷新最新消息',
    			'NO_DISCUSSION': '暂无讨论...',
    			'SAY_STH': '说点什么...',
    			'COMMENT': '评论',
    			'CREATE_COMMENT_ERROR': '创建评论失败,请稍后重试.',
    			'DELETE_COMMENT_ERROR': '删除评论失败,请稍后重试.',
    			'MSG_CANT_EMPTY': '消息不能为空',
    			'FETCH_MSG_ERROR': '获取消息失败,请稍后重试.',
    			'DELETE_MSG_CONFIRM': '确定删除此评论?',
    			//ReplyMessageSubView 子页面
    			'TOTAL': '总共',
    			'FETCH_REPLY_MSG_ERROR': '获取评论回复列表失败,请稍后重试.',
    			'NO_REPLY': '暂无回复...',
    			'CREATE_REPLY_MSG_ERROR': '创建回复失败,请稍后重试.',
    			'DELETE_REPLY_MSG_ERROR': '删除回复失败,请稍后重试.',
    			'REPLY_TO': '回复 : ',
    			'REPLY_DISCUSSION_MSG': '回复评论消息',
    			'CANCEL': '取消',
    			'MESSAGE': '评论: ',
    			'REPLIES': '回复: ',
    			'REPLY_STH': '回复点什么...'
    		},
    		'ProjectDetailFilesView': {
    			'UPLOAD_FILE': '上传文件',
    			'NO_FILES': '暂无文件...',
    			'UPLOAD_COMPLETE': '上传成功!',
    			'FETCH_FILES_ERROR': '获取文件列表失败,请稍后重试.',
    			'UPLOAD_FILE_ERROR': '上传文件失败,请稍后重试.',
    			'DELETE_FILE_ERROR': '删除文件失败,请稍后重试.',
    			//UploadSubView 子页面
    			'CHECK_EMPTY_MSG': '请选择你需要上传的文件',
    			'CHECK_MAX_SIZE_MSG': '上传文件的最大大小为50M!',
    			'CHECK_FILE_TYPE_MSG': '该文件类型不支持上传.',
    			'CHECK_BROWSER_MSG': '请使用Chrome或Firefox浏览器进行文件上传.',
    			'UPLOAD_TITLE': '文件上传',
    			'UPLOAD': '上传',
    			'FILE': '文件:',
    			'UPLOAD_TIPS': '(文件最大上传大小为50M. 支持的文件类型有: doc, docx, xls, xlsx, ppt, pptx, pdf, zip, rar, txt, gif, jpeg, jpg, png)',
    			'DESCRIPTION': '描述:',
    			'DESCRIPTION_HOLDER': '文件描述...'
    		},
    		'ProjectDetailFileItemView': {
    			'DELETE_FILE_CONFIRM': '确定要删除这个文件?',
    			'DELETE_FILE_TIPS': '删除文件',
    			'DOWNLOAD_FILE': '下载该文件',
    			//FileDetailSubView 子页面
    			'FILE_DETAIL_INFO': '文件详情信息',
    			'OK': '&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;',
    			'FILE_NAME': '文件名:',
    			'FILE_SIZE': '文件大小:',
    			'CREATOR': '创建者:',
    			'CREATE_TIME': '创建时间:',
    			'DESCRIPTION': '描述:'
    		},
    		'ProjectDetailActivityView': {
    			'LOAD_MORE': '加载更多...'
    		}
    	},
    	'search': {
    		'SearchMainView': {
    			'PROJECT': '项目',
    			'PERSON': '人',
    			'NO_RESULT': '暂无搜索结果...'
    		},
    		'ProjectSearchView': {
    			'SEARCH_PROJECT_ERROR': '检索项目失败,请稍后重试.',
    			'SEARCH_NO_PROJECT': '检索项目暂无结果...'
    		},
    		'ProjectItemView': {
    			'ALREADY_JOIN_PROJECT': '你已经加入到该项目中...',
    			'ALREADY_SEND_REQUEST': '你已经发送申请到相关工作人员,请耐心等待通知...',
    			'SEND_COMPLETE': '已经发送通知',
    			'JOIN_PROJECT_ERROR': '加入项目失败,请稍后重试.',
    			'ONGOING': '正在进行',
    			'COMPLETE': '已结束',
    			'UNCLEAR': '未知',
    			'DETAIL': '详情',
    			'JOIN': '申请加入',
    			'JOINED': '已加入',
    			'CREATE_AT': '创建于 ',
    			//SearchProjectDetailSubView 子页面
    			'FETCH_PROJECT_FAILED': '获取项目信息失败,请稍后重试.',
    			'PROJECT_DETAIL_INFO': '项目详细信息',
    			'OK': '&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;',
    			'PROJECT_TITLE': '标题:',
    			'PROJECT_STATUS': '状态:',
    			'PROJECT_CREATE_TIME': '创建时间:',
    			'PROJECT_ADVISOR': '指导教授:',
    			'PROJECT_CREATOR': '创建者:',
    			'PROJECT_ABSTRACT': '摘要:',
    			'PROJECT_PRIVACY_TIPS': '因为项目安全隐私设置,在你加入到该项目之前,你暂时无法浏览该项目细节... '
    		},
    		'PersonSearchView': {
    			'SEARCH_PERSON_ERROR': '检索人员失败,请稍后重试.',
    			'SEARCH_NO_PERSON': '检索人员暂无结果...'
    		},
    		'PersonItemView': {
    			'DETAIL': '详情',
    			//SearchPersonDetailSubView 子页面
    			'FETCH_PERSON_FAILED': '获取人员信息失败,请稍后重试.',
    			'PERSON_DETAIL_INFO': '人员详情信息',
    			'OK': '&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;',
    			'DETAIL_SIGNATURE_EMPTY': '签名为空...',
    			'DETAIL_REALNAME': '真实姓名: ',
    			'DETAIL_PHONE': '电话: ',
    			'DETAIL_EMAIL': '邮箱: ',
    			'DETAIL_SKYPE': 'Skype账号: ',
    			'DETAIL_WECHAT': '微信账号: ',
    			'DETAIL_MAJOR': '专长: ',
    			'DETAIL_DEPARTMENT': '院系: ',
    			'DETAIL_COLLEGE': '大学: ',
    			'DETAIL_ADDRESS': '地址: ',
    			'DETAIL_INTERESTS': '兴趣: ',
    			'DETAIL_INTRODUCTION': '自我介绍: ',
    			'DETAIL_PRIVACY_TIPS': '由于该成员的隐私设置，你无法浏览他/她的详细信息... '
    		}
    	},
    	'settings': {
    		'SettingListView': {
    			'PROFILE': '个人信息',
    			'NOTIFICATION': '通知设置',
    			'PRIVACY_SETTINGS': '隐私设置',
    			'ADVANCED_SETTINGS': '高级设置'
    		},
    		'SettingDetailView': {
    			'FETCH_PROFILE_ERROR': '获取用户信息失败,请稍后重试.',
    		},
    		'SettingDetaiProfilelView': {
    			'MORE_ACTIONS': '更多操作',
    			'EDIT_SIGNATURE': '编辑签名',
    			'EDIT_PROFILE': '编辑个人信息',
    			'LOGO': '编辑个人头像',
    			'CHANGE_PWD': '修改密码',
    			'SAY_STH': '签名为空...',
    			'DETAIL_USER_ID': '用户ID:',
    			'DETAIL_NICKNAME': '昵称:',
    			'DETAIL_REALNAME': '真实姓名: ',
    			'DETAIL_PHONE': '电话: ',
    			'DETAIL_EMAIL': '邮箱: ',
    			'DETAIL_SKYPE': 'Skype账号:',
    			'DETAIL_WECHAT': '微信账号: ',
    			'DETAIL_USER_TYPE': '用户类型:',
    			'DETAIL_MAJOR': '专业: ',
    			'DETAIL_DEPARTMENT': '院系: ',
    			'DETAIL_COLLEGE': '大学: ',
    			'DETAIL_ADDRESS': '地址: ',
    			'DETAIL_INTERESTS': '地址: ',
    			'DETAIL_INTRODUCTION': '自我介绍: ',
    			'CANCEL': '取消',
    			'SAVE': '保存',
    			'UPLOAD': '上传',
    			//EditSignatureSubView 子页面
    			'UPDATE_SIGNATURE_ERROR': '修改签名失败,请稍后重试.',
    			'EDIT_SIGNATURE': '编辑签名',
    			'SIGNATURE_TITLE': '签名:',
    			//LogoUploadSubView 子页面
    			'UPLOAD_COMPLETE': '上传成功',
    			'UPLOAD_LOGO_ERROR': '上传头像失败,请稍后重试.',
    			'CHECK_ALERT_EMPTY': '请选择你需要上传的头像.',
    			'CHECK_ALERT_MAX_SIZE': '文件大小最大为300k.',
    			'CHECK_ALERT_FILE_TYPE': '文件格式暂不支持.',
    			'CHECK_ALERT_BROWSER': '请使用Chrome浏览器或者Firefox浏览器来上传文件.',
    			'CHANGE_USER_LOGO': '修改头像',
    			'FILE': '文件:',
    			'UPLOAD_TIPS': '(支持的最大文件大小为300k.支持的文件类型有:gif, jpeg, jpg, png)',
    			//EditProfileSubView 子页面
    			'CHECK_NICKNAME': '昵称不能为空',
    			'CHECK_NICKNAME_LENGTH': '昵称必须小于30个字母',
    			'UPDATE_PROFILE_ERROR': '修改个人信息失败,请稍后重试.',
    			'EDIT_PROFILE': '修改个人信息',
    			//ChangePasswordSubView 子页面
    			'CHECK_OLD_PWD': '旧密码不能为空',
    			'CHECK_NEW_PWD': '新密码不能为空',
    			'CHECK_PWD_CONFIRM': '两次输入的密码不一致',
    			'CHECK_PWD_LENGTH': '密码必须大于6个字母',
    			'UPDATE_PWD_SUCCESS': '密码修改成功',
    			'UPDATE_PWD_ERROR': '密码修改失败,请稍后重试.',
    			'CHANGE_PWD': '修改密码',
    			'OLD_PWD': '旧密码:',
    			'OLD_PWD_HOLDER': '旧密码...',
    			'NEW_PWD': '新密码:',
    			'NEW_PWD_HOLDER': '新密码...',
    			'NEW_PWD_AGAIN': '新密码确认:',
    			'NEW_PWD_AGAIN_HOLDER': '新密码确认...'
    		},
    		'SettingDetailNotificationView': {
    			'NOTIFICATION_PROJECTS': '项目变化通知',
    			'NOTIFICATION_MEMBERS': '项目成员变化通知',
    			'NOTIFICATION_MILESTONES': '项目里程碑变化通知',
    			'NOTIFICATION_FORUMS': '项目话题变化通知',
    			'NOTIFICATION_DISCUSSIONS': '项目话题讨论变化通知',
    			'NOTIFICATION_FILES': '项目文件变化通知',
    			'SET_COMPLETE': '设置成功!',
    			'SET_NOTIFICATION_ERROR': '设置通知失败,请稍后重试.'
    		},
    		'SettingDetailPrivacyView': {
    			'PRIVACY_SELF': '个人信息仅对自己可见',
    			'PRIVACY_PROJECT_ADVISOR': '个人信息仅对项目指导教授可见',
    			'PRIVACY_GROUP_MEMBER': '个人信息仅对项目组员可见',
    			'PRIVACY_PUBLIC': '个人信息对所有人可见',
    			'SET_COMPLETE': '设置成功!',
    			'SET_PRIVACY_ERROR': '设置隐私失败,请稍后重试.'
    		},
    		'SettingDetailAdvancedView': {
    			'SYNC': '系统邮件同步通知',
    			'SELECT_LNG': '选择语言',
    			'SET_COMPLETE': '设置成功! 设置将会在网页自动刷新后生效.',
    			'SET_ADVANCED_ERROR': '设置失败,请稍后重试.'
    		}
    	},
    	'chat': {
    		'AddChatView': {
    			'NEW_IM_TITLE': '新建站内信',
    			'IM_MSG_TAB_TITLE': '群组消息',
    			'IM_MSG_TITLE': '标题:',
    			'IM_MSG_TITLE_PLACEHOLDER': '群组标题...',
    			'IM_MSG_MEMBERS': '成员: (双击左侧成员列表来添加用户)',
    			'IM_MSG_MEMBERS_SEARCH': '查找成员...',
    			'IM_MSG_MEMBERS_LOAD_MORE': '加载更多...',
    			'IM_MSG_ADD_MEMBERS_TIPS': '双击左侧成员列表来添加用户',
    			'IM_MSG_EMAIL_TIPS': '同时通过邮件发送创建通知',
    			'IM_MSG_CANCEL': '取消',
    			'IM_MSG_CREATE': '创建',
    			'IM_MSG_CREATE_TITLE_CHECK': '请输入群组标题...',
    			'IM_MSG_CREATE_MEMBER_CHECK': '请选择成员...',
    			'IM_MSG_CREATE_MEMBER_NUM_CHECK': '成员数量最大为200!',
    			'IM_MSG_CREATE_NO_MEMBER': '暂无成员...',
    			'IM_ANNOUNCEMENT_TAB_TITLE': '公告',
    			'IM_ANNOUNCEMENT_TITLE': '标题:',
    			'IM_ANNOUNCEMENT_TITLE_PLACEHOLDER': '公告标题...',
    			'IM_ANNOUNCEMENT_TO': '发送给:',
    			'IM_ANNOUNCEMENT_TO_ALL_MEMBERS': '所有成员',
    			'IM_ANNOUNCEMENT_TO_ALL_STUDENT': '所有学生',
    			'IM_ANNOUNCEMENT_TO_ALL_FACULTY': '所有教职员工',
    			'IM_ANNOUNCEMENT_TO_ALL_INDUSTRICAL': '所有工业界人士',
    			'IM_ANNOUNCEMENT_TO_ALL_GOVERNMENT': '所有政府人员',
    			'IM_ANNOUNCEMENT_TO_ALL_OTHERS': '所有其他成员',
    			'IM_ANNOUNCEMENT_CONTENT': '内容:',
    			'IM_ANNOUNCEMENT_CONTENT_PLACEHOLDER': '请输入公告内容...',
    			'IM_ANNOUNCEMENT_EMAIL_TIPS': '同时使用邮件发送',
    			'IM_ANNOUNCEMENT_CANCEL': '取消',
    			'IM_ANNOUNCEMENT_CREATE': '创建',
    			'IM_ANNOUNCEMENT_PERMISSION': '你没有权限创建并发送公告，请跟管理员申请权限...',
    			'IM_ANNOUNCEMENT_TITLE_CHECK': '请输入公告标题...',
    			'IM_ANNOUNCEMENT_CONTENT_CHECK': '请输入公告内容...'
    		},
    		'ChatDetailAnnouncementView': {
    			'ANNOUNCEMENT_TAG': '公告',
    			'ANNOUNCEMENT_TO': '发送给',
    			'ANNOUNCEMENT_DELETE_TITLE': '删除公告',
    			'ANNOUNCEMENT_CONFIRM_DELETE_TITLE': '确认删除此条公告?',
    			'ANNOUNCEMENT_NO_CONTENT': '没有内容...',
    			'IM_ANNOUNCEMENT_TO_ALL_MEMBERS': '所有成员',
    			'IM_ANNOUNCEMENT_TO_ALL_STUDENT': '所有学生',
    			'IM_ANNOUNCEMENT_TO_ALL_FACULTY': '所有教职员工',
    			'IM_ANNOUNCEMENT_TO_ALL_INDUSTRICAL': '所有工业界人士',
    			'IM_ANNOUNCEMENT_TO_ALL_GOVERNMENT': '所有政府人员',
    			'IM_ANNOUNCEMENT_TO_ALL_OTHERS': '所有其他成员',
    			'IM_ANNOUNCEMENT_TO_UNKNOWN': '未知'
    		},
    		'ChatDetailGroupMembersView': {
    			
    		},
    		'ChatDetailGroupView': {
    			'NO_CONTENT': '暂无内容...',
    			'COMMENT_CONTENT_CHECK': '请输入消息内容...',
    			'COMMENT_ERROR': '站内信发送失败!',
    			'EXIT_CONFIRM': '你想退出这个站内信小组吗？',
    			'EXIT_TIPS': '退出小组',
    			'SHOW_IM_MEMBERS': '查看成员',
    			'SAY_STH': '说点啥吧...',
    			'SEND': '发送',
    			'DEFAULT_CREATE_CHAT_MSG': '创建了这个站内信小组。 ',
    			'DEFAULT_EXIT_CHAT_MSG': '退出了这个站内信小组。 '
    		},
    		'ChatDetailView': {
    			'NO_IM_SELECT': '暂无站内信选中...'
    		},
    		'ChatListItemView': {
    			'IM_TITLE': '群组消息',
    			'ANNOUNCEMENT_TITLE': '公告'
    		},
    		'ChatListView': {
    			'CREATE_CHAT_TIPS': '新建站内信',
    			'NO_IM': '暂无站内信',
    			'NEW_CHAT_ERROR': '创建站内信失败!',
    			'DELETE_CHAT_ERROR': '删除站内信失败!'
    		}
    	},
    	'LeftPanelView': {
			'DASHBOARD': '仪表盘',
    		'PROJECTS': '项目',
    		'CHAT': '站内信',
    		'SETTINGS': '设置',
    		'NEW': '创建'
    	},
    	'TopPanelView': {
    		'SEARCH_TITLE': '搜索',
    		'SEARCH_INPUT_TITLE': '搜索...',
    		'NOTIFICATION_TITLE': '项目通知',
    		'ADVICE_TITLE': '反馈 & 建议',
    		'LOGOUT_TITLE': '退出',
    		'LOGOUT_CONFIRM': '确定退出当前用户?'
    	}
    }
});