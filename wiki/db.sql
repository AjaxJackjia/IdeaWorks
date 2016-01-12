-- 导入project_member数据
INSERT INTO 
	`project_member`(projectid, userid, jointime, jointype)
SELECT 
	T1.id, T2.id, current_timestamp(), 0
FROM 
	`project` T1,
	`user` T2
;


