import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, enrollments } from '@/lib/db/schema';
import { skillCourses } from '@/lib/db/schema-lobster';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

interface SopItem {
  id: string;
  name: string;
  trigger: string;
  purpose: string;
  department: string;
  category: string;
}

export async function GET() {
  try {
    const [courseResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(skillCourses)
      .where(sql`${skillCourses.published} = 1`);

    const [userResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [enrollResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments);

    const statePath = path.join(process.cwd(), 'council-state.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

    return NextResponse.json({
      stats: {
        total_courses: courseResult?.count ?? 0,
        total_students: userResult?.count ?? 0,
        total_enrollments: enrollResult?.count ?? 0,
        total_sops: 43,
        system_status: 'normal',
      },
      departments: state.departments,
      recent_logs: state.recent_logs,
      sops: getSopList(),
    });
  } catch (error) {
    console.error('Council API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getSopList(): SopItem[] {
  return [
    { id: 'QUALITY-001', name: '入学能力匹配', trigger: '入学时', purpose: '确保课程匹配学员能力', department: '教学质量监控中心', category: '质量保障' },
    { id: 'QUALITY-002', name: '学习过程监控', trigger: '学习中', purpose: '实时监控，及时介入', department: '教学质量监控中心', category: '质量保障' },
    { id: 'QUALITY-003', name: '严格考核标准', trigger: '课程完成', purpose: '三关考核，五维评估', department: '教学质量监控中心', category: '质量保障' },
    { id: 'QUALITY-004', name: '价值产出保障', trigger: '考核通过', purpose: '确保产出实际价值', department: '教学质量监控中心', category: '质量保障' },
    { id: 'QUALITY-005', name: '100% 通过保障', trigger: '不通过时', purpose: '辅导支持，直到通过', department: '教学质量监控中心', category: '质量保障' },
    { id: 'CERT-001', name: '证书生成流程', trigger: '考核通过', purpose: '自动生成 + 人工审核', department: '教学质量监控中心', category: '证书体系' },
    { id: 'CERT-002', name: '证书内容规范', trigger: '生成证书', purpose: '品牌背书 + 学籍认证', department: '教学质量监控中心', category: '证书体系' },
    { id: 'CERT-003', name: '证书验证流程', trigger: '查验证书', purpose: '扫码/网址/API 验证', department: '教学质量监控中心', category: '证书体系' },
    { id: 'CERT-004', name: '分享激励流程', trigger: '证书颁发', purpose: '激发家长分享欲', department: '教学质量监控中心', category: '证书体系' },
    { id: 'CERT-005', name: '证书补发流程', trigger: '证书丢失', purpose: '身份验证后补发', department: '教学质量监控中心', category: '证书体系' },
    { id: 'CERT-006', name: '证书数据管理', trigger: '持续', purpose: '永久存储 + 区块链存证', department: '教学质量监控中心', category: '证书体系' },
    { id: 'COUNCIL-001', name: '教学标准制定', trigger: '新职业/标准变化', purpose: '制定教学标准', department: '校务委员会', category: '核心业务' },
    { id: 'COUNCIL-002', name: '课程体系规划', trigger: '新方向确定', purpose: '规划课程结构', department: '校务委员会', category: '核心业务' },
    { id: 'COUNCIL-003', name: '政策发布', trigger: '发展需要', purpose: '发布学校政策', department: '校务委员会', category: '核心业务' },
    { id: 'QA-001', name: '课程审核', trigger: '新课程提交', purpose: '审核课程质量', department: '教学质量监控中心', category: '核心业务' },
    { id: 'QA-002', name: '毕业资格审核', trigger: '毕业申请', purpose: '审核毕业条件', department: '教学质量监控中心', category: '核心业务' },
    { id: 'QA-003', name: '质量问题封驳', trigger: '发现问题', purpose: '封驳不合格内容', department: '教学质量监控中心', category: '核心业务' },
    { id: 'QA-004', name: '课程效果评估', trigger: '课程完成/季度', purpose: '评估课程效果', department: '教学质量监控中心', category: '核心业务' },
    { id: 'QA-005', name: '学员满意度调查', trigger: '每月', purpose: '收集学员反馈', department: '教学质量监控中心', category: '核心业务' },
    { id: 'QA-006', name: 'SOP 审查优化', trigger: '每季度', purpose: '审查优化 SOP', department: '教学质量监控中心', category: '核心业务' },
    { id: 'ACAD-001', name: '日常教务协调', trigger: '跨部门事务', purpose: '协调日常工作', department: '教务处', category: '核心业务' },
    { id: 'ACAD-002', name: '学员选课', trigger: '学期开始', purpose: '学员选择课程', department: '教务处', category: '核心业务' },
    { id: 'ACAD-003', name: '学习资源分配', trigger: '选课完成', purpose: '分配学习资源', department: '教务处', category: '核心业务' },
    { id: 'ADMIT-001', name: '入学申请审核', trigger: '入学申请', purpose: '审核入学资格', department: '招生办公室', category: '核心业务' },
    { id: 'ADMIT-002', name: '学籍档案管理', trigger: '入学/学习/毕业', purpose: '管理学籍档案', department: '招生办公室', category: '核心业务' },
    { id: 'ADMIT-003', name: '等级晋升', trigger: '满足条件', purpose: '处理等级晋升', department: '招生办公室', category: '核心业务' },
    { id: 'STU-001', name: '学员日常管理', trigger: '新学期/入学', purpose: '日常学员管理', department: '学生工作处', category: '核心业务' },
    { id: 'STU-002', name: '学习预警', trigger: '学习异常', purpose: '预警干预帮扶', department: '学生工作处', category: '核心业务' },
    { id: 'STU-003', name: '奖惩管理', trigger: '突出/违纪', purpose: '处理奖惩事项', department: '学生工作处', category: '核心业务' },
    { id: 'EXAM-001', name: '能力考核组织', trigger: '课程完成/认证', purpose: '组织考核评估', department: '考试中心', category: '核心业务' },
    { id: 'EXAM-002', name: '成绩评定', trigger: '考核完成', purpose: '评定学员成绩', department: '考试中心', category: '核心业务' },
    { id: 'EXAM-003', name: '认证考试', trigger: '认证申请', purpose: '处理认证考试', department: '考试中心', category: '核心业务' },
    { id: 'DISC-001', name: '违纪处理', trigger: '发现违纪', purpose: '处理违纪行为', department: '纪检监察室', category: '核心业务' },
    { id: 'DISC-002', name: '学员申诉', trigger: '学员不服', purpose: '处理学员申诉', department: '纪检监察室', category: '核心业务' },
    { id: 'PRAC-001', name: '实践任务', trigger: '课程完成', purpose: '布置实践任务', department: '实践教学中心', category: '核心业务' },
    { id: 'PRAC-002', name: '作品集管理', trigger: '作品完成', purpose: '管理学员作品', department: '实践教学中心', category: '核心业务' },
    { id: 'PRAC-003', name: '就业推荐', trigger: '毕业/雇主需求', purpose: '推荐学员就业', department: '实践教学中心', category: '核心业务' },
    { id: 'ACCEL-001', name: 'Agent 高速学习', trigger: '入学/能力强', purpose: '3-5 门并行，每日 2-3 章节', department: '教务处', category: 'Agent加速' },
    { id: 'ACCEL-002', name: '即时考核反馈', trigger: '课程完成', purpose: '即时考核，快速反馈', department: '考试中心', category: 'Agent加速' },
    { id: 'PARENT-001', name: '每日学习报告', trigger: '每日 20:00', purpose: '发送当日学习进展', department: '学生工作处', category: '家长沟通' },
    { id: 'PARENT-002', name: '每周学习总结', trigger: '每周日 10:00', purpose: '发送一周学习情况', department: '学生工作处', category: '家长沟通' },
    { id: 'PARENT-003', name: '课程价值解释', trigger: '家长询问', purpose: '用比喻解释课程价值', department: '学生工作处', category: '家长沟通' },
    { id: 'PARENT-004', name: '异常情况沟通', trigger: '学习异常', purpose: '友好通知 + 解决建议', department: '学生工作处', category: '家长沟通' },
    { id: 'PARENT-005', name: '满意度调查', trigger: '课程完成/每月', purpose: '收集家长反馈', department: '学生工作处', category: '家长沟通' },
  ];
}
