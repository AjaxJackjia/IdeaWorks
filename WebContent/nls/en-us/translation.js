define({
    /*
     * portal module
     * */
    'portal': {
        'HeaderView': {
        	'HOME': 'Home',
			'NEWS': 'News',
			'PROJECTS': 'Projects',
			'LOGIN': 'Login'
        },
        'FooterView': {
        	'HELP_CENTER': 'Help Center',
        	'ABOUT_US': 'About Us',
        	'CONTACT_US': 'Contact Us'
        },
        'AboutView': {
        	'TITLE': 'About Us',
        	'TEAM_TITLE': 'Our Team',
        	'HISTORY_TITLE': 'Our History',
        	'FUTURE_TITLE': 'Our Future'
        },
        'ContactView': {
        	'TITLE': 'Contact Us',
        	'LOCATION_TITLE': 'Our Location',
        	'WORKING_TIME_TITLE': 'Working Time',
        	'CONTACT_PERSON_TITLE': 'Contact Person'
        },
        'HelpView': {
        	'TITLE': 'Online Help',
        	'REGISTER_TITLE': 'How to register',
        	'JOIN_PROJECT_TITLE': 'How to join a project'
        },
        'IntroductionView': {
        	'DETAIL_INFORMATION': 'Detail Information'
        },
        'NewsListView': {
        	'READ_MORE': 'Read More '
        },
        'NewsView': {
        	'NEWS_NOT_FOUND': 'News Not Found!',
        	'DETAIL_INFORMATION': 'Detail Information'
        },
        'ProjectListView': {
        	'READ_MORE': 'Read More '
        },
        'ProjectView': {
        	'PROJECTS_NOT_FOUND': 'Projects Not Found!',
        	'DETAIL_INFORMATION': 'Detail Information'
        },
        'PortalBodyView': {
        	'WELCOME_TITLE': 'Welcome to IdeaWorks!',
        	'READ_MORE': 'Read More ',
        	'FIND_NEW_IDEAS': 'Find new ideas',
        	'HILIGHT_INSPIRATION': 'Hilight inspiration',
        	'SHARE_WITH_PEOPLE': 'Share with people',
        	'LATEST_NEWS': 'Latest News',
        	'POPULAR_PROJECTS': 'Popular Projects',
        	'MICROSCOPE_TITLE': 'Discovery & Innovation & Teamwork',
        	'JOINUS_TITLE': 'Wonderful IdeaWorks!',
        	'TRY_NOW': 'Try Now!'
        }
    },
    
    /*
     * login module
     * */
    'login': {
    	'main': {
    		'SIGNIN_TITLE': 'Sign In',
    		'SIGNUP_TITLE': 'Sign Up',
    		'SIGNIN_HTML_TITLE': 'Sign In :: IdeaWorks',
    		'SIGNUP_HTML_TITLE': 'Sign Up :: IdeaWorks'
    	},
    	'SigninView': {
    		'USERNAME': 'please enter your username...',
    		'PASSWORD': 'please enter your password...',
    		'CHECK_USERNAME_OR_PWD_EMPTY': 'Username or password can\'t be empty!',
    		'SIGN_IN': 'Sign In',
    		'SIGNING_IN': 'Signing in...'
    	},
    	'SignupView': {
    		'SIGN_UP': 'Sign Up',
    		'SIGNING_UP': 'Signing up...',
    		'USERNAME_TITLE': 'User Name:',
    		'USERNAME_HOLDER': 'user name...',
    		'PASSWORD_TITLE': 'Password:',
    		'PASSWORD_HOLDER': 'password...',
    		'PASSWORD_CONFIRM_TITLE': 'Password Confirm:',
    		'PASSWORD_CONFIRM_HOLDER': 'password confirm...',
    		'USERTYPE_TITLE': 'User Type:',
    		'EMAIL_TITLE': 'Email:',
    		'EMAIL_HOLDER': 'email...',
    		'CHECK_USERNAME_EMPTY': 'The username is required',
    		'CHECK_USERNAME_VALID': 'The username can consist of lowercase letters and numbers only',
    		'CHECK_USERNAME_LENGTH': 'The username must be smaller than 30 characters',
    		'CHECK_PWD_EMPTY': 'The password is required',
    		'CHECK_PWD_CONFIRM': 'The password twice input are not the same',
    		'CHECK_PWD_LENGTH': 'The password must be larger than 6 characters',
    		'CHECK_EMAIL_EMPTY': 'The email address is required',
    		'CHECK_EMAIL_VALID': 'The value is not a valid email address',
    		'STUDENT': 'Student',
    		'TEACHER': 'Teacher',
    		'SOCIAL': 'Social',
    		'SIGN_UP_SUCCESS': 'Sign up success! Please login in use your username and password! Enjoy~',
    	}
    },
    
    /*
     * user center module
     * */
    'my': {
    	'activity': {
    		//action
    		'CREATE': 'create',
    		'MODIFY': 'modify',
    		'READ': 'read',
    		'DELETE': 'delete',
    		'JOIN': 'join',
    		'REMOVE': 'remove',
    		'LEAVE': 'leave',
    		'UPLOAD': 'upload',
    		'REPLY': 'reply',
    		'APPLY': 'apply',
    		'REJECT': 'reject',
    		'AGREE': 'agree',
    		//entity
    		'PROJECT': 'project',
    		'MEMBER': 'member',
    		'MILESTONE': 'milestone',
    		'TOPIC': 'topic',
    		'MESSAGE': 'message',
    		'FILE': 'file',
    		'APPLICATION': 'application',
    		'TITLE': 'title',
    		'ADVISOR': 'advisor',
    		'ABSTRACT': 'abstract',
    		'LOGO': 'logo',
    		'STATUS': 'status',
    		'SECURITY': 'security',
    		'DESCRIPTION': 'description',
    		//assist
    		'UNKNOWN': 'unknown',
    		'OF': '\'s',
    		'IN': 'in',
    		'FROM': 'from',
    		'TO': 'to',
    		'THIS': 'this',
    		'WITH': 'with',
    		'YOU': 'you',
    		'ONGOING': 'ongoing',
    		'COMPLETE': 'complete',
    		'PUBLIC': 'public',
    		'GROUP': 'group visible'
    	},
    	'dashboard': {
    		'BriefView': {
    			'PROJECTS': 'projects',
    			'ACTIVITIES': 'activities',
    			'RELATED_MEMBERS': 'related members',
    			'FORUM_PARTICIPATIONS': 'forum participations'
    		},
    		'PopularTopicView': {
    			'POPULAR_TOPICS': 'Popular topics',
    			'MSG': ' message',
    			'MSGS': ' messages',
    			'NO_TOPICS': 'No popular topics...'
    		},
    		'RecentActivityView': {
    			'RECENT_ACTIVITIES': 'Recent activities',
    			'NO_ACTIVITIES': 'No recent activities...'
    		}
    	},
    	'notification': {
    		'NotificationSideView': {
    			'NOTIFICATIONS': 'Notifications  ',
    			'NO_NOTIFICATIONS': 'No notifications...',
    			'CLOSE_NOTIFICATION': 'close notification',
    			'FETCH_NOTIFICATION_ERROR': 'Get user notifications failed. Please try again later!',
    		},
    		'NotificationItemView': {
    			'MARK_READ_ERROR': 'Mark notification read failed. Please try again later!',
    			'IN_PROJECT': 'in project  '
    		}
    	},
    	'advice': {
    		'CHECK_NOT_EMPTY': 'The content of feedback could be emtpy!',
    		'CHECK_LENGTH': 'The max length of feedback is 300!',
    		'FEEDBACK_EEROR': 'Feedback error, please try again later!',
    		'ADVICE_THANKYOU': 'Thank you for your advice and suggestion, we will try our best to improve!',
			'ADVICE_TITLE': 'Advice & Suggestion',
			'ADVICE_CONTENT_TITLE': 'Please write down your advice or suggestion...',
			'CANCEL': 'Cancel',
			'CONFIRM': 'Feedback',
    	},
    	'projects': {
    		'ProjectListView': {
    			'NO_PROJECTS': 'No projects...',
    			'CREATE_PROJECT_ERROR': 'Create project failed. Please try again later!',
    			'DELETE_PROJECT_ERROR': 'Delete project failed. Please try again later!',
    			'EXIT_PROJECT_ERROR': 'Exit project failed. Please try again later!'
    		},
    		'ProjectListItemView': {
    			'ONGOING': 'ongoing',
    			'COMPLETE': 'completed',
    			'UNKNOWN': 'unclear',
    		},
    		'ProjectDetailView': {
    			//detail info
    			'ADVISOR': 'Advisor',
    			'CREATOR': 'Creator',
    			'CREATE_TIME': 'Create time',
    			//menu list
    			'ABSTRACT': 'Abstract',
    			'MEMBERS': 'Members',
    			'MILESTONE': 'Milestone',
    			'FORUM': 'Forum',
    			'FILES': 'Files',
    			'ACTIVITY': 'Activity',
    			//提示
    			'NO_PROJECT_SELECT': 'No project selected...',
    			'FETCH_MEMBERS_ERROR': 'Fetch project members failed. Please try again later!',
    			'FETCH_MILESTONES_ERROR': 'Fetch project milestones failed. Please try again later!',
    			'FETCH_TOPICS_ERROR': 'Fetch project topics failed. Please try again later!',
    			'FETCH_FILES_ERROR': 'Fetch project files failed. Please try again later!',
    			'FETCH_ACTIVITIES_ERROR': 'Fetch project activities failed. Please try again later!',
    			'EXIT_PROJECT_CONFIRM': 'Do you want to exit this project?',
    			'DELETE_PROJECT_CONFIRM': 'Do you want to delete this project?',
    			//project menu
    			'PROJECT_MENU': 'Menu',
    			'PROJECT_MENU_EDIT': 'Edit',
    			'PROJECT_MENU_LOGO': 'Logo',
    			'PROJECT_MENU_STATUS': 'Status',
    			'PROJECT_MENU_SECURITY': 'Security',
    			'PROJECT_MENU_APPLICATION': 'Application',
    			'PROJECT_MENU_DELETE_PROJECT': 'Delete project',
    			'PROJECT_MENU_EXIT_PROJECT': 'Exit project',
    			//LogoUploadSubView 子页面提示
    			'UPLOAD_SUCCESS': 'Upload complete!',
    			'UPLOAD_LOGO_ERROR': 'Upload logo failed. Please try again later!',
    			'CHECK_ALERT_EMPTY': 'Please select your upload logo image!',
    			'CHECK_ALERT_MAX_SIZE': 'The maxsize of upload file is 300k!',
    			'CHECK_ALERT_FILE_TYPE': 'The file type doesn\'t support!',
    			'CHECK_ALERT_BROWSER': 'Please use Chrome or Firefox browser to upload file!',
    			'CHANGE_PROJECT_LOGO': 'Change Project Logo',
    			'UPLOAD': 'Upload',
    			'UPLOAD_FILE': 'File:',
    			'UPLOAD_TIPS': '(Max upload logo image size is 300k. Support file type: gif, jpeg, jpg, png)',
    			//ProjectStatusSubView 子页面提示
    			'UPDATE_STATUS_ERROR': 'Update project status failed. Please try again later!',
    			'PROJECT_STATUS': 'Project Status',
    			'PROJECT_STATUS_SAVE': 'Save',
    			'PROJECT_STATUS_CANCEL': 'Cancel',
    			'PROJECT_STATUS_ONGOING': 'Ongoing',
    			'PROJECT_STATUS_COMPLETE': 'Complete',
    			//ProjectSecuritySubView 子页面提示
    			'UPDATE_SECURITY_ERROR': 'Update project security failed. Please try again later!',
    			'PROJECT_SECURITY': 'Project Security',
    			'PROJECT_SECURITY_SAVE': 'Save',
    			'PROJECT_SECURITY_CANCEL': 'Cancel',
    			'PROJECT_SECURITY_PUBLIC': 'Project details are visible for everyone',
    			'PROJECT_SECURITY_GROUP': 'Project details are only visible for group members',
    			//ProjectApplicationSubView 子页面提示
    			'FETCH_APPLICATIONS_ERROR': 'Fetch project applications failed. Please try again later!',
    			'UPDATE_APPLICATIONS_ERROR' : 'Update application failed. Please try again later!',
    			'PROJECT_APPLICATION': 'Project Application',
    			'PROJECT_APPLICATION_PROPOSER': 'Proposer',
    			'PROJECT_APPLICATION_MESSAGE': 'Message',
    			'PROJECT_APPLICATION_APPLY_TIME': 'Apply time',
    			'PROJECT_APPLICATION_STATUS': 'Status',
    			'PROJECT_APPLICATION_ACTION': 'Action',
    			'PROJECT_NO_APPLICATIONS': 'No applications',
    			'PROJECT_APPLICATION_APPLIED': 'applied',
    			'PROJECT_APPLICATION_PASSED': 'passed',
    			'PROJECT_APPLICATION_REJECTED': 'rejected',
    			'PROJECT_APPLICATION_UNKNOWN': 'unknown',
    			'PROJECT_APPLICATION_AGREE': 'Agree',
    			'PROJECT_APPLICATION_AGREE_CONFIRM': 'Do you want to pass this application?',
    			'PROJECT_APPLICATION_REJECT': 'Rejct',
    			'PROJECT_APPLICATION_REJECT_CONFIRM': 'Do you want to reject this application?'
    		},
    		'ProjectDetailModifyView': {
    			'CHECK_TITLE': 'The porject title is required',
    			'CHECK_ADVISOR': 'The porject advisor is required',
    			'CREATE_PROJECT': 'Create Project',
    			'EDIT_PROJECT': 'Edit Project',
    			'CREATE': 'Create',
    			'SAVE': 'Save',
    			'CANCEL': 'Cancel',
    			'UPDATE_PROJECT_ERROR': 'Update project failed. Please try again later!',
    			'TITLE': 'Title:',
    			'TITLE_PLACEHOLDER': 'project title',
    			'ADVISOR': 'Advisor:'
    		},
    		'ProjectDetailAbstractView': {
    			'NO_ABSTRACT': 'No abstract...',
    			'EDIT_ABSTRACT': 'Edit Abstract',
    			'EDIT_ABSTRACT_TIPS': 'Please wirte something about your project...',
    			'UPDATE_ABSTRACT_ERROR': 'Update project abstract error! Please try again later...',
    			'MODIFY_ABSTRACT_TITLE': 'Modify Project Abstract',
    			'CANCEL': 'Cancel',
    			'SAVE': 'Save'
    		},
    		'ProjectDetailMembersView': {
    			'ADVISOR': 'Advisor',
    			'ADVISOR_PLACEHOLDER': 'No advisor...',
    			'MEMBERS': 'Members',
    			'MEMBERS_PLACEHOLDER': 'No members...',
    			//AddMemberSubView 子页面
    			'ADD_PROJECT_MEMBERS_ERROR': 'Add project member project failed. Please try again later!',
    			'INVITE_MEMBERS': 'Invite Members',
    			'CANCEL': 'Cancel',
    			'INVITE': 'Invite',
    			//MemberDetailSubView 子页面
    			'FETCH_MEMBER_ERROR': 'Fetch member failed. Please try again later!',
    			'MEMBER_DETAIL_INFORMATION': 'Member Detail Information',
    			'OK': '&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;',
    			'DETAIL_SIGNATURE_EMPTY': 'signature is empty...',
    			'DETAIL_REALNAME': 'Real Name: ',
    			'DETAIL_PHONE': 'Phone: ',
    			'DETAIL_EMAIL': 'Email: ',
    			'DETAIL_SKYPE': 'Skype account: ',
    			'DETAIL_WECHAT': 'WeChat account: ',
    			'DETAIL_MAJOR': 'Major: ',
    			'DETAIL_DEPARTMENT': 'Department: ',
    			'DETAIL_COLLEGE': 'College: ',
    			'DETAIL_ADDRESS': 'Address: ',
    			'DETAIL_INTERESTS': 'Interests: ',
    			'DETAIL_INTRODUCTION': 'Introduction: ',
    			'DETAIL_PRIVACY_TIPS': 'Due to the person\'s privacy settings, you can\'t view his/her detailed information... '
    		},
    		'ProjectDetailMilestoneView': {
    			'CERATE_MILESTONE_ERROR': 'Create milestone failed. Please try again later!',
    			'DELETE_MILESTONE_ERROR': 'Delete milestone failed. Please try again later!',
    			'ADD_NEW_MILESTONE': 'Add New Milestone',
    			//CreateMilestoneSubView 子页面
    			'CREATE_MILESTONE': 'Create Milestone',
    			'CREATE': 'Create',
    			'CANCEL': 'Cancel',
    			'CREATE_TITLE': 'Title:',
    			'CREATE_TITLE_HOLDER': 'milestone title...',
    			'CREATE_DESCRIPTION': 'Description:',
    			'CREATE_DESCRIPTION_HOLDER': 'milestone description...',
    			'CHECK_MILESTONE_TITLE': 'The milestone title is required',
    			'CHECK_MILESTONE_DESCRIPTION': 'The milestone description is required',
    		},
    		'ProjectDetailMilestoneItemView': {
    			'DELETE_CONFIRM': 'Do you want to delete this milestone?',
    			'EDIT': 'Edit',
    			'DELETE': 'Delete',
    			'DESCRIPTION': 'Description',
    			'SHOW_DETAIL': 'show milestone detail',
    			'CREATE_AT': ' create this milestone at ',
    			//ModifyMilestoneSubView 子页面
    			'MODIFY_MILESTONE': 'Modify Milestone',
    			'CANCEL': 'Cancel',
    			'SAVE': 'Save',
    			'MODIFY_TITLE': 'Title:',
    			'MODIFY_TITLE_HOLDER': 'milestone title...',
    			'MODIFY_DESCRIPTION': 'Description:',
    			'MODIFY_DESCRIPTION_HOLDER': 'milestone description...',
    			'CHECK_MILESTONE_TITLE': 'The milestone title is required',
    			'CHECK_MILESTONE_DESCRIPTION': 'The milestone description is required',
    			'UPDATE_MILESTONE_ERROR': 'Update milestone failed. Please try again later!'
    		},
    		'ProjectDetailForumView': {
    			'CERATE_TOPIC_ERROR': 'Create topic failed. Please try again later!',
    			'DELETE_TOPIC_ERROR': 'Delete topic failed. Please try again later!',
    			'ADD_NEW_TOPIC': 'Add New Topic',
    			//CreateTopicSubView 子页面
    			'CHECK_TOPIC_TITLE': 'The topic title is required',
    			'CHECK_TOPIC_DESCRIPTION': 'The topic description is required',
    			'CREATE_TOPIC': 'Create Forum Topic',
    			'CANCEL': 'Cancel',
    			'CREATE': 'Create',
    			'CREATE_TITLE': 'Title:',
    			'CREATE_TITLE_HOLDER': 'forum topic title...',
    			'CREATE_DESCRIPTION': 'Description:',
    			'CREATE_DESCRIPTION_HOLDER': 'topic description...',
    			
    		},
    		'ProjectDetailForumTopicView': {
    			'DELETE_CONFIRM': 'Do you want to delete this topic?',
    			'SHOW_DETAIL': 'show topic detail',
    			'CREATE_AT': ' create this topic at ',
    			'EDIT': 'Edit',
    			'DELETE': 'Delete',
    			'DESCRIPTION': 'Description',
    			//ModifyTopicSubView 子页面
    			'CHECK_TOPIC_TITLE': 'The topic title is required',
    			'CHECK_TOPIC_DESCRIPTION': 'The topic description is required',
    			'UPDATE_MILESTONE_ERROR': 'Update topic failed. Please try again later!',
    			'MODIFY_TOPIC': 'Modify Topic',
    			'CANCEL': 'Cancel',
    			'SAVE': 'Save',
    			'MODIFY_TITLE': 'Title:',
    			'MODIFY_TITLE_HOLDER': 'topic title...',
    			'MODIFY_DESCRIPTION': 'Description:',
    			'MODIFY_DESCRIPTION_HOLDER': 'topic description...'
    		},
    		'ProjectDetailForumTopicMessageView': {
    			'DISCUSSION': 'Discussion',
    			'REFRESH_TIPS': 'refresh latest messages',
    			'NO_DISCUSSION': 'No discussion...',
    			'SAY_STH': 'Say something...',
    			'COMMENT': 'Comment',
    			'CREATE_COMMENT_ERROR': 'Create comment failed. Please try again later!',
    			'DELETE_COMMENT_ERROR': 'Delete comment failed. Please try again later!',
    			'MSG_CANT_EMPTY': 'Message can not be emtpy!',
    			'FETCH_MSG_ERROR': 'Fetch messages failed. Please try again later!',
    			'DELETE_MSG_CONFIRM': 'Do you want to delete this discussion?',
    			//ReplyMessageSubView 子页面
    			'TOTAL': 'total',
    			'FETCH_REPLY_MSG_ERROR': 'Get message reply list failed. Please try again later!',
    			'NO_REPLY': 'No reply...',
    			'CREATE_REPLY_MSG_ERROR': 'Create reply failed. Please try again later!',
    			'DELETE_REPLY_MSG_ERROR': 'Delete reply failed. Please try again later!',
    			'REPLY_TO': 'Reply to : ',
    			'REPLY_DISCUSSION_MSG': 'Reply Discussion Message',
    			'CANCEL': 'Cancel',
    			'MESSAGE': 'Message: ',
    			'REPLIES': 'Replies: ',
    			'REPLY_STH': 'reply something...'
    		},
    		'ProjectDetailFilesView': {
    			'UPLOAD_FILE': 'Upload file',
    			'NO_FILES': 'No files...',
    			'UPLOAD_COMPLETE': 'Upload complete!',
    			'FETCH_FILES_ERROR': 'Fetch files failed. Please try again later!',
    			'UPLOAD_FILE_ERROR': 'Upload file failed. Please try again later!',
    			'DELETE_FILE_ERROR': 'Delete file failed. Please try again later!',
    			//UploadSubView 子页面
    			'CHECK_EMPTY_MSG': 'Please select your upload file!',
    			'CHECK_MAX_SIZE_MSG': 'The maxsize of upload file is 50M!',
    			'CHECK_FILE_TYPE_MSG': 'The file type doesn\'t support!',
    			'CHECK_BROWSER_MSG': 'Please use Chrome or Firefox browser to upload file!',
    			'UPLOAD_TITLE': 'Upload File',
    			'UPLOAD': 'Upload',
    			'FILE': 'File:',
    			'UPLOAD_TIPS': '(Max upload file size is 50M. Support file type: doc, docx, xls, xlsx, ppt, pptx, pdf, zip, rar, txt, gif, jpeg, jpg, png)',
    			'DESCRIPTION': 'Description:',
    			'DESCRIPTION_HOLDER': 'file description...'
    		},
    		'ProjectDetailFileItemView': {
    			'DELETE_FILE_CONFIRM': 'Do you want to delete this file?',
    			'DELETE_FILE_TIPS': 'delete this file',
    			'DOWNLOAD_FILE': 'Download file',
    			//FileDetailSubView 子页面
    			'FILE_DETAIL_INFO': 'File Detail Information',
    			'OK': '&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;',
    			'FILE_NAME': 'File name:',
    			'FILE_SIZE': 'File size:',
    			'CREATOR': 'Creator:',
    			'CREATE_TIME': 'Create time:',
    			'DESCRIPTION': 'Description:'
    		}
    	},
    	'search': {
    		'SearchMainView': {
    			'PROJECT': 'Project',
    			'PERSON': 'Person',
    			'NO_RESULT': 'No search result...'
    		},
    		'ProjectSearchView': {
    			'SEARCH_PROJECT_ERROR': 'Search projects failed. Please try again later!',
    			'SEARCH_NO_PROJECT': 'Search Project No result...'
    		},
    		'ProjectItemView': {
    			'ALREADY_JOIN_PROJECT': 'You have already joined this project...',
    			'ALREADY_SEND_REQUEST': 'You have already send request to relative staff, please wait for acception...',
    			'SEND_COMPLETE': 'Send request complete!',
    			'JOIN_PROJECT_ERROR': 'Join project failed. Please try again later!',
    			'ONGOING': 'ongoing',
    			'COMPLETE': 'completed',
    			'UNCLEAR': 'unclear',
    			'DETAIL': 'Detail',
    			'JOIN': 'Join',
    			'JOINED': 'Joined',
    			'CREATE_AT': 'create at',
    			//SearchProjectDetailSubView 子页面
    			'FETCH_PROJECT_FAILED': 'Fetch certain project failed. Please try again later!',
    			'PROJECT_DETAIL_INFO': 'Project Detail Information',
    			'OK': '&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;',
    			'PROJECT_TITLE': 'Title:',
    			'PROJECT_STATUS': 'Status:',
    			'PROJECT_CREATE_TIME': 'Create time:',
    			'PROJECT_ADVISOR': 'Advisor:',
    			'PROJECT_CREATOR': 'Creator:',
    			'PROJECT_ABSTRACT': 'Abstract:',
    			'PROJECT_PRIVACY_TIPS': 'Due to the project\'s security settings, you can\'t view the detail of this project before you join... '
    		},
    		'PersonSearchView': {
    			'SEARCH_PERSON_ERROR': 'Search person failed. Please try again later!',
    			'SEARCH_NO_PERSON': 'Search Person No result...'
    		},
    		'PersonItemView': {
    			'DETAIL': 'Detail',
    			//SearchPersonDetailSubView 子页面
    			'FETCH_PERSON_FAILED': 'Fetch certain person failed. Please try again later!',
    			'PERSON_DETAIL_INFO': 'Person Detail Information',
    			'OK': '&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;',
    			'DETAIL_SIGNATURE_EMPTY': 'signature is empty...',
    			'DETAIL_REALNAME': 'Real Name: ',
    			'DETAIL_PHONE': 'Phone: ',
    			'DETAIL_EMAIL': 'Email: ',
    			'DETAIL_SKYPE': 'Skype account: ',
    			'DETAIL_WECHAT': 'WeChat account: ',
    			'DETAIL_MAJOR': 'Major: ',
    			'DETAIL_DEPARTMENT': 'Department: ',
    			'DETAIL_COLLEGE': 'College: ',
    			'DETAIL_ADDRESS': 'Address: ',
    			'DETAIL_INTERESTS': 'Interests: ',
    			'DETAIL_INTRODUCTION': 'Introduction: ',
    			'DETAIL_PRIVACY_TIPS': 'Due to the person\'s privacy settings, you can\'t view his/her detailed information... '
    		}
    	},
    	'settings': {
    		'SettingListView': {
    			'PROFILE': 'Profile',
    			'NOTIFICATION': 'Notification',
    			'PRIVACY_SETTINGS': 'Privacy settings',
    			'ADVANCED_SETTINGS': 'Advanced settings'
    		},
    		'SettingDetailView': {
    			'FETCH_PROFILE_ERROR': 'Get user profile failed. Please try again later!',
    		},
    		'SettingDetaiProfilelView': {
    			'MORE_ACTIONS': 'More actions',
    			'EDIT_SIGNATURE': 'Edit Signature',
    			'EDIT_PROFILE': 'Edit profile',
    			'LOGO': 'Logo',
    			'CHANGE_PWD': 'Change password',
    			'SAY_STH': 'Say Something :)',
    			'DETAIL_USER_ID': 'User ID:',
    			'DETAIL_NICKNAME': 'Nickname:',
    			'DETAIL_REALNAME': 'Real Name: ',
    			'DETAIL_PHONE': 'Phone: ',
    			'DETAIL_EMAIL': 'Email: ',
    			'DETAIL_SKYPE': 'Skype account: ',
    			'DETAIL_WECHAT': 'WeChat account: ',
    			'DETAIL_USER_TYPE': 'User Type:',
    			'DETAIL_MAJOR': 'Major: ',
    			'DETAIL_DEPARTMENT': 'Department: ',
    			'DETAIL_COLLEGE': 'College: ',
    			'DETAIL_ADDRESS': 'Address: ',
    			'DETAIL_INTERESTS': 'Interests: ',
    			'DETAIL_INTRODUCTION': 'Introduction: ',
    			'CANCEL': 'Cancel',
    			'SAVE': 'Save',
    			'UPLOAD': 'Upload',
    			//EditSignatureSubView 子页面
    			'UPDATE_SIGNATURE_ERROR': 'Update signature failed. Please try again later!',
    			'EDIT_SIGNATURE': 'Edit Signature',
    			'SIGNATURE_TITLE': 'Signature:',
    			//LogoUploadSubView 子页面
    			'UPLOAD_COMPLETE': 'Upload complete!',
    			'UPLOAD_LOGO_ERROR': 'Upload logo failed. Please try again later!',
    			'CHECK_ALERT_EMPTY': 'Please select your upload logo image!',
    			'CHECK_ALERT_MAX_SIZE': 'The maxsize of upload file is 300k!',
    			'CHECK_ALERT_FILE_TYPE': 'The file type doesn\'t support!',
    			'CHECK_ALERT_BROWSER': 'Please use Chrome or Firefox browser to upload file!',
    			'CHANGE_USER_LOGO': 'Change User Logo',
    			'FILE': 'File:',
    			'UPLOAD_TIPS': '(Max upload logo image size is 300k. Support file type: gif, jpeg, jpg, png)',
    			//EditProfileSubView 子页面
    			'CHECK_NICKNAME': 'The nickname is required',
    			'CHECK_NICKNAME_LENGTH': 'The nickname must be smaller than 30 characters',
    			'UPDATE_PROFILE_ERROR': 'Update profile failed. Please try again later!',
    			'EDIT_PROFILE': 'Edit Profile',
    			//ChangePasswordSubView 子页面
    			'CHECK_OLD_PWD': 'The old password is required',
    			'CHECK_NEW_PWD': 'The new password is required',
    			'CHECK_PWD_CONFIRM': 'The password twice input are not the same',
    			'CHECK_PWD_LENGTH': 'The password must be larger than 6 characters',
    			'UPDATE_PWD_SUCCESS': 'Change password successful!',
    			'UPDATE_PWD_ERROR': 'Change password failed. Please try again later!',
    			'CHANGE_PWD': 'Chagne Password',
    			'OLD_PWD': 'Old Password:',
    			'OLD_PWD_HOLDER': 'Old password...',
    			'NEW_PWD': 'New Password:',
    			'NEW_PWD_HOLDER': 'New password...',
    			'NEW_PWD_AGAIN': 'New Password Again:',
    			'NEW_PWD_AGAIN_HOLDER': 'New password again...'
    		},
    		'SettingDetailNotificationView': {
    			'NOTIFICATION_PROJECTS': 'Notifications about projects',
    			'NOTIFICATION_MEMBERS': 'Notifications about members',
    			'NOTIFICATION_MILESTONES': 'Notifications about milestones',
    			'NOTIFICATION_FORUMS': 'Notifications about forums',
    			'NOTIFICATION_DISCUSSIONS': 'Notifications about forum discussions',
    			'NOTIFICATION_FILES': 'Notifications about files',
    			'SET_COMPLETE': 'Set complete!',
    			'SET_NOTIFICATION_ERROR': 'Set notification failed. Please try again later!'
    		},
    		'SettingDetailPrivacyView': {
    			'PRIVACY_SELF': 'Only self visible',
    			'PRIVACY_PROJECT_ADVISOR': 'Only project advisor visible',
    			'PRIVACY_GROUP_MEMBER': 'Only group member visible',
    			'PRIVACY_PUBLIC': 'Public to everyone',
    			'SET_COMPLETE': 'Set complete!',
    			'SET_PRIVACY_ERROR': 'Set privacy failed. Please try again later!'
    		},
    		'SettingDetailAdvancedView': {
    			'SYNC': 'Synchronize current browse state',
    			'SELECT_LNG': 'Select language',
    			'SET_COMPLETE': 'Set complete! This setting will be activated after it auto refresh.',
    			'SET_ADVANCED_ERROR': 'Set advanced settings failed. Please try again later!'
    		}
    	},
    	'LeftPanelView': {
    		'DASHBOARD': 'Dashboard',
    		'PROJECTS': 'Projects',
    		'SETTINGS': 'Settings',
    		'NEW': 'New'
    	},
    	'TopPanelView': {
    		'SEARCH_TITLE': 'Search',
    		'SEARCH_INPUT_TITLE': 'Search...',
    		'NOTIFICATION_TITLE': 'Notification',
    		'ADVICE_TITLE': 'Advice & suggestion',
    		'LOGOUT_TITLE': 'Log out',
    		'LOGOUT_CONFIRM': 'Are you sure to logout?'
    	}
    }
});