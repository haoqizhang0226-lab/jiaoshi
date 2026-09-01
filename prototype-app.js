(function () {
  const workspace = document.getElementById('workspace');
  const modalRoot = document.getElementById('modal-root');
  const toastRoot = document.getElementById('toast-root');
  const breadcrumb = document.getElementById('breadcrumb');
  const shellNavs = document.querySelectorAll('[data-nav-page]');

  const state = {
    shellPage: 'matching',
    scheduleSelectAll: false,
    scheduleMediaPreferred: false,
    scheduleTeacherCollapsed: false,
    scheduleCalendarCollapsed: false,
    activeTab: 'common',
    commonEditing: null,
    manualFilter: 'all',
    selectedRooms: new Set(),
    autoTaskEnabled: true,
    autoTaskLogs: [
      { operator:'李春玲（VA000261）', time:'2026-08-25 09:00:00', content:'开启自动匹配任务' }
    ],
    globalSavedAt: '2026-08-12 10:32',
    commonRule: {
      ranges: {
        preset: { mode: 'all', days: 90 },
        custom: { mode: 'all', days: 90 },
        oneToOne: { mode: 'days', days: 60 }
      },
      roomPriorities: {
        preset: ['多媒体教室','白板教室','教学点','外租教室'],
        custom: ['多媒体教室','白板教室','教学点','外租教室'],
        oneToOne: ['白板教室','多媒体教室','教学点','外租教室']
      },
      reserveSeats: { preset:1, custom:1, oneToOne:0 },
      oneToOneSeatLimit: 4
    },
    campuses: [
      { code: '1', name: '南山校区', owner: '陈老师', shortName: '南山', school: '唯寻深圳', status: '有效', province:'广东省', city: '深圳市', phone: '0755-8656 2201', fax: '0755-8656 2202', postcode: '518000' },
      { code: '2', name: '舜元校区', owner: '吕小菲', shortName: '舜元', school: '唯寻上海', status: '有效', province:'上海市', city: '上海市', phone: '021-6123 6688', fax: '021-6123 6699', postcode: '200041' },
      { code: '6', name: '望京校区', owner: '王老师', shortName: '望京', school: '唯寻北京', status: '有效', province:'北京市', city: '北京市', phone: '010-6478 5501', fax: '010-6478 5502', postcode: '100102' }
    ],
    buildings: [
      { id: '101', campus: '南山校区', name: '侨城A栋', status: '启用', order: 1, floors: ['15F','16F','17F'], address:'深圳市南山区侨香路4080号侨城坊T3栋', route:'地铁2号线侨香站A口，步行约8分钟' },
      { id: '102', campus: '南山校区', name: '侨城B栋', status: '启用', order: 2, floors: ['1F','2F','3F'], address:'深圳市南山区侨香路4080号侨城坊T2栋', route:'地铁2号线侨香站A口，沿侨香路向东步行约10分钟' },
      { id: '201', campus: '舜元校区', name: '舜元A栋', status: '启用', order: 1, floors: ['1F','2F','3F'], address:'上海市静安区南京西路699号', route:'地铁2号线南京西路站1号口，步行约5分钟' },
      { id: '202', campus: '舜元校区', name: '舜元B栋', status: '启用', order: 2, floors: ['1F','2F','3F'], address:'上海市静安区凤阳路568号', route:'地铁2号线南京西路站2号口，步行约7分钟' },
      { id: '601', campus: '望京校区', name: '望京A栋', status: '启用', order: 1, floors: ['3F','4F','5F'], address:'北京市朝阳区望京街9号商业楼', route:'地铁14号线望京南站A口，步行约6分钟' },
      { id: '602', campus: '望京校区', name: '望京B栋', status: '停用', order: 2, floors: ['B1','1F','2F'], address:'北京市朝阳区阜通东大街1号', route:'地铁14号线望京南站B口，步行约9分钟' }
    ],
    classrooms: [
      { id:'VISION934', name:'侨城17F-6', seats:10, type:'多媒体教室', building:'101', floor:'17F', lifecycle:'2026-02-10 ~ 2026-08-31', status:'有效', campus:'南山校区', school:'唯寻深圳' },
      { id:'VISION933', name:'侨城17F-5', seats:4, type:'多媒体教室', building:'101', floor:'17F', lifecycle:'2026-02-10 ~ 2026-08-31', status:'有效', campus:'南山校区', school:'唯寻深圳' },
      { id:'VISION932', name:'侨城17F-4', seats:4, type:'多媒体教室', building:'101', floor:'17F', lifecycle:'2026-02-10 ~ 2026-08-31', status:'有效', campus:'南山校区', school:'唯寻深圳' },
      { id:'VISION931', name:'侨城17F-3', seats:3, type:'多媒体教室', building:'101', floor:'17F', lifecycle:'2026-02-10 ~ 2026-08-31', status:'有效', campus:'南山校区', school:'唯寻深圳' },
      { id:'VISION930', name:'侨城17F-2', seats:4, type:'多媒体教室', building:'101', floor:'17F', lifecycle:'2026-02-10 ~ 2026-08-31', status:'有效', campus:'南山校区', school:'唯寻深圳' },
      { id:'VISION929', name:'侨城17F-1', seats:3, type:'多媒体教室', building:'101', floor:'17F', lifecycle:'2026-02-10 ~ 2026-08-31', status:'有效', campus:'南山校区', school:'唯寻深圳' },
      { id:'VISION928', name:'侨城15F-5', seats:6, type:'多媒体教室', building:'101', floor:'15F', lifecycle:'2026-07-01 ~ 2026-09-30', status:'有效', campus:'南山校区', school:'唯寻深圳' },
      { id:'VISION927', name:'侨城15F-4', seats:4, type:'多媒体教室', building:'101', floor:'15F', lifecycle:'2026-07-01 ~ 2026-09-30', status:'有效', campus:'南山校区', school:'唯寻深圳' },
      { id:'VISION926', name:'侨城15F-3', seats:4, type:'多媒体教室', building:'101', floor:'15F', lifecycle:'2026-07-01 ~ 2026-09-30', status:'有效', campus:'南山校区', school:'唯寻深圳' },
      { id:'VISION925', name:'侨城15F-2', seats:4, type:'多媒体教室', building:'101', floor:'15F', lifecycle:'2026-07-01 ~ 2026-09-30', status:'有效', campus:'南山校区', school:'唯寻深圳' }
    ],
    campusRules: [
      { id:1, campusCode:'3', campus:'鸿寿校区', school:'唯寻上海', campusStatus:'有效', updatedAt:'2026-08-19 16:20', updatedBy:'李春玲（VA000261）', classConfigs:{
        preset:{ enabled:true, courseMode:'all', courses:'全部课程项', reserveSeats:2, priorities:['多媒体教室','白板教室','教学点','外租教室'], effectType:'long', effectStart:'', effectEnd:'', status:'active' },
        custom:{ enabled:true, courseMode:'all', courses:'全部课程项', reserveSeats:1, priorities:['多媒体教室','白板教室','教学点','外租教室'], effectType:'long', effectStart:'', effectEnd:'', status:'active' },
        oneToOne:{ enabled:false, courseMode:'all', courses:'全部课程项', reserveSeats:0, seatLimit:4, priorities:['白板教室','多媒体教室','教学点','外租教室'], effectType:'long', effectStart:'', effectEnd:'', status:'off' }
      }},
      { id:2, campusCode:'2', campus:'舜元校区', school:'唯寻上海', campusStatus:'有效', updatedAt:'2026-08-19 14:05', updatedBy:'李春玲（VA000261）', classConfigs:{
        preset:{ enabled:true, courseMode:'all', courses:'全部课程项', reserveSeats:1, priorities:['多媒体教室','白板教室','教学点','外租教室'], effectType:'long', effectStart:'', effectEnd:'', status:'active' },
        custom:{ enabled:false, courseMode:'all', courses:'全部课程项', reserveSeats:1, priorities:['多媒体教室','白板教室','教学点','外租教室'], effectType:'long', effectStart:'', effectEnd:'', status:'off' },
        oneToOne:{ enabled:true, courseMode:'all', courses:'全部课程项', reserveSeats:0, seatLimit:4, priorities:['白板教室','多媒体教室','教学点','外租教室'], effectType:'long', effectStart:'', effectEnd:'', status:'active' }
      }},
      { id:3, campusCode:'4', campus:'雅仕校区', school:'唯寻上海', campusStatus:'无效', updatedAt:'2026-08-18 18:30', updatedBy:'李春玲（VA000261）', classConfigs:{
        preset:{ enabled:true, courseMode:'all', courses:'全部课程项', reserveSeats:2, priorities:['多媒体教室','白板教室','教学点','外租教室'], effectType:'date', effectStart:'2026-09-01T00:00:00', effectEnd:'2026-12-31T23:59:59', status:'waiting' },
        custom:{ enabled:true, courseMode:'all', courses:'全部课程项', reserveSeats:1, priorities:['多媒体教室','白板教室','教学点','外租教室'], effectType:'date', effectStart:'2026-06-01T00:00:00', effectEnd:'2026-08-20T23:59:59', status:'expired' },
        oneToOne:{ enabled:false, courseMode:'all', courses:'全部课程项', reserveSeats:0, seatLimit:4, priorities:['白板教室','多媒体教室','教学点','外租教室'], effectType:'long', effectStart:'', effectEnd:'', status:'off' }
      }}
    ],
    roomRules: [
      { id: 101, name: '深圳南山A01专用规则', scope: '深圳南山 / 侨城A栋101 / 3F / A01', allowed: '青少学科 · 预设班', auto: '参与自动匹配', roles: '教务、学管', time: '2026-08-01 至 2026-10-01', status: 'active', enabled: true },
      { id: 102, name: '暑假大教室使用限制', scope: '舜元、浦东世界广场 / ≥8座教室', allowed: '全部课程项 · 全部班型', auto: '不参与自动匹配', roles: '教务、行政', time: '暑假周一至周五 10:20-18:30', status: 'active', enabled: true },
      { id: 103, name: '成都实验室课程限制', scope: '成都 / CD-01 / 实验室', allowed: '科学实验 · 预设班、自组班', auto: '参与自动匹配', roles: '教务、学管', time: '长期有效', status: 'active', enabled: true },
      { id: 104, name: '望京A栋四层临时保留', scope: '北京望京 / 望京A栋601 / 4F', allowed: '全部课程项 · 全部班型', auto: '不参与自动匹配', roles: '仅教务主管', time: '2026-08-15 至 2026-08-31', status: 'waiting', enabled: true }
    ],
    rooms: [
      { id:'VISION934', name:'教室1', status:'有效', campus:'舜元校区', school:'唯寻上海', building:'舜元大厦', floor:'1F', seats:5, type:'白板教室', inPool:true, restrictClass:false, classTypes:['预设班','自组班','1V1'], restrictCourse:false, courses:'全部课程项', terminalBlacklist:[], blockedTimes:['2026-08-15 至 2026-09-15 10:30-15:30'], blockedPeriods:[{ startDate:'2026-08-15', endDate:'2026-09-15', startTime:'10:30', endTime:'15:30' }] },
      { id:'VISION933', name:'教室2', status:'有效', campus:'舜元校区', school:'唯寻上海', building:'舜元大厦', floor:'1F', seats:8, type:'多媒体教室', inPool:true, restrictClass:false, classTypes:['预设班','自组班','1V1'], restrictCourse:false, courses:'全部课程项', terminalBlacklist:[], blockedTimes:[], blockedPeriods:[] },
      { id:'VISION932', name:'教室3', status:'无效', campus:'雅仕校区', school:'唯寻上海', building:'雅仕大厦', floor:'2F', seats:12, type:'多媒体教室', inPool:false, restrictClass:false, classTypes:['预设班','自组班','1V1'], restrictCourse:false, courses:'全部课程项', terminalBlacklist:[], blockedTimes:[], blockedPeriods:[] },
      { id:'VISION931', name:'教室4', status:'有效', campus:'舜元校区', school:'唯寻上海', building:'雅仕大厦', floor:'2F', seats:8, type:'白板教室', inPool:true, restrictClass:false, classTypes:['预设班','自组班','1V1'], restrictCourse:false, courses:'全部课程项', terminalBlacklist:[], blockedTimes:[], blockedPeriods:[] },
      { id:'VISION930', name:'教室5', status:'有效', campus:'鸿寿校区', school:'唯寻上海', building:'鸿寿坊', floor:'3F', seats:16, type:'多媒体教室', inPool:true, restrictClass:false, classTypes:['预设班','自组班','1V1'], restrictCourse:false, courses:'全部课程项', terminalBlacklist:[], blockedTimes:[], blockedPeriods:[] },
      { id:'VISION929', name:'教室6', status:'有效', campus:'鸿寿校区', school:'唯寻上海', building:'鸿寿坊', floor:'1F', seats:6, type:'白板教室', inPool:false, restrictClass:false, classTypes:['预设班','自组班','1V1'], restrictCourse:false, courses:'全部课程项', terminalBlacklist:[], blockedTimes:[], blockedPeriods:[] }
    ],
    manualRows: [
      { id: 'C20260812001', type: 'no-room', className: 'A-Level数学预设班', classType: '预设班', time: '2026-08-18 10:30-12:30', campus: '舜元', teacher: '王老师', students: 8, reserve: 1, current: '无教室', plan: 'closed', targetRoom: 'A102（8座）', replacement: 'A101（5座）', occupiedCourse: 'IG经济自组班（5人）', status: '待人工换配' },
      { id: 'C20260812002', type: 'capacity', className: 'IG物理自组班', classType: '自组班', time: '2026-08-19 13:30-15:30', campus: '舜元', teacher: '李老师', students: 10, reserve: 1, current: 'A102（8座）', plan: 'direct', targetRoom: 'B301（16座）', replacement: '-', occupiedCourse: '-', status: '容量不符' },
      { id: 'C20260812003', type: 'no-room', className: 'STEP英语预设班', classType: '预设班', time: '2026-08-20 16:00-18:00', campus: '舜元', teacher: '周老师', students: 12, reserve: 1, current: '无教室', plan: 'open', targetRoom: 'B301（16座）', replacement: '未找到', occupiedCourse: 'A-Level化学预设班（8人）', status: '待人工换配' },
      { id: 'C20260812004', type: 'optimize', className: 'IB中文1V1', classType: '1V1', time: '2026-08-22 08:20-10:20', campus: '舜元', teacher: '陈老师', students: 1, reserve: 1, current: 'B201（12座）', plan: 'candidate', targetRoom: 'A101（5座）', replacement: '-', occupiedCourse: '-', status: '资源可优化' }
    ],
    records: [
      ['2026-08-12 10:00','定时自动','A-Level数学预设班','舜元','A102','匹配成功','全局规则 + 舜元策略','系统'],
      ['2026-08-12 09:42','人工闭环换配','IG经济自组班','舜元','A102 → A101','处理成功','人工换配方案 P20260812008','张老师'],
      ['2026-08-12 08:00','定时自动','STEP英语预设班','舜元','-','匹配失败','容量不符 / 无可用教室','系统'],
      ['2026-08-11 18:33','人工教室转移','IB数学预设班','成都','B203 → 无教室','部分完成','非闭环转移','李老师']
    ],
    matchingRecords:[
      { lessonTime:'2026-08-23 17:30-19:30', matchedAt:'2026-08-22 23:17:11', result:'已匹配', room:'鸿寿5F-G区-G4', seats:4, roomType:'多媒体教室', classCode:'01077801260822-0109', className:'吴萱-英联邦学科-ALEVEL-经济&物理-1v1', classType:'1v1', teachingMode:'OMO', campus:'鸿寿校区', student:'吴萱', memberLevel:'普通会员', currentStudents:1 },
      { lessonTime:'2026-08-23 15:45-16:15', matchedAt:'2026-08-22 21:17:09', result:'已匹配', room:'苏悦12F-B区-B14', seats:4, roomType:'多媒体教室', classCode:'01086215260821-0001', className:'David-英联邦语培-雅思-口语&写作-1v1试听', classType:'1v1', teachingMode:'OMO', campus:'苏悦校区', student:'David', memberLevel:'普通会员', currentStudents:1 },
      { lessonTime:'2026-08-23 10:30-12:00', matchedAt:'2026-08-22 20:17:15', result:'已匹配', room:'苏悦12F-B区-B14', seats:4, roomType:'多媒体教室', classCode:'01077801260821-0104', className:'邹蔚青-英联邦学科-ALEVEL-经济-1v1', classType:'1v1', teachingMode:'OMO', campus:'苏悦校区', student:'邹蔚青', memberLevel:'普通会员', currentStudents:1 },
      { lessonTime:'2026-08-23 18:30-20:30', matchedAt:'2026-08-22 19:17:06', result:'已匹配', room:'望京13F-C区-C2', seats:4, roomType:'多媒体教室', classCode:'010812501260821-0002', className:'王璞-英联邦语培-ESL-口语&阅读&听力&写作-1v1', classType:'1v1', teachingMode:'OMO', campus:'望京校区', student:'王璞', memberLevel:'普通会员', currentStudents:1 },
      { lessonTime:'2026-08-23 14:00-16:00', matchedAt:'2026-08-22 19:17:05', result:'已匹配', room:'望京13F-C区-C1', seats:4, roomType:'多媒体教室', classCode:'010812501260821-0002', className:'王璞-英联邦语培-ESL-口语&阅读&听力&写作-1v1', classType:'1v1', teachingMode:'OMO', campus:'望京校区', student:'王璞', memberLevel:'普通会员', currentStudents:1 },
      { lessonTime:'2026-08-22 16:00-17:00', matchedAt:'2026-08-22 12:16:52', result:'已匹配', room:'鸿寿3F-B区-B16', seats:2, roomType:'白板教室', classCode:'01077801260721-0010', className:'张允弘-英联邦学科-ALEVEL-生物-1v1', classType:'1v1', teachingMode:'OMO', campus:'鸿寿校区', student:'张允弘', memberLevel:'普通会员', currentStudents:1 },
      { lessonTime:'2026-08-22 13:30-15:30', matchedAt:'2026-08-22 11:17:17', result:'已匹配', room:'侨城19F-B14-欧美', seats:4, roomType:'多媒体教室', classCode:'01077801260822-0005', className:'公生明-英联邦学科-ALEVEL-数学-1v1', classType:'1v1', teachingMode:'线下', campus:'南山校区', student:'公生明', memberLevel:'普通会员', currentStudents:1 },
      { lessonTime:'2026-08-21 21:00-22:00', matchedAt:'2026-08-21 19:16:47', result:'已匹配', room:'望京13F-C区-C1', seats:4, roomType:'多媒体教室', classCode:'06053501260724-0007', className:'岩岩-宁嘉和-高端牛剑-高阶笔试-物理&数学2&…', classType:'1v1', teachingMode:'OMO', campus:'望京校区', student:'岩岩-宁嘉和', memberLevel:'黑金会员', currentStudents:1 },
      { lessonTime:'2026-08-22 13:30-15:30', matchedAt:'2026-08-21 19:16:47', result:'已匹配', room:'侨城19F-B4-达内', seats:4, roomType:'多媒体教室', classCode:'01077801260821-0104', className:'刘瑾-英联邦学科-ALEVEL-经济-1v1', classType:'1v1', teachingMode:'OMO', campus:'南山校区', student:'刘瑾', memberLevel:'黑金会员', currentStudents:1 },
      { lessonTime:'2026-08-23 18:30-19:30', matchedAt:'2026-08-21 17:17:18', result:'已匹配', room:'雅仕1F-VIP 016', seats:3, roomType:'多媒体教室', classCode:'02111601260821-0001', className:'吴羽伦-橡沐学科-IBIA单次修改-物理-1v1', classType:'1v1', teachingMode:'OMO', campus:'雅仕校区', student:'吴羽伦', memberLevel:'普通会员', currentStudents:1 }
    ],
    missingOverviewTab:'missing',
    missingLessonType:'缺教室课节',
    capacityDateRange:{ start:'2026-08-23', end:'2026-08-31' },
    capacityDrawerLessons:null,
    missingLessons:[
      { id:'ML-1', date:'2026-08-12', time:'10:30-12:30', className:'A-Level数学预设班', student:'张同学、李同学等', classType:'预设班', capacity:9, enrolled:8, campus:'舜元校区', teacher:'王老师', manager:'陈老师', note:'优先多媒体', available:3, status:'缺教室' },
      { id:'ML-2', date:'2026-08-13', time:'13:30-15:30', className:'IG物理自组班', student:'赵同学、周同学等', classType:'自组班', capacity:11, enrolled:10, campus:'舜元校区', teacher:'李老师', manager:'吕老师', note:'', available:0, status:'缺教室' },
      { id:'ML-3', date:'2026-08-14', time:'16:00-18:00', className:'STEP英语预设班', student:'孙同学、吴同学等', classType:'预设班', capacity:13, enrolled:12, campus:'雅仕校区', teacher:'周老师', manager:'陈老师', note:'', available:2, status:'缺教室' }
    ],
    capacityLessons:[
      { id:'CL-1', date:'2026-08-12', time:'10:30-12:30', className:'A-Level数学预设班', student:'张同学、李同学等', classType:'预设班', enrolled:8, capacity:9, currentRoom:'舜元大厦·教室2（VISION933）', currentSeats:8, campus:'舜元校区', teacher:'王老师', manager:'陈老师', note:'需增加1座', available:2, status:'容量不符' },
      { id:'CL-2', date:'2026-08-13', time:'13:30-15:30', className:'IG物理自组班', student:'赵同学、周同学等', classType:'自组班', enrolled:10, capacity:11, currentRoom:'雅仕大厦·教室3（VISION932）', currentSeats:9, campus:'雅仕校区', teacher:'李老师', manager:'吕老师', note:'需增加2座', available:1, status:'容量不符' },
      { id:'CL-3', date:'2026-08-14', time:'16:00-18:00', className:'STEP英语预设班', student:'孙同学、吴同学等', classType:'预设班', enrolled:12, capacity:13, currentRoom:'鸿寿坊·教室5（VISION930）', currentSeats:12, campus:'鸿寿校区', teacher:'周老师', manager:'陈老师', note:'需增加1座', available:1, status:'容量不符' },
      { id:'CL-4', date:'2026-08-23', time:'09:00-11:00', className:'IG数学预设班', student:'王同学、赵同学等', classType:'预设班', enrolled:9, capacity:10, currentRoom:'舜元大厦·教室1（VISION934）', currentSeats:8, campus:'舜元校区', teacher:'赵老师', manager:'陈老师', note:'需增加2座', available:1, status:'容量不符' },
      { id:'CL-5', date:'2026-08-24', time:'13:00-15:00', className:'GCSE物理自组班', student:'刘同学、钱同学等', classType:'自组班', enrolled:7, capacity:8, currentRoom:'雅仕大厦·教室3（VISION932）', currentSeats:6, campus:'雅仕校区', teacher:'孙老师', manager:'吕老师', note:'需增加2座', available:1, status:'容量不符' },
      { id:'CL-6', date:'2026-08-25', time:'15:30-17:30', className:'ALEVEL化学预设班', student:'陈同学、黄同学等', classType:'预设班', enrolled:11, capacity:12, currentRoom:'鸿寿坊·教室5（VISION930）', currentSeats:10, campus:'鸿寿校区', teacher:'钱老师', manager:'陈老师', note:'需增加2座', available:2, status:'容量不符' },
      { id:'CL-7', date:'2026-08-27', time:'10:30-12:30', className:'IG经济1V1', student:'李同学', classType:'1V1', enrolled:2, capacity:3, currentRoom:'舜元大厦·教室4（VISION931）', currentSeats:2, campus:'舜元校区', teacher:'李老师', manager:'吕老师', note:'需增加1座', available:1, status:'容量不符' },
      { id:'CL-8', date:'2026-08-29', time:'14:00-16:00', className:'GCSE生物自组班', student:'周同学、郑同学等', classType:'自组班', enrolled:8, capacity:9, currentRoom:'雅仕大厦·教室3（VISION932）', currentSeats:7, campus:'雅仕校区', teacher:'周老师', manager:'陈老师', note:'需增加2座', available:0, status:'容量不符' }
    ],
    mediaMatchingFailures:[
      { id:'MMF-1', classCode:'01077801260822-0109', className:'张三-ALEVEL-物理-CAIE-1V1', lessonTime:'2026-08-27 08:20-10:20', classType:'1V1', teachingMode:'OMO', student:'张三', memberLevel:'普通会员', currentStudents:1, requiredCapacity:2, campus:'舜元校区', currentBuilding:'舜元大厦', currentFloor:'10L', currentRoom:'教室01（VISION934）', currentSeats:4, manager:'张老师', exclusiveManager:'陈老师', teacherCode:'T2026086', teacherName:'王老师', roomType:'白板教室', candidateRoomIds:['MEDIA-FREE-1','MEDIA-FREE-2','MEDIA-FREE-3'] },
      { id:'MMF-2', classCode:'01086215260821-0001', className:'David-英联邦语培-雅思-口语&写作-1V1', lessonTime:'2026-08-23 15:45-16:15', classType:'1V1', teachingMode:'OMO', student:'David', memberLevel:'普通会员', currentStudents:1, requiredCapacity:2, campus:'舜元校区', currentBuilding:'舜元大厦', currentFloor:'1F', currentRoom:'教室6（VISION929）', currentSeats:6, manager:'李老师', exclusiveManager:'', teacherCode:'T2026041', teacherName:'陈老师', roomType:'白板教室', candidateRoomIds:['MEDIA-FREE-1','MEDIA-FREE-2'] },
      { id:'MMF-3', classCode:'01077801260822-0104', className:'邹蔚青-英联邦学科-ALEVEL-经济-1V1', lessonTime:'2026-08-23 10:30-12:00', classType:'1V1', teachingMode:'OMO', student:'邹蔚青', memberLevel:'黑金会员', currentStudents:1, requiredCapacity:3, campus:'舜元校区', currentBuilding:'舜元大厦', currentFloor:'1F', currentRoom:'教室4（VISION931）', currentSeats:3, manager:'周老师', exclusiveManager:'吕老师', teacherCode:'T2026112', teacherName:'赵老师', roomType:'白板教室', candidateRoomIds:[] }
    ],
    transferCandidates:{
      'ML-1':[
        { id:'free-1', kind:'free', room:'舜元大厦·教室2（VISION933）', roomCode:'VISION933', seats:12, type:'多媒体教室', location:'舜元校区' },
        { id:'closed-1', kind:'occupied', room:'舜元大厦·教室1（VISION934）', roomCode:'VISION934', seats:10, type:'白板教室', location:'舜元校区', occupiedLesson:'IG经济自组班 · 5人', replacement:'雅仕大厦·教室4（VISION931）' },
        { id:'open-1', kind:'occupied', room:'鸿寿坊·教室5（VISION930）', roomCode:'VISION930', seats:16, type:'多媒体教室', location:'鸿寿校区', occupiedLesson:'A-Level化学预设班 · 8人', replacement:'' }
      ],
      'ML-2':[],
      'ML-3':[{ id:'open-3', kind:'occupied', room:'鸿寿坊·教室5（VISION930）', roomCode:'VISION930', seats:16, type:'多媒体教室', location:'鸿寿校区', occupiedLesson:'A-Level化学预设班 · 8人', replacement:'' }],
      'CL-1':[
        { id:'cap-free-1', kind:'free', room:'教室5（VISION930）', roomName:'教室5', roomCode:'VISION930', seats:16, type:'多媒体教室', campus:'鸿寿校区', building:'鸿寿坊', floor:'3F', location:'鸿寿校区' },
        { id:'cap-closed-1', kind:'occupied', room:'教室1（VISION934）', roomName:'教室1', roomCode:'VISION934', seats:10, type:'白板教室', campus:'舜元校区', building:'舜元大厦', floor:'1F', location:'舜元校区', occupiedLesson:'IG经济自组班 · 5人', originalClassName:'IG经济自组班', originalLessonName:'IG经济核心课', originalTime:'2026-08-12 10:30-12:30', originalManager:'吕老师', originalTeacher:'李老师', originalStudents:5, replacement:'教室2（VISION933）' }
      ],
      'CL-2':[{ id:'cap-free-2', kind:'free', room:'教室5（VISION930）', roomName:'教室5', roomCode:'VISION930', seats:16, type:'多媒体教室', campus:'鸿寿校区', building:'鸿寿坊', floor:'3F', location:'鸿寿校区' }],
      'CL-3':[{ id:'cap-free-3', kind:'free', room:'教室3（VISION932）', roomName:'教室3', roomCode:'VISION932', seats:14, type:'多媒体教室', campus:'雅仕校区', building:'雅仕大厦', floor:'2F', location:'雅仕校区' }],
      'CL-4':[
        { id:'cap-free-4', kind:'free', room:'教室5（VISION930）', roomName:'教室5', roomCode:'VISION930', seats:16, type:'多媒体教室', campus:'舜元校区', building:'舜元大厦', floor:'1F', location:'舜元校区' },
        { id:'cap-swap-4', kind:'occupied', room:'教室2（VISION933）', roomName:'教室2', roomCode:'VISION933', seats:12, type:'多媒体教室', campus:'舜元校区', building:'舜元大厦', floor:'1F', location:'舜元校区', occupiedLesson:'GCSE英语自组班 · 5人', originalClassName:'GCSE英语自组班', originalLessonName:'GCSE英语阅读与写作', originalTime:'2026-08-23 09:00-11:00', originalManager:'张老师', originalTeacher:'王老师', originalEnrolled:5, originalCapacity:6, originalStudents:5, replacement:'教室1（VISION934）' },
        { id:'cap-swap-8', kind:'occupied', room:'教室8（VISION938）', roomName:'教室8', roomCode:'VISION938', seats:14, type:'多媒体教室', campus:'舜元校区', building:'舜元大厦', floor:'2F', location:'舜元校区', occupiedLesson:'A-Level物理预设班 · 7人', originalClassName:'A-Level物理预设班', originalLessonName:'力学综合训练', originalTime:'2026-08-23 09:00-11:00', originalManager:'李老师', originalTeacher:'赵老师', originalEnrolled:7, originalCapacity:10, originalStudents:7, replacement:'教室1（VISION934）' }
      ],
      'CL-5':[{ id:'cap-free-5', kind:'free', room:'教室5（VISION930）', roomName:'教室5', roomCode:'VISION930', seats:16, type:'多媒体教室', campus:'鸿寿校区', building:'鸿寿坊', floor:'3F', location:'鸿寿校区' }],
      'CL-6':[
        { id:'cap-free-6', kind:'free', room:'教室3（VISION932）', roomName:'教室3', roomCode:'VISION932', seats:14, type:'多媒体教室', campus:'雅仕校区', building:'雅仕大厦', floor:'2F', location:'雅仕校区' },
        { id:'cap-swap-6', kind:'occupied', room:'教室5（VISION930）', roomName:'教室5', roomCode:'VISION930', seats:16, type:'多媒体教室', campus:'鸿寿校区', building:'鸿寿坊', floor:'3F', location:'鸿寿校区', occupiedLesson:'A-Level生物预设班 · 8人', originalClassName:'A-Level生物预设班', originalLessonName:'A-Level生物实验课', originalTime:'2026-08-25 15:30-17:30', originalManager:'陈老师', originalTeacher:'周老师', originalStudents:8, replacement:'教室3（VISION932）' }
      ],
      'CL-7':[{ id:'cap-swap-7', kind:'occupied', room:'教室2（VISION933）', roomName:'教室2', roomCode:'VISION933', seats:12, type:'多媒体教室', campus:'舜元校区', building:'舜元大厦', floor:'1F', location:'舜元校区', occupiedLesson:'IG物理1V1 · 1人', originalClassName:'IG物理1V1', originalLessonName:'IG物理力学课', originalTime:'2026-08-27 10:30-12:30', originalManager:'吕老师', originalTeacher:'赵老师', originalStudents:1, replacement:'教室4（VISION931）' }],
      'CL-8':[]
    }
  };

  const tabs = [
    ['common','校区通用规则配置'],
    ['special','校区特殊规则配置'],
    ['pool','教室资源池管理']
  ];

  const capacityCurrentRooms = {
    'CL-1':{ name:'教室2', code:'VISION933', campus:'舜元校区', building:'舜元大厦', floor:'1F', type:'多媒体教室' },
    'CL-2':{ name:'教室3', code:'VISION932', campus:'雅仕校区', building:'雅仕大厦', floor:'2F', type:'多媒体教室' },
    'CL-3':{ name:'教室5', code:'VISION930', campus:'鸿寿校区', building:'鸿寿坊', floor:'3F', type:'多媒体教室' },
    'CL-4':{ name:'教室1', code:'VISION934', campus:'舜元校区', building:'舜元大厦', floor:'1F', type:'白板教室' },
    'CL-5':{ name:'教室3', code:'VISION932', campus:'雅仕校区', building:'雅仕大厦', floor:'2F', type:'多媒体教室' },
    'CL-6':{ name:'教室5', code:'VISION930', campus:'鸿寿校区', building:'鸿寿坊', floor:'3F', type:'多媒体教室' },
    'CL-7':{ name:'教室4', code:'VISION931', campus:'舜元校区', building:'舜元大厦', floor:'2F', type:'白板教室' },
    'CL-8':{ name:'教室3', code:'VISION932', campus:'雅仕校区', building:'雅仕大厦', floor:'2F', type:'多媒体教室' }
  };

  const mediaReplacementRooms = [
    { id:'MEDIA-FREE-1', name:'教室7', code:'VISION927', campus:'舜元校区', building:'舜元大厦', floor:'1F', type:'多媒体教室', seats:4, available:true },
    { id:'MEDIA-FREE-2', name:'教室9', code:'VISION926', campus:'舜元校区', building:'舜元大厦', floor:'2F', type:'多媒体教室', seats:8, available:true },
    { id:'MEDIA-FREE-3', name:'教室10', code:'VISION925', campus:'舜元校区', building:'舜元书院', floor:'3F', type:'多媒体教室', seats:12, available:true }
  ];

  const roomTerminalOptions = ['教务排课','教室预定','学管排课'];
  const poolClassTypes = [
    { key:'preset', label:'预设班' },
    { key:'custom', label:'自组班' },
    { key:'oneToOne', label:'1V1' }
  ];
  const courseCatalog = [
    { id:'school', label:'择校', groups:[
      { id:'school-plan', label:'择校规划', courses:['国际学校规划','本科择校规划','研究生择校规划'] },
      { id:'school-apply', label:'择校申请', courses:['美本申请','英本申请','港新申请'] }
    ]},
    { id:'premium', label:'高端', groups:[
      { id:'premium-plan', label:'高端规划', courses:['高端背景提升','高端学术规划','高端竞赛规划'] },
      { id:'premium-apply', label:'高端申请', courses:['牛剑申请','藤校申请','G5申请'] }
    ]},
    { id:'fulltime', label:'全日制', groups:[
      { id:'fulltime-subject', label:'全日制学科', courses:['IG全日制','GCSE全日制','ALEVEL全日制'] },
      { id:'fulltime-language', label:'全日制语培', courses:['雅思全日制','托福全日制','PTE全日制'] }
    ]},
    { id:'league', label:'联赛邦', groups:[
      { id:'league-language', label:'英联邦语培', courses:['雅思','托福','PTE'] },
      { id:'league-subject', label:'英联邦学科', courses:['IG引流课','GCSE高端','ALEVEL高端','GCSE','ALEVEL','学竞'] },
      { id:'league-other', label:'英联邦其他', courses:['EPQ','竞赛辅导','背景提升'] },
      { id:'league-study', label:'英联邦留学', courses:['英国本科留学','英国研究生留学','澳洲留学'] }
    ]},
    { id:'omu', label:'橡沐', groups:[
      { id:'omu-subject', label:'橡沐学科', courses:['IB学科','AP学科','国际竞赛'] },
      { id:'omu-language', label:'橡沐语培', courses:['托福强化','雅思强化','SAT强化'] }
    ]},
    { id:'junior', label:'青少', groups:[
      { id:'junior-language', label:'青少语培', courses:['青少英语','青少阅读','青少写作'] },
      { id:'junior-subject', label:'青少学科', courses:['青少数学','青少科学','青少人文'] }
    ]}
  ];

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');

  function parseCourseSelection(value) {
    const text = String(value || '').trim();
    if (!text || text === '全部课程项' || text === '不限课程项') return [];
    return [...new Set(text.split(/[、,，；;]/).map(item => item.trim()).filter(Boolean))];
  }

  function courseCascadePicker(inputId,value,visible = true,extraClass = '') {
    const selected = new Set(parseCourseSelection(value));
    let activeRoot = 'league';
    let activeGroup = 'league-subject';
    courseCatalog.some(root => root.groups.some(group => {
      if (!group.courses.some(course => selected.has(course))) return false;
      activeRoot = root.id;
      activeGroup = group.id;
      return true;
    }));
    const rootRows = courseCatalog.map(root => {
      const courses = root.groups.flatMap(group => group.courses);
      const checked = courses.length > 0 && courses.every(course => selected.has(course));
      return `<div class="course-cascade-row ${root.id === activeRoot ? 'active' : ''}" data-course-root-row="${root.id}"><label><input type="checkbox" data-course-root-check data-root-id="${root.id}" ${checked ? 'checked' : ''}><span>${root.label}</span></label><button type="button" data-action="course-cascade-root" data-root-id="${root.id}">›</button></div>`;
    }).join('');
    const groupRows = courseCatalog.flatMap(root => root.groups.map(group => {
      const checked = group.courses.length > 0 && group.courses.every(course => selected.has(course));
      return `<div class="course-cascade-row ${root.id === activeRoot ? '' : 'is-hidden'} ${group.id === activeGroup ? 'active' : ''}" data-course-group-row="${group.id}" data-root-id="${root.id}"><label><input type="checkbox" data-course-group-check data-root-id="${root.id}" data-group-id="${group.id}" ${checked ? 'checked' : ''}><span>${group.label}</span></label><button type="button" data-action="course-cascade-group" data-root-id="${root.id}" data-group-id="${group.id}">›</button></div>`;
    })).join('');
    const courseRows = courseCatalog.flatMap(root => root.groups.flatMap(group => group.courses.map((course,index) => `<label class="course-cascade-leaf ${group.id === activeGroup ? '' : 'is-hidden'}" data-course-leaf-row data-root-id="${root.id}" data-group-id="${group.id}"><input type="checkbox" data-course-leaf value="${escapeHtml(course)}" ${selected.has(course) ? 'checked' : ''}><span>${escapeHtml(course)}</span></label>`))).join('');
    const summary = selected.size ? [...selected].join('、') : '请选择课程项';
    return `<div class="course-cascade-picker ${extraClass} ${visible ? '' : 'is-hidden'}" data-course-cascade><input type="hidden" id="${inputId}" value="${escapeHtml([...selected].join('、'))}"><button type="button" class="course-cascade-summary" data-action="toggle-course-cascade" aria-expanded="false"><span data-course-summary>${escapeHtml(summary)}</span><i>⌄</i></button><div class="course-cascade-panel" data-course-panel hidden><div class="course-cascade-columns"><div class="course-cascade-column">${rootRows}</div><div class="course-cascade-column">${groupRows}</div><div class="course-cascade-column">${courseRows}</div></div></div></div>`;
  }

  function setCourseCascadeOpen(picker,open) {
    if (!picker) return;
    const panel = picker.querySelector('[data-course-panel]');
    const trigger = picker.querySelector('[data-action="toggle-course-cascade"]');
    if (!panel || !trigger) return;
    panel.hidden = !open;
    picker.classList.toggle('is-open',open);
    trigger.setAttribute('aria-expanded',String(open));
  }

  function activateCourseCascade(picker,rootId,groupId) {
    const root = courseCatalog.find(item => item.id === rootId) || courseCatalog[0];
    const group = root.groups.find(item => item.id === groupId) || root.groups[0];
    picker.querySelectorAll('[data-course-root-row]').forEach(row => row.classList.toggle('active',row.dataset.courseRootRow === root.id));
    picker.querySelectorAll('[data-course-group-row]').forEach(row => {
      row.classList.toggle('is-hidden',row.dataset.rootId !== root.id);
      row.classList.toggle('active',row.dataset.courseGroupRow === group.id);
    });
    picker.querySelectorAll('[data-course-leaf-row]').forEach(row => row.classList.toggle('is-hidden',row.dataset.groupId !== group.id));
  }

  function updateCourseCascadeSelection(picker) {
    const selected = [...picker.querySelectorAll('[data-course-leaf]:checked')].map(input => input.value);
    const hidden = picker.querySelector('input[type="hidden"]');
    hidden.value = selected.join('、');
    picker.querySelector('[data-course-summary]').textContent = selected.length ? selected.join('、') : '请选择课程项';
    picker.querySelectorAll('[data-course-group-check]').forEach(input => {
      const leaves = [...picker.querySelectorAll(`[data-course-leaf-row][data-group-id="${input.dataset.groupId}"] [data-course-leaf]`)];
      const count = leaves.filter(item => item.checked).length;
      input.checked = leaves.length > 0 && count === leaves.length;
      input.indeterminate = count > 0 && count < leaves.length;
    });
    picker.querySelectorAll('[data-course-root-check]').forEach(input => {
      const leaves = [...picker.querySelectorAll(`[data-course-leaf-row][data-root-id="${input.dataset.rootId}"] [data-course-leaf]`)];
      const count = leaves.filter(item => item.checked).length;
      input.checked = leaves.length > 0 && count === leaves.length;
      input.indeterminate = count > 0 && count < leaves.length;
    });
  }

  function toast(message, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<b>${type === 'error' ? '!' : type === 'info' ? 'i' : '✓'}</b><span>${escapeHtml(message)}</span>`;
    toastRoot.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function formatOperationTime(date = new Date()) {
    const pad = value => String(value).padStart(2,'0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function toggleAutoMatchingTask() {
    state.autoTaskEnabled = !state.autoTaskEnabled;
    const actionText = state.autoTaskEnabled ? '开启自动匹配任务' : '关闭自动匹配任务';
    state.autoTaskLogs.unshift({ operator:'李春玲（VA000261）', time:formatOperationTime(), content:actionText });
    render();
    toast(`已${state.autoTaskEnabled ? '开启' : '关闭'}自动匹配任务`,state.autoTaskEnabled ? 'success' : 'info');
  }

  function openAutoTaskLog() {
    const rows = state.autoTaskLogs.map(log => {
      const tone = log.content.startsWith('关闭') ? 'off' : log.content.startsWith('开启') ? 'on' : 'manual';
      return `<tr><td>${escapeHtml(log.operator)}</td><td>${escapeHtml(log.time)}</td><td><span class="auto-task-log-content ${tone}">${escapeHtml(log.content)}</span></td></tr>`;
    }).join('');
    const body = `<div class="modal-table auto-task-log-table"><table><thead><tr><th style="width:190px">操作人</th><th style="width:190px">操作时间</th><th>操作内容</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    openModal({ title:'教室匹配按钮操作日志', body, wide:true, confirmAction:'', cancel:'关闭' });
  }

  function renderMissingLessonsOverview() {
    const capacityMode = state.missingOverviewTab === 'capacity';
    const recordsMode = state.missingOverviewTab === 'records';
    const conflictMode = state.missingOverviewTab === 'conflicts';
    const mediaMode = !capacityMode && state.missingLessonType === '多媒体匹配失败课节';
    const teachingPointMode = !capacityMode && state.missingLessonType === '教学点课节';
    const currentRows = capacityMode ? state.capacityLessons : state.missingLessons;
    const tabs = `<div class="tabs missing-overview-tabs"><button class="tab ${state.missingOverviewTab === 'missing' ? 'active' : ''}" data-action="missing-overview-tab" data-type="missing">缺教室课节</button><button class="tab ${capacityMode ? 'active' : ''}" data-action="missing-overview-tab" data-type="capacity">容量不符课节</button><button class="tab ${recordsMode ? 'active' : ''}" data-action="missing-overview-tab" data-type="records">教室匹配记录</button><button class="tab ${conflictMode ? 'active' : ''}" data-action="missing-overview-tab" data-type="conflicts">校区冲突</button></div>`;
    if (recordsMode) return `<div class="page-head"><h1>教室匹配记录</h1></div>${tabs}${renderMatchingRecordsPage()}`;
    if (conflictMode) return `<div class="page-head"><h1>校区冲突</h1></div>${tabs}${notice('展示同一课节在多个校区或教室安排中产生的资源冲突。')}<div class="empty"><div class="empty-inner"><div class="empty-icon">□</div>暂无校区冲突记录</div></div>`;
    return `<div class="page-head"><h1>缺教室课节</h1><div class="head-actions"><button class="auto-task-toggle ${state.autoTaskEnabled ? 'on' : 'off'}" data-action="toggle-auto-matching-task"><i></i>${state.autoTaskEnabled ? '已开启自动匹配' : '已关闭自动匹配'}</button><button class="btn auto-task-log-button" data-action="open-auto-task-log" title="操作日志" aria-label="查看教室匹配按钮操作日志"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.35-5.65L4 8.7"></path><path d="M4 4v4.7h4.7"></path><path d="M12 7.5V12l3 1.8"></path></svg></button></div></div>
      ${tabs}
      ${notice(capacityMode ? '包含已排教室、教学点但当前教室座位数小于需要的教室容量的线下课程、OMO课程' : mediaMode ? '展示学生要求使用多媒体教室，但当前匹配为其他教室类型的课节' : teachingPointMode ? '展示当前已安排至教学点的课节' : '包含缺教室的课次类型：1、线下课程；2、OMO课程；包含排了教学点的课节；包含多媒体教室匹配失败的课节')}
      <div class="missing-overview-filter ${capacityMode ? 'capacity-filter' : ''}">
        ${capacityMode ? `<div class="filter-item filter-campus"><label>归属校区</label><div class="capacity-campus-select"><span>舜元中心<i>×</i></span><span>雅仕校区<i>×</i></span><span>鸿寿校区<i>×</i></span><b>⌄</b></div></div>
        <div class="filter-item filter-capacity"><label>需要的教室容量</label><div class="capacity-range capacity-step-range"><div class="capacity-stepper"><button type="button" data-action="adjust-capacity-filter" data-target="capacity-min" data-delta="-1">−</button><input id="capacity-min" type="number" min="0" placeholder="最小座位"><button type="button" data-action="adjust-capacity-filter" data-target="capacity-min" data-delta="1">＋</button></div><em>—</em><div class="capacity-stepper"><button type="button" data-action="adjust-capacity-filter" data-target="capacity-max" data-delta="-1">−</button><input id="capacity-max" type="number" min="0" placeholder="最大座位"><button type="button" data-action="adjust-capacity-filter" data-target="capacity-max" data-delta="1">＋</button></div></div></div>
        <div class="filter-item filter-manager"><label>专属班主任</label><input class="text-input" placeholder="请输入搜索"></div>
        <div class="filter-item filter-date"><label>统计日期</label><div class="capacity-date-range"><span>▦</span><input id="capacity-date-start" value="${state.capacityDateRange.start}"><em>至</em><input id="capacity-date-end" value="${state.capacityDateRange.end}"></div></div>
        <div class="filter-item filter-week"><label>星期</label>${select('请选择',['星期一','星期二','星期三','星期四','星期五','星期六','星期日'])}</div>
        <div class="filter-item filter-time"><label>统计时间段</label><input class="text-input" value="00:00-23:59"></div>` : `<div class="filter-item filter-campus"><label>归属校区</label>${select('全部校区',['舜元校区','雅仕校区','鸿寿校区'])}</div>
        <div class="filter-item filter-capacity"><label>需要的教室容量</label><div class="capacity-range"><input class="text-input" type="number" min="0" placeholder="最小座位"><span>—</span><input class="text-input" type="number" min="0" placeholder="最大座位"></div></div>
        <div class="filter-item filter-manager"><label>专属班主任</label><input class="text-input" placeholder="请输入搜索"></div>
        <div class="filter-item filter-date"><label>统计日期</label><input class="text-input" value="2026-08-12 至 2026-08-31"></div>
        <div class="filter-item filter-week"><label>星期</label>${select('请选择',['星期一','星期二','星期三','星期四','星期五','星期六','星期日'])}</div>
        <div class="filter-item filter-time"><label>统计时间段</label><input class="text-input" value="00:00-23:59"></div>
        <div class="filter-item filter-lesson-type"><label>课节类型</label><select class="select-input" data-missing-lesson-type><option ${state.missingLessonType === '缺教室课节' ? 'selected' : ''}>缺教室课节</option><option ${state.missingLessonType === '教学点课节' ? 'selected' : ''}>教学点课节</option><option ${state.missingLessonType === '多媒体匹配失败课节' ? 'selected' : ''}>多媒体匹配失败课节</option></select></div>`}
        <div class="filter-actions"><button class="btn" data-action="reset-filter">重置</button><button class="btn primary" data-action="query">查询</button></div>
      </div>
      <button class="btn primary missing-detail-button" data-action="${mediaMode ? 'open-media-failure-detail' : 'open-missing-detail'}" data-type="${capacityMode ? 'capacity' : teachingPointMode ? 'teaching-point' : 'missing'}">查看明细</button>
      <div class="missing-warning"><b>教室预警：</b>${mediaMode ? `<span>多媒体教室匹配失败课节：</span><strong>${state.mediaMatchingFailures.length}节</strong>` : teachingPointMode ? '<span>教学点课节：</span><strong>0节</strong>' : `${capacityMode ? '' : '<span>可用教室不足！</span> '} ${capacityMode ? '当前教室容量不符的课' : '无法匹配到教室的课'}：<strong>${currentRows.filter(item => item.status === (capacityMode ? '容量不符' : '缺教室')).length}节</strong>`}</div>
      ${renderLessonBarChart(capacityMode,state.missingLessonType)}`;
  }

  function renderMatchingRecordsPage() {
    const rows = state.matchingRecords.map((record,index) => `<tr class="${index === 0 ? 'is-selected' : ''}">
      <td>${record.lessonTime}</td><td>${record.matchedAt}</td><td>${record.result}</td><td><span class="record-cell-ellipsis" title="${escapeHtml(record.room)}">${escapeHtml(record.room)}</span></td><td>${record.seats}</td><td>${record.roomType}</td><td>${record.classCode}</td><td><span class="record-cell-ellipsis" title="${escapeHtml(record.className)}">${escapeHtml(record.className)}</span></td><td>${record.classType}</td><td>${record.teachingMode}</td><td>${record.campus}</td><td>${escapeHtml(record.student)}</td><td>${record.memberLevel}</td><td>${record.currentStudents}</td><td></td>
    </tr>`).join('');
    return `<div class="matching-record-filter"><div class="matching-record-filter-grid">
      <div class="filter-item"><label>课程时间</label><div class="record-date-range"><span>▦</span><input value="2026-08-01"><em>至</em><input value="2026-08-23"></div></div>
      <div class="filter-item"><label>匹配结果</label>${select('选择匹配结果',['已匹配','匹配失败'])}</div>
      <div class="filter-item"><label>教室类型</label>${select('选择教室类型',['多媒体教室','白板教室','教学点'])}</div>
      <div class="filter-item"><label>班级类型</label>${select('选择班级类型',['预设班','自组班','1V1'])}</div>
      <div class="filter-item"><label>班主任姓名</label><input class="text-input" placeholder="请输入关键字查询"></div>
      <div class="filter-item"><label>班级名称</label><input class="text-input" placeholder="班级名称"></div>
      <div class="filter-item"><label>班级编号</label><input class="text-input" placeholder="班级编号"></div>
      <div class="filter-item"><label>学生姓名</label><input class="text-input" placeholder="姓名"></div>
      <div class="filter-item"><label>状态</label>${select('有效',['无效'])}</div>
      <div class="filter-actions"><button class="btn" data-action="reset-filter">重置</button><button class="btn primary" data-action="query">查询</button></div>
    </div></div>
    <div class="matching-record-summary"><span>匹配失败课节数：<b>1223</b></span><span>匹配教学点课节数：<b>0</b></span></div>
    <div class="matching-record-toolbar"><button class="btn primary">导出Excel</button></div>
    <div class="data-table matching-record-table"><table><colgroup><col style="width:130px"><col style="width:125px"><col style="width:70px"><col style="width:120px"><col style="width:75px"><col style="width:100px"><col style="width:150px"><col style="width:230px"><col style="width:70px"><col style="width:75px"><col style="width:85px"><col style="width:120px"><col style="width:90px"><col style="width:95px"><col style="width:48px"></colgroup><thead><tr><th>课节时间</th><th>匹配时间</th><th>匹配结果</th><th>教室名称</th><th>教室座位数</th><th>教室类型</th><th>班级编号</th><th>班级名称</th><th>班级类型</th><th>授课模式</th><th>上课校区</th><th>学生</th><th>会员等级</th><th>班级当前人数</th><th class="record-column-setting"><button type="button" title="列设置">☷</button></th></tr></thead><tbody>${rows}</tbody></table></div>${renderMatchingRecordPagination()}`;
  }

  function renderMatchingRecordPagination() {
    return `<div class="pagination matching-record-pagination"><button class="mini-btn" disabled>‹</button><button class="mini-btn blue">1</button><button class="mini-btn">2</button><button class="mini-btn">3</button><button class="mini-btn">4</button><button class="mini-btn">5</button><button class="mini-btn">6</button><span>…</span><button class="mini-btn">318</button><button class="mini-btn">›</button><select class="select-input"><option>10条/页</option></select><span>共3176条</span><span>前往</span><input class="number-input" value="1"><span>页</span></div>`;
  }

  function renderLessonBarChart(capacityMode,lessonType = '缺教室课节') {
    const mediaMode = !capacityMode && lessonType === '多媒体匹配失败课节';
    const teachingPointMode = !capacityMode && lessonType === '教学点课节';
    const title = capacityMode ? '教室容量不符的课节数' : mediaMode ? '多媒体教室匹配失败的课节数' : teachingPointMode ? '教学点的课节数' : '缺教室的课节数';
    const mediaValues = Array.from({ length:29 },(_,index) => {
      const date = `2026-08-${String(index + 3).padStart(2,'0')}`;
      return state.mediaMatchingFailures.filter(lesson => lesson.lessonTime.startsWith(date)).length;
    });
    const values = capacityMode
      ? [2,3,3,2,2,3,2,2,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0]
      : mediaMode ? mediaValues : teachingPointMode ? Array(29).fill(0) : [5,6,6,4,4,6,5,3,2,3,3,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1];
    const bars = values.map((value,index) => {
      const date = `2026-08-${String(index + 3).padStart(2,'0')}`;
      const interaction = capacityMode ? ` data-action="open-capacity-date-detail" data-date="${date}" role="button" tabindex="0"` : mediaMode ? ` data-action="open-media-failure-detail" data-date="${date}" role="button" tabindex="0"` : '';
      const clickable = capacityMode || mediaMode;
      return `<div class="chart-column ${clickable ? 'is-clickable' : ''}"${interaction} title="${date} · ${title}：${value}"><div class="chart-bar ${capacityMode || mediaMode ? 'orange-bar' : ''}" style="height:${value / 6 * 100}%"><b>${value || ''}</b></div><span>${index % 2 === 0 ? date : ''}</span></div>`;
    }).join('');
    return `<div class="missing-chart-panel lesson-chart-panel"><div class="lesson-chart-head"><h3>${title}</h3><div class="lesson-chart-legend"><i class="${capacityMode || mediaMode ? 'orange' : ''}"></i><span>${title}</span></div></div><div class="missing-chart"><div class="chart-axis">${[6,5,4,3,2,1,0].map(value => `<span>${value}</span>`).join('')}</div><div class="chart-grid-lines">${[0,1,2,3,4,5,6].map(value => `<i style="top:${value / 6 * 100}%"></i>`).join('')}</div><div class="chart-columns">${bars}</div></div><div class="lesson-chart-scroll"><i></i></div></div>`;
  }

  function renderMissingLessonsTable() {
    const rows = state.missingLessons.map((lesson,index) => `<tr>
      <td>${lesson.date}</td><td>${lesson.time}</td><td title="${escapeHtml(lesson.className)}"><span class="drawer-ellipsis">${escapeHtml(lesson.className)}</span></td><td title="${escapeHtml(lesson.student)}"><span class="drawer-ellipsis">${escapeHtml(lesson.student)}</span></td><td>${lesson.classType}</td><td>${lesson.capacity}</td><td>${lesson.enrolled}</td><td>${lesson.campus}</td><td>${lesson.teacher}</td><td>${lesson.manager}</td><td>${index % 2 === 0 ? '多媒体' : '--'}</td><td>${lesson.note}</td><td><span class="candidate-count ${Number(lesson.available) === 0 ? 'zero' : ''}">${lesson.available}</span></td><td><div class="drawer-actions"><button class="drawer-action" data-action="transfer-room" data-id="${lesson.id}" ${lesson.status !== '缺教室' ? 'disabled' : ''}>匹配教室</button><button class="drawer-action" data-action="convert-online" data-id="${lesson.id}" ${lesson.status !== '缺教室' ? 'disabled' : ''}>转线上</button></div></td>
    </tr>`).join('');
    return `<div class="missing-drawer-table"><table><colgroup><col style="width:6%"><col style="width:6%"><col style="width:9%"><col style="width:10%"><col style="width:5%"><col style="width:6%"><col style="width:5%"><col style="width:7%"><col style="width:7%"><col style="width:7%"><col style="width:6%"><col style="width:6%"><col style="width:6%"><col style="width:8%"></colgroup><thead><tr><th>上课日期</th><th>上课时间</th><th>班级</th><th>学生</th><th>班型</th><th>需要的教室容量</th><th>进班人数</th><th>上课校区</th><th>班课班主任</th><th>专属班主任</th><th>教室偏好</th><th>备注</th><th>可用教室</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div><div class="missing-drawer-pagination"><button disabled>‹</button><button class="active">1</button><button disabled>›</button><select><option>300条/页</option></select><span>共${state.missingLessons.length}条</span><span>前往</span><input value="1"><span>页</span></div>`;
  }

  function availableRoomCount(lessonId) {
    const lesson = state.capacityLessons.find(item => item.id === lessonId);
    return (state.transferCandidates[lessonId] || []).filter(candidate => (candidate.kind === 'free' || candidate.kind === 'occupied') && (!lesson || candidate.campus === lesson.campus)).length;
  }

  function capacityCurrentRoomDisplay(value) {
    const text = String(value || '');
    return text.match(/([^·]+（[^）]+）)$/)?.[1] || text;
  }

  function renderCapacityLessonsTable() {
    const visibleLessons = state.capacityDrawerLessons || state.capacityLessons;
    const rows = visibleLessons.map((lesson,index) => {
      const available = availableRoomCount(lesson.id);
      const currentRoom = capacityCurrentRoomDisplay(lesson.currentRoom);
      const currentDifference = Number(lesson.currentSeats) - Number(lesson.capacity);
      const currentDifferenceText = currentDifference > 0 ? `+${currentDifference}` : String(currentDifference);
      return `<tr><td>${lesson.date}</td><td>${lesson.time}</td><td title="${escapeHtml(lesson.className)}"><span class="drawer-ellipsis">${escapeHtml(lesson.className)}</span></td><td>${lesson.classType}</td><td>${lesson.campus}</td><td>${lesson.enrolled}</td><td>${lesson.capacity}</td><td title="${escapeHtml(currentRoom)}"><span class="drawer-ellipsis">${escapeHtml(currentRoom)}</span></td><td>${lesson.currentSeats}</td><td><span class="${currentDifference >= 0 ? 'capacity-value-good' : 'capacity-value-bad'}">${currentDifferenceText}</span></td><td>${lesson.teacher}</td><td>${lesson.manager}</td><td>${index % 2 === 0 ? '多媒体' : '--'}</td><td>--</td><td>${available > 0 ? `<button class="candidate-count capacity-link" data-action="transfer-room" data-id="${lesson.id}">${available}</button>` : '<span class="candidate-count capacity-zero">0</span>'}</td></tr>`;
    }).join('');
    return `<div class="missing-drawer-table capacity-drawer-table"><table><colgroup><col style="width:6%"><col style="width:6%"><col style="width:11%"><col style="width:5%"><col style="width:7%"><col style="width:6%"><col style="width:7%"><col style="width:11%"><col style="width:7%"><col style="width:6%"><col style="width:8%"><col style="width:8%"><col style="width:5%"><col style="width:4%"><col style="width:3%"></colgroup><thead><tr><th>上课日期</th><th>上课时间</th><th>班级</th><th>班型</th><th>上课校区</th><th>进班人数</th><th>需要的教室容量</th><th>当前教室</th><th>当前教室容量</th><th>当前差额</th><th>班课班主任</th><th>专属班主任</th><th>教室偏好</th><th>备注</th><th>可用教室</th></tr></thead><tbody>${rows}</tbody></table></div><div class="missing-drawer-pagination"><button disabled>‹</button><button class="active">1</button><button disabled>›</button><select><option>300条/页</option></select><span>共${visibleLessons.length}条</span><span>前往</span><input value="1"><span>页</span></div>`;
  }

  function mediaReplacementCandidates(lesson) {
    const allowedIds = Array.isArray(lesson.candidateRoomIds) ? lesson.candidateRoomIds : null;
    return mediaReplacementRooms
      .filter(room => room.available && room.type === '多媒体教室' && room.campus === lesson.campus && room.seats >= lesson.requiredCapacity && (!allowedIds || allowedIds.includes(room.id)))
      .sort((left,right) => {
        const leftDistance = Math.abs(Number.parseInt(left.floor,10) - Number.parseInt(lesson.currentFloor,10));
        const rightDistance = Math.abs(Number.parseInt(right.floor,10) - Number.parseInt(lesson.currentFloor,10));
        return leftDistance - rightDistance || left.seats - right.seats;
      });
  }

  function renderMediaMatchingFailureTable(lessons = state.mediaMatchingFailures) {
    const rows = lessons.map(lesson => {
      const canReplace = mediaReplacementCandidates(lesson).length > 0;
      const courseName = mediaCourseName(lesson.className);
      return `<tr>
      <td><span class="drawer-ellipsis" title="${escapeHtml(lesson.classCode)}">${escapeHtml(lesson.classCode)}</span></td>
      <td><span class="drawer-ellipsis" title="${escapeHtml(lesson.className)}">${escapeHtml(lesson.className)}</span></td>
      <td>${lesson.lessonTime}</td><td><span class="drawer-ellipsis" title="${escapeHtml(courseName)}">${escapeHtml(courseName)}</span></td><td>${lesson.classType}</td><td>${lesson.teachingMode}</td><td>${escapeHtml(lesson.student)}</td><td>${lesson.memberLevel}</td><td>${escapeHtml(lesson.manager)}</td><td>${escapeHtml(lesson.exclusiveManager || '--')}</td><td>${lesson.teacherCode}</td><td>多媒体</td><td>${lesson.roomType}</td>
      <td><div class="drawer-actions"><button class="drawer-action" data-action="open-media-lesson-copy" data-id="${lesson.id}">复制课节信息</button><button class="drawer-action" data-action="replace-media-room" data-id="${lesson.id}" ${canReplace ? '' : 'disabled'}>更换教室</button></div></td>
    </tr>`;
    }).join('');
    return `<div class="missing-drawer-table media-failure-table"><table><colgroup><col style="width:8%"><col style="width:12%"><col style="width:9%"><col style="width:10%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:6%"><col style="width:6%"><col style="width:6%"><col style="width:6%"><col style="width:5%"><col style="width:12%"></colgroup><thead><tr><th>班级编号</th><th>班级名称</th><th>课节时间</th><th>课程名称</th><th>班型</th><th>授课模式</th><th>学生</th><th>会员等级</th><th>班课班主任</th><th>专属班主任</th><th>授课老师</th><th>教室偏好</th><th>当前教室类型</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div><div class="missing-drawer-pagination"><button disabled>‹</button><button class="active">1</button><button disabled>›</button><select><option>300条/页</option></select><span>共${lessons.length}条</span><span>前往</span><input value="1"><span>页</span></div>`;
  }

  function mediaCourseName(className) {
    const match = String(className || '').match(/(?:ALEVEL|雅思).*$/);
    return match ? match[0] : '--';
  }

  function openMediaMatchingFailureDrawer(selectedDate = '') {
    const lessons = selectedDate ? state.mediaMatchingFailures.filter(lesson => lesson.lessonTime.startsWith(selectedDate)) : state.mediaMatchingFailures;
    const title = selectedDate ? `多媒体匹配失败课节（${selectedDate}）` : '多媒体匹配失败课节';
    modalRoot.innerHTML = `<div class="missing-drawer-mask"><aside class="missing-drawer media-failure-drawer"><div class="missing-drawer-head"><button class="missing-drawer-close" data-action="close-modal">×</button><h2>${title}</h2><div class="drawer-head-actions"><button class="btn primary">导出Excel</button></div></div><div class="missing-drawer-body">${renderMediaMatchingFailureTable(lessons)}</div></aside></div>`;
  }

  function mediaMatchedRoomText(lesson) {
    const roomName = String(lesson.currentRoom || '--').replace(/[（(].*$/, '');
    return `${roomName}-${lesson.campus}-${lesson.currentFloor}-${lesson.roomType}`;
  }

  function mediaLessonNoticeText(lesson) {
    return [
      '多媒体教室匹配失败通知',
      `学生姓名：${lesson.student}`,
      `课程名称：${mediaCourseName(lesson.className)}`,
      `上课时间：${lesson.lessonTime}`,
      `班级名称：${lesson.className}`,
      '教室偏好：多媒体',
      `已匹配教室：${mediaMatchedRoomText(lesson)}`
    ].join('\n');
  }

  function openMediaLessonCopyDialog(id) {
    const lesson = state.mediaMatchingFailures.find(item => item.id === id);
    if (!lesson) return;
    const courseName = mediaCourseName(lesson.className);
    const matchedRoom = mediaMatchedRoomText(lesson);
    modalRoot.insertAdjacentHTML('beforeend',`<div class="modal-mask media-copy-dialog-mask" data-media-copy-dialog><div class="modal media-copy-dialog"><div class="modal-head"><h2>复制课节信息</h2><button class="modal-close" data-action="close-media-copy-dialog">×</button></div><div class="modal-body"><section class="media-copy-notice"><h3>多媒体教室匹配失败通知</h3><dl><div><dt>学生姓名</dt><dd>${escapeHtml(lesson.student)}</dd></div><div><dt>课程名称</dt><dd>${escapeHtml(courseName)}</dd></div><div><dt>上课时间</dt><dd>${escapeHtml(lesson.lessonTime)}</dd></div><div><dt>班级名称</dt><dd>${escapeHtml(lesson.className)}</dd></div><div><dt>教室偏好</dt><dd>多媒体</dd></div><div><dt>已匹配教室</dt><dd>${escapeHtml(matchedRoom)}</dd></div></dl></section></div><div class="modal-foot"><button class="btn" data-action="close-media-copy-dialog">关闭</button><button class="btn primary" data-action="copy-media-lesson-content" data-id="${lesson.id}">复制</button></div></div></div>`);
  }

  async function copyMediaLessonInfo(id,button) {
    const lesson = state.mediaMatchingFailures.find(item => item.id === id);
    if (!lesson) return;
    const text = mediaLessonNoticeText(lesson);
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      copied = document.execCommand('copy');
      textarea.remove();
    }
    if (!copied) return toast('复制失败，请手动选择内容复制','error');
    button.textContent = '已复制';
    toast('课节信息已复制');
  }

  function renderMediaFreeCandidate(room,lesson,index) {
    const result = capacityMetric('更换后',room.seats,lesson.requiredCapacity);
    return `<label class="transfer-candidate capacity-room-candidate ${index === 0 ? 'selected' : ''}" data-media-room-option data-room-name="${escapeHtml(room.name)}" data-room-building="${escapeHtml(room.building)}" data-room-floor="${room.floor}" data-room-type="${room.type}" data-room-seats="${room.seats}"><input type="radio" name="media-room" value="${room.id}" ${index === 0 ? 'checked' : ''}><div class="capacity-candidate-head"><b>${escapeHtml(room.name)}</b><span class="capacity-room-code">（${escapeHtml(room.code)}）</span></div><div class="capacity-room-meta"><span><em>所属校区</em>${room.campus}</span><span><em>楼栋</em>${room.building}</span><span><em>楼层</em>${room.floor}</span><span><em>教室类型</em>${room.type}</span><span><em>教室座位数</em>${room.seats}</span><span><em>${result.label}</em><b class="${result.className}">${result.value}</b></span></div></label>`;
  }

  function renderMediaCandidateFilter(candidates) {
    const buildings = [...new Set(candidates.map(room => room.building))];
    const floors = [...new Set(candidates.map(room => room.floor))];
    const types = [...new Set(candidates.map(room => room.type))];
    return `<div class="capacity-query-block"><button class="capacity-query-toggle" type="button" data-action="toggle-capacity-query" aria-expanded="false"><span>教室查询</span><b><em>展开</em><i>⌄</i></b></button><div class="capacity-transfer-filter replacement-query-panel media-capacity-query-panel" data-capacity-query-panel hidden><div class="filter-item"><label>所在楼栋</label><select class="select-input" id="media-room-filter-building"><option value="">全部楼栋</option>${buildings.map(building => `<option value="${escapeHtml(building)}">${escapeHtml(building)}</option>`).join('')}</select></div><div class="filter-item"><label>教室楼层</label><select class="select-input" id="media-room-filter-floor"><option value="">全部楼层</option>${floors.map(floor => `<option value="${floor}">${floor}</option>`).join('')}</select></div><div class="filter-item"><label>教室类型</label><select class="select-input" id="media-room-filter-type"><option value="">全部类型</option>${types.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('')}</select></div><div class="filter-item"><label>教室名称</label><input class="text-input" id="media-room-filter-name" placeholder="请输入教室名称"></div><div class="replacement-query-actions"><button class="btn" data-action="reset-media-room-filter">重置</button><button class="btn primary" data-action="filter-media-rooms">查询</button></div></div></div>`;
  }

  function openMediaRoomReplacement(id) {
    const lesson = state.mediaMatchingFailures.find(item => item.id === id);
    if (!lesson) return;
    const candidates = mediaReplacementCandidates(lesson);
    if (!candidates.length) return toast('暂无可更换的多媒体教室','error');
    const roomCards = candidates.map((room,index) => renderMediaFreeCandidate(room,lesson,index)).join('');
    const currentRoom = `${lesson.currentRoom} · ${lesson.campus} · ${lesson.currentBuilding} · ${lesson.currentFloor} · ${lesson.roomType}`;
    const currentResult = capacityMetric('当前',lesson.currentSeats,lesson.requiredCapacity);
    const body = `<div class="capacity-section-title">待调整课节信息</div><div class="capacity-transfer-summary"><div class="capacity-summary-card capacity-summary-grid"><div><span>班级名称：</span><b>${escapeHtml(lesson.className)}</b></div><div><span>上课时间：</span><b>${lesson.lessonTime}</b></div><div><span>当前教室：</span><b>${escapeHtml(currentRoom)}</b></div><div><span>教室容量：</span><b>当前进班 ${lesson.currentStudents} / 需要的教室容量 ${lesson.requiredCapacity} / 当前教室座位数 ${lesson.currentSeats} / ${currentResult.label} <i class="${currentResult.className}">${currentResult.value}</i></b></div></div></div>
      ${renderMediaCandidateFilter(candidates)}
      <div class="transfer-group capacity-transfer-group"><div class="transfer-group-title"><h3 class="capacity-group-tag free">空闲教室</h3><span data-media-room-count>${candidates.length}间</span></div>${roomCards}<div class="empty-candidates is-hidden" data-media-room-empty>暂无符合条件的空闲教室</div></div>`;
    openModal({ title:'更换教室', body, wide:true, confirm:'确认更换', confirmAction:'confirm-media-room', cancel:'取消' });
    modalRoot.querySelector('[data-action="confirm-media-room"]').dataset.id = id;
  }

  function applyMediaRoomFilter() {
    const building = document.getElementById('media-room-filter-building')?.value || '';
    const floor = document.getElementById('media-room-filter-floor')?.value || '';
    const type = document.getElementById('media-room-filter-type')?.value || '';
    const name = document.getElementById('media-room-filter-name')?.value.trim() || '';
    const options = [...modalRoot.querySelectorAll('[data-media-room-option]')];
    const visible = options.filter(option => {
      const matched = (!building || option.dataset.roomBuilding === building) && (!floor || option.dataset.roomFloor === floor) && (!type || option.dataset.roomType === type) && (!name || option.dataset.roomName.includes(name));
      option.classList.toggle('is-hidden',!matched);
      return matched;
    });
    let selected = modalRoot.querySelector('input[name="media-room"]:checked')?.closest('[data-media-room-option]');
    if (!selected || selected.classList.contains('is-hidden')) selected = visible[0] || null;
    options.forEach(option => {
      option.querySelector('input[name="media-room"]').checked = option === selected;
      option.classList.toggle('selected',option === selected);
    });
    modalRoot.querySelector('[data-media-room-count]').textContent = `${visible.length}间`;
    modalRoot.querySelector('[data-media-room-empty]').classList.toggle('is-hidden',visible.length > 0);
    modalRoot.querySelector('[data-action="confirm-media-room"]').disabled = visible.length === 0;
  }

  function resetMediaRoomFilter() {
    ['media-room-filter-building','media-room-filter-floor','media-room-filter-type','media-room-filter-name'].forEach(id => {
      const control = document.getElementById(id);
      if (control) control.value = '';
    });
    applyMediaRoomFilter();
  }

  function confirmMediaRoom(id) {
    const lesson = state.mediaMatchingFailures.find(item => item.id === id);
    const room = mediaReplacementRooms.find(item => item.id === modalRoot.querySelector('input[name="media-room"]:checked')?.value);
    if (!room) return toast('请选择空闲教室','error');
    closeModal();
    if (lesson) toast(`${lesson.className}已更换至${room.name}（${room.code}）`);
  }

  function openMissingLessonsDrawer(type = 'missing',selectedDate = '') {
    const capacityMode = type === 'capacity';
    state.capacityDrawerLessons = capacityMode
      ? state.capacityLessons.filter(lesson => selectedDate ? lesson.date === selectedDate : lesson.date >= state.capacityDateRange.start && lesson.date <= state.capacityDateRange.end)
      : null;
    modalRoot.innerHTML = `<div class="missing-drawer-mask"><aside class="missing-drawer ${capacityMode ? 'capacity-detail-drawer' : ''}"><div class="missing-drawer-head"><button class="missing-drawer-close" data-action="close-modal">×</button><h2>${capacityMode ? '容量不符课节明细' : '缺教室课节明细'}</h2><button class="btn primary">导出Excel</button></div><div class="missing-drawer-body">${capacityMode ? renderCapacityLessonsTable() : renderMissingLessonsTable()}</div></aside></div>`;
  }

  function openCampusRuleDetail(id) {
    const rule = state.campusRules.find(item => String(item.id) === String(id));
    if (!rule) return;
    const body = `<div class="campus-rule-overview"><span>配置校区</span><b>${escapeHtml(rule.campus)}</b></div>
      <div class="campus-class-detail-grid">${['preset','custom','oneToOne'].filter(key => rule.classConfigs[key].enabled).map(key => campusClassDetailCard(key,rule.classConfigs[key])).join('')}</div>`;
    const editable = rule.campusStatus !== '无效';
    openModal({ title:'查看校区特殊规则', body, wide:true, confirm:'编辑', confirmAction:editable ? 'edit-campus-from-detail' : '', cancel:'关闭' });
    const editButton = modalRoot.querySelector('[data-action="edit-campus-from-detail"]');
    if (editButton) editButton.dataset.id = rule.id;
  }

  function campusClassDetailCard(key,config) {
    const labels = { preset:'预设班特殊规则', custom:'自组班特殊规则', oneToOne:'1V1特殊规则' };
    const seatLimit = key === 'oneToOne' ? `<div><dt>教室座位数上限</dt><dd>${config.seatLimit || state.commonRule.oneToOneSeatLimit}座</dd></div>` : '';
    return `<section class="campus-class-card detail" data-campus-class-card="${key}"><div class="campus-class-card-head"><h3>${labels[key]}</h3>${statusText(resolveCampusConfigStatus(config))}</div><dl><div><dt>适用课程项</dt><dd>${escapeHtml(config.courseMode === 'all' ? '全部课程项' : config.courses)}</dd></div><div><dt>预留座位</dt><dd>${config.reserveSeats}座</dd></div>${seatLimit}<div><dt>教室优先级</dt><dd>${escapeHtml(config.priorities.join(' → '))}</dd></div><div><dt>生效时间</dt><dd>${escapeHtml(campusEffectText(config))}</dd></div></dl></section>`;
  }

  function roomRuleSummary(room) {
    const classes = room.restrictClass ? room.classTypes.join('、') : '全部班型';
    const courses = room.restrictCourse && room.courses ? room.courses : '全部课程项';
    const blocked = room.blockedTimes.length ? `${room.blockedTimes.length}个禁止时段` : '无禁止时段';
    return `<div class="room-rule-summary"><span>${escapeHtml(classes)}</span><span>${escapeHtml(courses)}</span><span>${blocked}</span></div>`;
  }

  function syncPoolClassCourseAvailability(openWhenSpecified = false) {
    const settings = modalRoot.querySelector('[data-pool-course-settings]');
    if (!settings) return;
    const specified = settings.querySelector('[data-pool-course-mode]:checked')?.value === 'specified';
    const courseInput = settings.querySelector('.pool-course-input');
    if (!courseInput) return;
    courseInput.classList.toggle('is-hidden',!specified);
    courseInput.querySelectorAll('input,button').forEach(control => { control.disabled = !specified; });
    if (!specified) setCourseCascadeOpen(courseInput,false);
    else if (openWhenSpecified) setCourseCascadeOpen(courseInput,true);
  }

  const allFloorOptions = ['B2','B1',...Array.from({length:36},(_,index)=>`${index + 1}F`)];
  const buildingOrderNames = ['一','二','三','四','五','六','七','八','九','十'];
  const campusLocationOptions = [
    { province:'北京市', cities:['北京市'] },
    { province:'天津市', cities:['天津市'] },
    { province:'河北省', cities:['石家庄市','唐山市','秦皇岛市','保定市'] },
    { province:'山西省', cities:['太原市','大同市','长治市'] },
    { province:'内蒙古自治区', cities:['呼和浩特市','包头市','鄂尔多斯市'] },
    { province:'辽宁省', cities:['沈阳市','大连市'] },
    { province:'上海市', cities:['上海市'] },
    { province:'江苏省', cities:['南京市','苏州市','无锡市'] },
    { province:'浙江省', cities:['杭州市','宁波市'] },
    { province:'广东省', cities:['广州市','深圳市','珠海市'] },
    { province:'陕西省', cities:['西安市'] },
    { province:'四川省', cities:['成都市'] }
  ];

  function campusLocationCascader(campus) {
    const active = campusLocationOptions.find(item => item.province === campus.province);
    const label = campus.province && campus.city ? `${campus.province} / ${campus.city}` : '请选择省份 / 城市';
    const provinceOptions = campusLocationOptions.map(item => `<button type="button" class="campus-location-option ${item.province === campus.province ? 'active' : ''}" data-action="select-campus-province" data-province="${item.province}"><span>${item.province}</span><i>›</i></button>`).join('');
    const cityOptions = (active?.cities || []).map(city => `<button type="button" class="campus-location-option city ${city === campus.city ? 'active' : ''}" data-action="select-campus-city" data-city="${city}"><span>${city}</span></button>`).join('');
    return `<div class="campus-location-cascader" data-location-cascader><input type="hidden" id="campus-province" value="${escapeHtml(campus.province || '')}"><input type="hidden" id="campus-city" value="${escapeHtml(campus.city || '')}"><button type="button" class="campus-location-trigger" data-action="toggle-campus-location" aria-expanded="false"><span data-location-label>${escapeHtml(label)}</span><i>⌄</i></button><div class="campus-location-panel" data-location-panel hidden><div class="campus-location-list" data-province-list>${provinceOptions}</div><div class="campus-location-list cities ${active ? '' : 'is-hidden'}" data-city-list>${cityOptions}</div></div></div>`;
  }

  function floorMultiSelect(floors, index) {
    const selected = floors || [];
    return `<details class="floor-multiselect"><summary>${selected.length ? `已选择${selected.length}个楼层：${selected.join('、')}` : '请选择启用楼层'}</summary><div class="floor-options">${allFloorOptions.map(floor => `<label><input type="checkbox" data-building-floor="${index}" value="${floor}" ${selected.includes(floor) ? 'checked' : ''}>${floor}</label>`).join('')}</div></details>`;
  }

  function inlineBuildingForm(building, index) {
    return `<section class="inline-building" data-building-index="${index}" data-existing-id="${building?.id || ''}">
      <div class="inline-building-head"><b>楼栋${buildingOrderNames[index] || index + 1}</b>${index > 0 ? `<button class="link-btn danger-link" data-action="remove-inline-building">删除</button>` : ''}</div>
      <div class="inline-building-grid">
        <div class="modal-field"><label><span class="required">*</span> 楼栋编号</label><input class="text-input inline-building-id ${building ? 'readonly-input' : ''}" inputmode="numeric" pattern="[0-9]*" maxlength="20" value="${escapeHtml(building?.id || '')}" ${building ? 'readonly' : ''} placeholder="请输入纯数字编号"></div>
        <div class="modal-field"><label><span class="required">*</span> 楼栋名称</label><input class="text-input inline-building-name" maxlength="30" value="${escapeHtml(building?.name || '')}" placeholder="请输入楼栋名称"></div>
        <div class="modal-field"><label><span class="required">*</span> 启用楼层</label>${floorMultiSelect(building?.floors || [],index)}</div>
        <div class="modal-field"><label><span class="required">*</span> 状态</label><select class="select-input inline-building-status">${optionList(['启用','停用'],building?.status || '启用')}</select></div>
        <div class="modal-field full"><label>地址</label><input class="text-input inline-building-address" maxlength="100" value="${escapeHtml(building?.address || '')}" placeholder="请输入该楼栋的详细地址（选填）"></div>
        <div class="modal-field full"><label>乘车路线</label><textarea class="textarea inline-building-route" maxlength="300" placeholder="请输入到达该楼栋的乘车路线（选填）">${escapeHtml(building?.route || '')}</textarea></div>
      </div>
    </section>`;
  }

  function renumberInlineBuildings() {
    [...document.querySelectorAll('.inline-building')].forEach((form,index) => {
      form.dataset.buildingIndex = index;
      form.querySelector('.inline-building-head b').textContent = `楼栋${buildingOrderNames[index] || index + 1}`;
      const remove = form.querySelector('[data-action="remove-inline-building"]');
      if (index === 0 && remove) remove.remove();
      if (index > 0 && !remove) form.querySelector('.inline-building-head').insertAdjacentHTML('beforeend','<button class="link-btn danger-link" data-action="remove-inline-building">删除</button>');
      form.querySelectorAll('[data-building-floor]').forEach(input => input.dataset.buildingFloor = index);
    });
  }

  function openCampusEditor(code) {
    const existing = state.campuses.find(item => item.code === code);
    const campus = existing || { code:'', name:'', owner:'', shortName:'', school:'唯寻上海', status:'有效', province:'', city:'', phone:'', fax:'', postcode:'' };
    const campusForm = `<div class="combined-section-title"><b>校区信息</b></div><div class="campus-edit-form">
      <div class="modal-field"><label><span class="required">*</span> 校区编号</label><input class="text-input ${existing ? 'readonly-input' : ''}" id="campus-code" maxlength="20" value="${escapeHtml(campus.code)}" ${existing ? 'readonly' : ''} placeholder="请输入校区编号"></div>
      <div class="modal-field"><label><span class="required">*</span> 校区名称</label><input class="text-input" id="campus-name" maxlength="30" value="${escapeHtml(campus.name)}" placeholder="请输入校区名称"></div>
      <div class="modal-field"><label>负责人</label><input class="text-input" id="campus-owner" maxlength="20" value="${escapeHtml(campus.owner)}" placeholder="请输入负责人"></div>
      <div class="modal-field"><label>简称</label><input class="text-input" id="campus-short-name" maxlength="20" value="${escapeHtml(campus.shortName)}" placeholder="请输入简称"></div>
      <div class="modal-field"><label><span class="required">*</span> 所属学校</label><select class="select-input" id="campus-school">${optionList(['唯寻上海','唯寻深圳','唯寻北京','唯寻西安'],campus.school)}</select></div>
      <div class="modal-field"><label><span class="required">*</span> 状态</label><select class="select-input" id="campus-status">${optionList(['有效','无效'],campus.status || '有效')}</select></div>
      <div class="modal-field"><label>省份 / 城市</label>${campusLocationCascader(campus)}</div>
      <div class="modal-field"><label>电话</label><input class="text-input" id="campus-phone" maxlength="20" value="${escapeHtml(campus.phone)}" placeholder="请输入电话"></div>
      <div class="modal-field"><label>传真</label><input class="text-input" id="campus-fax" maxlength="20" value="${escapeHtml(campus.fax)}" placeholder="请输入传真"></div>
      <div class="modal-field"><label>邮编</label><input class="text-input" id="campus-postcode" maxlength="20" value="${escapeHtml(campus.postcode)}" placeholder="请输入邮编"></div>
    </div>`;
    openModal({ title: existing ? `修改校区 · ${campus.name}` : '新增校区', body:`<div class="combined-campus-editor">${campusForm}</div>`, wide:true, confirm:'保存', confirmAction:'save-campus-entity', cancel:'取消' });
    modalRoot.querySelector('[data-action="save-campus-entity"]').dataset.originalCode = existing?.code || '';
  }

  function saveCampusEntity(originalCode) {
    const campusCode = document.getElementById('campus-code').value.trim();
    if (!campusCode) return toast('请输入校区编号','error');
    if (!originalCode && state.campuses.some(item => item.code === campusCode)) return toast('校区编号已存在','error');
    const name = document.getElementById('campus-name').value.trim();
    if (!name) return toast('请输入校区名称','error');
    const currentCampus = state.campuses.find(item => item.code === originalCode);
    const oldCampusName = currentCampus?.name || name;
    const values = { code:campusCode, name, owner:document.getElementById('campus-owner').value.trim(), shortName:document.getElementById('campus-short-name').value.trim(), school:document.getElementById('campus-school').value, status:document.getElementById('campus-status').value, province:document.getElementById('campus-province').value, city:document.getElementById('campus-city').value, phone:document.getElementById('campus-phone').value.trim(), fax:document.getElementById('campus-fax').value.trim(), postcode:document.getElementById('campus-postcode').value.trim() };
    const index = state.campuses.findIndex(item => item.code === originalCode);
    if (index >= 0) state.campuses[index] = values; else state.campuses.push(values);
    if (index >= 0 && oldCampusName !== name) state.buildings.forEach(building => { if (building.campus === oldCampusName) building.campus = name; });
    closeModal(); render(); toast(index >= 0 ? '校区信息已更新' : '校区已新增，请通过“修改楼栋”维护楼栋信息');
  }

  function openCampusBuildingEditor(code) {
    const campus = state.campuses.find(item => item.code === code);
    if (!campus) return;
    const buildings = campusBuildings(campus.name);
    const editorBuildings = buildings.length ? buildings : [null];
    const body = `<div class="campus-building-overview"><span>所属校区</span><b>${escapeHtml(campus.name)}</b><em>${escapeHtml(campus.code)}</em></div>
      <div class="combined-section-title building-title"><b>楼栋信息</b><button class="btn primary create" data-action="add-inline-building">添加楼栋</button></div>
      <div class="inline-buildings" id="inline-buildings">${editorBuildings.map((building,index)=>inlineBuildingForm(building,index)).join('')}</div>`;
    openModal({ title:`修改楼栋 · ${campus.name}`, body, wide:true, confirm:'保存', confirmAction:'save-campus-buildings', cancel:'取消' });
    modalRoot.querySelector('[data-action="save-campus-buildings"]').dataset.code = campus.code;
  }

  function saveCampusBuildings(code) {
    const campus = state.campuses.find(item => item.code === code);
    if (!campus) return;
    const buildingForms = [...modalRoot.querySelectorAll('.inline-building')];
    if (!buildingForms.length) return toast('请至少配置一栋楼','error');
    const buildings = [];
    for (let index = 0; index < buildingForms.length; index += 1) {
      const form = buildingForms[index];
      const buildingId = form.querySelector('.inline-building-id').value.trim();
      const buildingName = form.querySelector('.inline-building-name').value.trim();
      const address = form.querySelector('.inline-building-address').value.trim();
      const route = form.querySelector('.inline-building-route').value.trim();
      const floors = [...form.querySelectorAll('[data-building-floor]:checked')].map(input => input.value);
      const label = `楼栋${buildingOrderNames[index] || index + 1}`;
      if (!buildingId) return toast(`请输入${label}编号`,'error');
      if (!/^\d+$/.test(buildingId)) return toast(`${label}编号仅支持纯数字`,'error');
      if (buildings.some(item => item.id === buildingId) || state.buildings.some(item => item.id === buildingId && item.campus !== campus.name)) return toast(`${label}编号已存在`,'error');
      if (!buildingName) return toast(`请输入${label}名称`,'error');
      if (!floors.length) return toast(`请选择${label}的启用楼层`,'error');
      buildings.push({ id:buildingId, campus:campus.name, name:buildingName, status:form.querySelector('.inline-building-status').value, order:index + 1, floors, address, route });
    }
    state.buildings = state.buildings.filter(item => item.campus !== campus.name);
    state.buildings.push(...buildings);
    closeModal(); render(); toast(`${campus.name}楼栋信息已更新`);
  }

  function campusBuildings(campusName) {
    return state.buildings.filter(building => building.campus === campusName).sort((a,b) => a.order - b.order);
  }

  function formatCampusLocation(campus) {
    const province = campus.province || '--';
    const city = campus.city || '--';
    return `${province} / ${city}`;
  }

  function openCampusViewer(code) {
    const campus = state.campuses.find(item => item.code === code);
    if (!campus) return;
    const buildings = campusBuildings(campus.name);
    const campusFields = [
      ['校区编号',campus.code],['校区名称',campus.name],['负责人',campus.owner || '--'],['简称',campus.shortName || '--'],
      ['所属学校',campus.school],['状态',campus.status || '有效'],['省份 / 城市',formatCampusLocation(campus)],['电话',campus.phone || '--'],
      ['传真',campus.fax || '--'],['邮编',campus.postcode || '--']
    ];
    const buildingRows = buildings.map(building => `<tr><td>${escapeHtml(building.name)}</td><td>${escapeHtml(building.id)}</td><td>${escapeHtml(building.floors.join('、'))}</td><td>${escapeHtml(building.address || '--')}</td><td>${escapeHtml(building.route || '--')}</td><td>${escapeHtml(building.status)}</td></tr>`).join('');
    const body = `<div class="combined-section-title"><b>校区信息</b></div><div class="campus-view-grid">${campusFields.map(([label,value]) => `<div><span>${label}</span><b>${escapeHtml(value)}</b></div>`).join('')}</div><div class="combined-section-title building-title"><b>楼栋信息</b><span>共${buildings.length}栋</span></div><div class="modal-table campus-view-buildings"><table><thead><tr><th>楼栋名称</th><th>楼栋编号</th><th>启用楼层</th><th>地址</th><th>乘车路线</th><th>状态</th></tr></thead><tbody>${buildingRows || '<tr><td colspan="6">暂无楼栋信息</td></tr>'}</tbody></table></div>`;
    openModal({ title:`查看校区 · ${campus.name}`, body, wide:true, confirmAction:'', cancel:'关闭' });
  }

  function renderCampusManagement() {
    const rows = state.campuses.map(campus => `<tr><td><span class="classroom-code">${campus.code}</span></td><td>${escapeHtml(campus.name)}</td><td>${escapeHtml(campus.owner || '--')}</td><td>${escapeHtml(campus.shortName || '--')}</td><td>${escapeHtml(campus.school)}</td><td><span class="status-dot ${campus.status === '有效' ? '' : 'off'}">${escapeHtml(campus.status || '有效')}</span></td><td>${escapeHtml(formatCampusLocation(campus))}</td><td>${escapeHtml(campus.phone || '--')}</td><td>${escapeHtml(campus.fax || '--')}</td><td>${escapeHtml(campus.postcode || '--')}</td><td><div class="campus-row-actions"><span class="action-link" data-action="view-campus-entity" data-code="${campus.code}">查看</span><span class="action-link" data-action="edit-campus-entity" data-code="${campus.code}">修改校区</span><span class="action-link" data-action="edit-campus-buildings" data-code="${campus.code}">修改楼栋</span></div></td></tr>`).join('');
    return `<div class="page-head campus-management-head"><h1>校区管理</h1><div class="head-actions"><button class="btn primary create" data-action="add-campus-entity">新增校区</button></div></div>
      <div class="data-table campus-management-table simple-campus-table"><table><thead><tr><th style="width:80px">校区编号</th><th style="width:110px">校区名称</th><th style="width:90px">负责人</th><th style="width:75px">简称</th><th style="width:105px">所属学校</th><th style="width:75px">状态</th><th style="width:120px">省份 / 城市</th><th style="width:130px">电话</th><th style="width:130px">传真</th><th style="width:90px">邮编</th><th style="width:190px">操作</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function pageHead() {
    return '<div class="page-head"><h1>教室匹配管理</h1></div>';
  }

  function tabBar() {
    return `<div class="tabs matching-main-tabs">${tabs.map(([id,label]) => `<button class="tab ${state.activeTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`).join('')}</div>`;
  }

  function notice(text) {
    return `<div class="notice"><span class="info">i</span><span>${text}</span></div>`;
  }

  function renderScheduleOrderDetail() {
    const selectionState = String(state.scheduleSelectAll);
    const mediaState = String(state.scheduleMediaPreferred);
    const teacherCollapsed = state.scheduleTeacherCollapsed;
    const calendarCollapsed = state.scheduleCalendarCollapsed;
    return `<div class="schedule-order-page">
      <div class="order-detail-toolbar"><span class="order-back">‹ 返回</span><span class="order-crumb">排课单</span><button class="btn order-refresh">↻&nbsp; 更新排课数据</button><div class="order-toolbar-actions"><button class="btn">预览学生课表</button><button class="btn primary">结束排课单</button></div></div>
      <section class="order-summary-panel"><div class="order-title"><span>授课反馈产品验收-英联邦学科-ALEVEL-物理-1v1试听</span><button class="order-selection-btn media-preference" data-action="toggle-schedule-media-preference" aria-pressed="${mediaState}"><i></i>优先多媒体</button></div><div class="order-meta"><span>学生姓名： <b><i class="order-member">黑金</i>&nbsp; 授课反馈产品验收</b></span><span>班级课时： <b>0.25</b></span><span>未排课时： <b>-1.75</b></span><span>排课课程： <b class="order-course-tag"><i>★ 金牌</i>ALEVEL-物理-AQA-AS 【0.25/2】</b></span></div></section>
      <section class="order-section ${teacherCollapsed ? 'is-collapsed' : ''}"><div class="order-section-head">教师排课 <span>▦</span><button data-action="toggle-order-section" data-section="teacher" aria-label="${teacherCollapsed ? '展开' : '收起'}教师排课">${teacherCollapsed ? '›' : '⌄'}</button></div><div class="order-section-body">
        <div class="order-teacher-row"><span>已关联教师：</span><span class="order-teacher-chip">李春玲(VA000261)<i>×</i></span><div class="order-status-legend"><span><i class="published"></i>已发布</span><span><i class="pending"></i>待发布</span><span><i class="change"></i>待变更</span><span><i class="conflict"></i>冲突</span></div></div>
        <div class="order-tool-row"><button class="btn">添加课程时间</button><button class="btn">冲突检测</button><button class="btn">冲突详情</button><button class="btn">查看排课要求</button><button class="btn">查找可用课次</button><button class="btn">清除空白课次</button><button class="btn">回写班级</button><button class="btn">回写班级课表</button><button class="btn">查看回写记录</button><button class="btn">排课日志</button></div>
        <div class="order-tool-row"><button class="order-selection-btn close-batch"><span></span>关闭批量操作</button><button class="order-selection-btn" data-action="toggle-order-selection" aria-pressed="${selectionState}"><span></span>全选</button><button class="btn" disabled>时间调整</button><button class="btn" disabled>关联课程</button><button class="btn" disabled>关联教师</button><button class="btn" disabled>关联教室</button><button class="btn" disabled>取消教室</button><button class="btn" disabled>删除节课</button><button class="btn" disabled>添加备注</button><button class="btn" disabled>回写选中课次</button><button class="btn" disabled>修改授课模式</button><button class="btn" disabled>添加课导</button></div>
        <div class="order-schedule-board"><div class="order-schedule-grid"><div class="order-corner-cell"><b>日期</b><b>时间</b></div><div class="order-date-cell">2026-04-09<br>星期四</div><div class="order-time-cell">10:30 ~ 12:30</div><div class="order-lesson-cell"><div>ALEVEL-物理-AQA-线下</div><div>李春玲(VA000261)</div><div>--</div><div>备注：--</div><span>线下舜元</span></div></div></div>
      </div><div class="order-splitter"><span>↕</span></div></section>
      <section class="order-section ${calendarCollapsed ? 'is-collapsed' : ''}"><div class="order-section-head">教师日程 <span>▦</span><button data-action="toggle-order-section" data-section="calendar" aria-label="${calendarCollapsed ? '展开' : '收起'}教师日程">${calendarCollapsed ? '›' : '⌄'}</button></div><div class="order-section-body"><div class="order-schedule-tabs"><button class="active">日程总览</button><button>日程详情</button></div><div class="order-filter-bar"><label>日期<input value="▦  2026-04-09  至  2026-04-09"></label><label>时段<input class="time-range" value="08:20-10:20;10:30-12:30;13:30-15:30;16:00-18:00;18:30-20:30"></label><label>星期<select><option>请选择</option></select></label><div><button class="btn">重置</button><button class="btn primary">查询</button></div></div>
        <div class="order-calendar-legend"><b>图例：</b><span><i class="teacher-class"></i>老师有课</span><span><i class="teacher-leave"></i>老师休假</span><span><i class="available"></i>可排</span><span><i class="unavailable"></i>不可排（未到排课时间）</span><span><i class="student-class"></i>学生有课</span><span><i class="both-class"></i>老师&学生都有课</span><span><i class="selected-slot"></i>已选择</span><span><i class="new-slot"></i>新排</span></div>
        <table class="order-teacher-schedule-table"><thead><tr><th>科目</th><th>教师姓名</th><th>上课时段</th><th>2026-04-09<br>（周四）</th><th>操作</th></tr></thead><tbody><tr><td rowspan="3">ALEVEL-物理-AQA-线下-AS</td><td rowspan="3">★ 李春玲(VA000261)</td><td>08:20-10:20</td><td class="pink-slot">0min/续上</td><td rowspan="3"><span class="order-back">删除</span></td></tr><tr><td>10:30-12:30</td><td class="green-slot">ALEVEL-物理-AQA-线下-AS</td></tr><tr><td>13:30-15:30</td><td></td></tr></tbody></table>
      </div></section><div class="order-page-foot"><button class="btn">取消</button><button class="btn primary">提交</button></div>
    </div>`;
  }

  function render() {
    shellNavs.forEach(nav => nav.classList.toggle('active', nav.dataset.navPage === state.shellPage));
    const isMissingHome = state.shellPage === 'missing-lessons';
    workspace.classList.toggle('missing-v1-workspace',isMissingHome);
    workspace.closest('.content')?.classList.toggle('missing-v1-content',isMissingHome);
    if (state.shellPage === 'schedule-order') {
      breadcrumb.innerHTML = '<span class="root">我的排课单</span><span>/</span><span>排课单详情</span>';
      workspace.innerHTML = renderScheduleOrderDetail();
      return;
    }
    if (state.shellPage === 'classrooms') {
      breadcrumb.innerHTML = '<span class="root">教室资源</span><span>/</span><span>教室管理</span>';
      workspace.innerHTML = `<div class="prototype-page classroom-page">${renderClassroomManagement()}</div>`;
      return;
    }
    if (state.shellPage === 'missing-lessons') {
      breadcrumb.innerHTML = '<span class="root">教室资源</span><span>/</span><span>教室匹配</span>';
      workspace.innerHTML = `<div class="prototype-page missing-lessons-page">${renderMissingLessonsOverview()}</div>`;
      return;
    }
    if (state.shellPage === 'campuses') {
      breadcrumb.innerHTML = '<span class="root">校区管理</span>';
      workspace.innerHTML = `<div class="prototype-page campus-page">${renderCampusManagement()}</div>`;
      return;
    }
    breadcrumb.innerHTML = '<span class="root">教室资源</span><span>/</span><span>教室匹配</span><span>/</span><span>教室匹配管理</span>';
    const page = {
      common: renderGlobalV2,
      special: renderCampus,
      pool: renderPool,
    }[state.activeTab]();
    workspace.innerHTML = `<div class="prototype-page">${pageHead()}${tabBar()}${page}</div>`;
  }

  function buildingName(id) {
    const building = state.buildings.find(item => item.id === id);
    return building ? `${building.name}（${building.id}）` : '-';
  }

  function renderClassroomManagement() {
    const rows = state.classrooms.map((room, index) => `<tr>
      <td>${index + 1}</td><td><span class="classroom-code">${escapeHtml(room.id)}</span></td>
      <td>${escapeHtml(room.name)}</td><td>${room.seats}</td><td>${escapeHtml(room.type)}</td>
      <td>${escapeHtml(buildingName(room.building))}</td><td>${escapeHtml(room.floor)}</td>
      <td>${escapeHtml(room.lifecycle)}</td><td><span class="status-dot">${escapeHtml(room.status)}</span></td>
      <td>${escapeHtml(room.campus)}</td><td>${escapeHtml(room.school)}</td>
      <td><span class="action-link" data-action="edit-classroom" data-id="${room.id}">修改</span></td>
    </tr>`).join('');
    return `<div class="page-head classroom-head">
      <h1>教室管理</h1>
      <div class="head-actions"><button class="btn primary create" data-action="add-classroom">新增教室</button></div>
    </div>
    <div class="classroom-filter">
      <div class="classroom-filter-grid">
        <div class="filter-item"><label>教室编号</label><input class="text-input" placeholder="填写编号"></div>
        <div class="filter-item"><label>教室名称</label><input class="text-input" placeholder="填写名称"></div>
        <div class="filter-item"><label>所属校区</label>${select('选择校区',['南山校区','舜元校区','望京校区'])}</div>
        <div class="filter-item"><label>所属学校</label>${select('选择学校',['唯寻深圳','唯寻上海','唯寻北京'])}</div>
        <div class="filter-item"><label>状态</label>${select('有效',['无效'])}</div>
        <div class="filter-item"><label>教室类型</label>${select('选择教室类型',['多媒体教室','白板教室','实验室'])}</div>
        <div class="filter-actions"><button class="btn" data-action="reset-filter">重置</button><button class="btn primary" data-action="query">查询</button></div>
      </div>
    </div>
    <div class="data-table classroom-table"><table><thead><tr>
      <th style="width:45px">序号</th><th style="width:105px">编号</th><th style="width:110px">名称</th><th style="width:85px">正常座位数</th><th style="width:105px">教室类型</th><th style="width:145px">所属楼栋</th><th style="width:70px">所在楼层</th><th style="width:145px">生命周期</th><th style="width:70px">状态</th><th style="width:95px">所属校区</th><th style="width:95px">所属学校</th><th style="width:70px">操作</th>
    </tr></thead><tbody>${rows}</tbody></table></div>
    <div class="pagination"><button class="mini-btn" disabled>‹</button><button class="mini-btn blue">1</button><button class="mini-btn">2</button><button class="mini-btn">3</button><span>…</span><button class="mini-btn">67</button><button class="mini-btn">›</button><select class="select-input"><option>10条/页</option></select><span>共663条</span><span>前往</span><input class="number-input" value="1"><span>页</span></div>`;
  }

  function renderGlobalV2() {
    const rule = state.commonRule;
    const editing = state.commonEditing;
    const readClass = section => editing === section ? 'is-editing' : 'read-mode';
    const disabled = section => editing === section ? '' : 'disabled';
    return `<div class="global-config-grid common-card-grid">
      <section class="panel common-edit-card ${readClass('auto')}">
        ${commonSectionHead('匹配范围设置','auto',editing)}
        <div class="panel-body">
          ${formRow('预设班匹配范围',matchRangeControl('preset',rule.ranges.preset,disabled('auto')))}
          ${formRow('自组班匹配范围',matchRangeControl('custom',rule.ranges.custom,disabled('auto')))}
          ${formRow('1V1匹配范围',matchRangeControl('oneToOne',rule.ranges.oneToOne,disabled('auto')))}
        </div>
      </section>
      <section class="panel common-edit-card ${readClass('priority')}">
        ${commonSectionHead('教室匹配优先级设置','priority',editing)}
        <div class="panel-body">${roomPriorityFields('room',rule.roomPriorities,disabled('priority'))}</div>
      </section>
      <section class="panel common-edit-card ${readClass('capacity')}">
        ${commonSectionHead('需要的教室容量设置','capacity',editing)}
        <div class="panel-body">
          <div class="capacity-formula"><span>需要的教室容量=</span><b>当前进班人数+预留座位数</b></div>
          ${capacityRow('预设班','preset',rule.reserveSeats.preset,disabled('capacity'))}
          ${capacityRow('自组班','custom',rule.reserveSeats.custom,disabled('capacity'))}
          ${capacityRow('1V1','oneToOne',rule.reserveSeats.oneToOne,disabled('capacity'))}
          ${formRow('1V1教室座位数上限',`<input class="number-input" id="one-to-one-seat-limit" type="number" min="1" max="99" value="${rule.oneToOneSeatLimit}" ${disabled('capacity')}><span class="unit">座</span>`)}
        </div>
      </section>
    </div>`;
  }

  function matchRangeControl(key, setting, disabled = '') {
    const daysDisabled = disabled || setting.mode !== 'days' ? 'disabled' : '';
    return `<div class="range-control" data-range-control="${key}"><div class="range-checks"><label class="check"><input type="checkbox" data-range-choice="${key}" value="all" ${setting.mode === 'all' ? 'checked' : ''} ${disabled}>全部课节</label><label class="check"><input type="checkbox" data-range-choice="${key}" value="days" ${setting.mode === 'days' ? 'checked' : ''} ${disabled}>指定课节</label></div><span class="range-days ${setting.mode === 'days' ? '' : 'is-hidden'}"><span>未来</span><input class="number-input" id="range-${key}-days" type="number" min="1" max="365" value="${setting.days}" ${daysDisabled}><span class="unit">天</span></span><input type="hidden" id="range-${key}" value="${setting.mode}"></div>`;
  }

  function commonSectionHead(title,section,editing) {
    const controls = editing === section
      ? `<div class="panel-edit-actions"><button class="btn" data-action="cancel-common-section" data-section="${section}">取消</button><button class="btn primary" data-action="save-common-section" data-section="${section}">保存</button></div>`
      : `<button class="btn" data-action="edit-common-section" data-section="${section}">编辑</button>`;
    return `<div class="panel-head"><h3>${title}</h3>${controls}</div>`;
  }

  function roomPriorityFields(prefix,priorities,disabled = '') {
    const labels = { preset:'预设班', custom:'自组班', oneToOne:'1V1' };
    const options = ['多媒体教室','白板教室','教学点','外租教室'];
    return ['preset','custom','oneToOne'].map(key => `<div class="priority-lane"><div class="setting-subtitle">${labels[key]}</div><div class="priority-chain">${priorities[key].map((value,index) => `<div class="priority-node"><select class="select-input priority-select" id="${prefix}-${key}-priority-${index}" ${disabled}>${options.map(option => `<option ${option === value ? 'selected' : ''}>${option}</option>`).join('')}</select></div>`).join('')}</div></div>`).join('');
  }

  function capacityRow(label,key,value,disabled = '') {
    return formRow(`${label}预留座位数`,`<input class="number-input" id="reserve-${key}" type="number" min="0" max="99" value="${value}" ${disabled}><span class="unit">座</span>`);
  }

  function formRow(label, value) { return `<div class="form-row"><div class="form-label">${label}</div><div class="form-value">${value}</div></div>`; }
  function smallLabel(text) { return `<div style="color:#566174;font-size:12px;margin-bottom:8px">${text}</div>`; }
  function switchButton(on,name,disabled = '') { return `<button class="switch-control ${on ? 'on' : ''}" data-action="toggle-switch" data-name="${name}" ${disabled}></button>`; }
  function constraint(name, text) { return `<div class="constraint"><b>🔒 ${name}</b><span>${text}</span></div>`; }

  function stats(items) {
    return `<div class="stats">${items.map((x,i) => `<div class="stat-card"><div class="stat-icon">${x[0]}</div><div><div class="stat-number">${x[1]}</div><div class="stat-name">${x[2]}</div></div></div>`).join('')}</div>`;
  }

  function filterBox(fields, extraClass = '') {
    return `<div class="filter-box ${extraClass}"><div class="filter-grid">${fields.map(([label,control]) => `<div class="filter-item"><label>${label}</label>${control}</div>`).join('')}<div class="filter-actions"><button class="btn" data-action="reset-filter">重置</button><button class="btn primary" data-action="query">查询</button></div></div></div>`;
  }

  function renderCampus() {
    const rows = state.campusRules.map(r => `<tr>
      <td><span class="resource-entity-text ${r.campusStatus === '无效' ? 'is-invalid' : ''}">${escapeHtml(r.campusCode || '--')}</span></td>
      <td><span class="resource-entity-text resource-entity-name ${r.campusStatus === '无效' ? 'is-invalid' : ''}">${escapeHtml(r.campus)}</span></td>
      <td>${r.campusStatus === '无效' ? '<span class="tag gray">无效</span>' : '<span class="tag green">有效</span>'}</td>
      <td>${escapeHtml(r.school)}</td>
      <td>${campusClassCell(r.classConfigs.preset)}</td>
      <td>${campusClassCell(r.classConfigs.custom)}</td>
      <td>${campusClassCell(r.classConfigs.oneToOne)}</td>
      <td>${escapeHtml(r.updatedAt)}</td>
      <td>${escapeHtml(r.updatedBy || '--')}</td>
      <td><span class="action-link" data-action="view-campus-rule" data-id="${r.id}">查看</span></td>
    </tr>`).join('');
    return `<div class="data-table campus-rule-table"><table><colgroup><col style="width:7%"><col style="width:9%"><col style="width:7%"><col style="width:8%"><col style="width:15%"><col style="width:15%"><col style="width:15%"><col style="width:10%"><col style="width:8%"><col style="width:6%"></colgroup>
      <thead><tr><th>校区编号</th><th>校区名称</th><th>校区状态</th><th>归属学校</th><th>预设班特殊规则</th><th>自组班特殊规则</th><th>1V1特殊规则</th><th>更新时间</th><th>操作人</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function campusEffectText(config) {
    return config.effectType === 'date' ? `${String(config.effectStart).replace('T',' ')} 至 ${String(config.effectEnd).replace('T',' ')}` : '长期有效';
  }

  function campusClassCell(config) {
    if (!config.enabled) return '<span class="campus-class-status unconfigured">未配置</span>';
    const status = resolveCampusConfigStatus(config);
    if (status === 'waiting') return '<span class="campus-class-status waiting">待生效</span>';
    if (status === 'expired') return '<span class="campus-class-status expired">已失效</span>';
    return '<span class="campus-class-status active">生效中</span>';
  }

  function resolveCampusConfigStatus(config) {
    if (!config.enabled) return 'off';
    if (config.effectType !== 'date') return 'active';
    const now = Date.now();
    const startsAt = new Date(config.effectStart).getTime();
    const endsAt = new Date(config.effectEnd).getTime();
    if (Number.isFinite(startsAt) && now < startsAt) return 'waiting';
    if (Number.isFinite(endsAt) && now > endsAt) return 'expired';
    return 'active';
  }

  function renderPool() {
    const rows = state.rooms.map(r => {
      const hasBlockedPeriod = (r.blockedPeriods || []).length > 0 || (r.blockedTimes || []).length > 0;
      const editable = r.status !== '无效';
      const entityStateClass = editable ? '' : 'is-invalid';
      return `<tr>
      <td><input type="checkbox" data-room-check="${r.id}" ${state.selectedRooms.has(r.id) ? 'checked' : ''} ${editable ? '' : 'disabled'}></td>
      <td><span class="resource-entity-text ${entityStateClass}">${escapeHtml(r.id)}</span></td>
      <td><span class="resource-entity-text resource-entity-name ${entityStateClass}">${escapeHtml(r.name)}</span></td>
      <td>${editable ? '<span class="tag green">有效</span>' : '<span class="tag gray">无效</span>'}</td>
      <td>${escapeHtml(r.campus)}</td><td>${escapeHtml(r.school)}</td><td>${escapeHtml(r.building)}</td><td>${escapeHtml(r.floor)}</td><td>${r.seats}</td><td>${escapeHtml(r.type)}</td>
      <td>${r.inPool ? '<span class="tag green">开启</span>' : '<span class="tag gray">关闭</span>'}</td>
      <td><span class="blocked-period-status ${hasBlockedPeriod ? 'yes' : 'no'}">${hasBlockedPeriod ? '是' : '否'}</span></td>
      <td><span class="action-link" data-action="view-pool-rule" data-id="${r.id}">查看</span></td>
    </tr>`;
    }).join('');
    return `<div class="filter-box pool-filter-box"><div class="filter-grid"><div class="filter-item"><label>教室名称</label>${input('请输入教室名称或编号')}</div><div class="filter-item"><label>所属校区</label>${select('全部校区',['舜元校区','雅仕校区','鸿寿校区'])}</div><div class="filter-item"><label>归属学校</label>${select('全部学校',['唯寻上海','唯寻深圳','唯寻北京'])}</div><div class="filter-item seat-filter-item"><label>座位数范围</label>${seatRangeFilter()}</div><div class="filter-item"><label>教室类型</label>${select('全部类型',['多媒体教室','白板教室','教学点','外租教室'])}</div><div class="filter-item"><label>教室状态</label>${select('全部状态',['有效','无效'])}</div><div class="filter-item"><label>自动匹配状态</label>${select('全部状态',['开启','关闭'])}</div><div class="filter-item"><label>是否配置禁用时段</label>${select('全部',['是','否'])}</div><div class="filter-actions"><button class="btn" data-action="reset-filter">重置</button><button class="btn primary" data-action="query">查询</button></div></div></div>
          <div class="data-table"><div class="table-toolbar"><h3>教室资源池</h3><div class="right"><button class="mini-btn blue" data-action="batch-in" ${state.selectedRooms.size ? '' : 'disabled'}>批量开启</button><button class="mini-btn" data-action="batch-out" ${state.selectedRooms.size ? '' : 'disabled'}>批量关闭</button><button class="mini-btn" data-action="batch-pool-rule" ${state.selectedRooms.size ? '' : 'disabled'}>批量设置</button></div></div>
            <table><colgroup><col style="width:4%"><col style="width:9%"><col style="width:11%"><col style="width:7%"><col style="width:8%"><col style="width:8%"><col style="width:8%"><col style="width:5%"><col style="width:5%"><col style="width:8%"><col style="width:9%"><col style="width:9%"><col style="width:9%"></colgroup>
              <thead><tr><th><input type="checkbox" data-action="select-all-rooms"></th><th>教室编号</th><th>教室名称</th><th>教室状态</th><th>所属校区</th><th>归属学校</th><th>所属楼栋</th><th>楼层</th><th>座位数</th><th>教室类型</th><th>自动匹配状态</th><th>是否配置禁用时段</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table>${pagination(state.rooms.length)}</div>
          </div>`;
  }

  function seatRangeFilter() {
    const stepper = (id,placeholder) => `<div class="seat-stepper"><button type="button" data-action="adjust-pool-seat" data-target="${id}" data-step="-1">−</button><input id="${id}" type="number" min="0" value="0" placeholder="${placeholder}"><button type="button" data-action="adjust-pool-seat" data-target="${id}" data-step="1">+</button></div>`;
    return `<div class="seat-range-filter">${stepper('pool-seat-min','最小')}<span>至</span>${stepper('pool-seat-max','最大')}</div>`;
  }

  function renderManual() {
    const filtered = state.manualFilter === 'all' ? state.manualRows : state.manualRows.filter(r => r.type === state.manualFilter);
    const rows = filtered.map(r => `<tr>
      <td><span class="row-title">${escapeHtml(r.className)}</span><div class="muted">${r.id}</div></td><td>${r.classType}</td><td>${r.time}</td><td>${r.campus}</td><td>${r.teacher}</td>
      <td>${r.students}人 + 预留${r.reserve}座<br><span class="muted">所需${r.students + r.reserve}座</span></td><td>${r.current}</td><td>${planTag(r.plan)}</td><td>${r.status}</td>
      <td>${manualActions(r)}</td>
    </tr>`).join('');
    return `${notice('<b>人工调度边界：</b> 系统只计算候选方案，不自动更换已有教室。闭环方案可一键完成；非闭环转移会产生新的无教室课节，必须明确确认结果。')}
      <div class="manual-types">
        ${manualCard('all','▤','全部待处理',state.manualRows.length,'查看全部无教室、容量不符和资源可优化课节')}
        ${manualCard('capacity','△','容量不符',state.manualRows.filter(x=>x.type==='capacity').length,'当前教室无法满足进班人数与预留座位')}
        ${manualCard('optimize','◇','资源可优化',state.manualRows.filter(x=>x.type==='optimize').length,'小班占用较大教室，可作为人工换配候选')}
      </div>
      ${filterBox([['所属校区',select('全部校区',['舜元','成都','西安'])],['课程日期',input('2026-08-12 至 2026-08-31')],['班型',select('全部班型',['预设班','自组班','1V1'])],['课节状态',select('全部状态',['待人工换配','容量不符','资源可优化'])]])}
      <div class="data-table"><div class="table-toolbar"><h3>人工调度课节</h3><span class="count">共${filtered.length}条</span><div class="right"><button class="mini-btn">批量重新计算候选</button><button class="mini-btn">导出</button></div></div>
        <table><colgroup><col style="width:14%"><col style="width:7%"><col style="width:13%"><col style="width:7%"><col style="width:7%"><col style="width:11%"><col style="width:9%"><col style="width:10%"><col style="width:9%"><col style="width:13%"></colgroup>
          <thead><tr><th>课节 / 班级</th><th>班型</th><th>上课时间</th><th>校区</th><th>老师</th><th>人数与需要的教室容量</th><th>当前教室</th><th>推荐结果</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows || `<tr><td colspan="10"><div class="empty"><div class="empty-inner"><div class="empty-icon">□</div>暂无符合条件的课节</div></div></td></tr>`}</tbody></table>${pagination(filtered.length)}</div>`;
  }

  function manualCard(type,icon,title,n,desc) { return `<div class="manual-card ${state.manualFilter === type ? 'active' : ''}" data-action="manual-filter" data-type="${type}"><div class="top"><div class="manual-icon">${icon}</div><h3>${title}</h3><span class="n">${n}</span></div><p>${desc}</p></div>`; }
  function planTag(plan) {
    if (plan === 'closed') return '<span class="tag green">可闭环一键换配</span>';
    if (plan === 'open') return '<span class="tag red">仅可释放教室</span>';
    if (plan === 'direct') return '<span class="tag blue">有空闲大教室</span>';
    return '<span class="tag purple">可优化候选</span>';
  }
  function manualActions(r) {
    if (r.plan === 'closed') return `<button class="mini-btn blue" data-action="closed-plan" data-id="${r.id}">一键换配</button>`;
    if (r.plan === 'open') return `<button class="mini-btn danger" data-action="open-plan" data-id="${r.id}">转移教室</button>`;
    if (r.plan === 'direct') return `<button class="mini-btn blue" data-action="direct-plan" data-id="${r.id}">人工更换</button>`;
    return `<button class="mini-btn" data-action="view-candidates" data-id="${r.id}">查看候选</button>`;
  }

  function select(first, options) { return `<select class="select-input"><option>${first}</option>${options.map(x=>`<option>${x}</option>`).join('')}</select>`; }
  function input(placeholder) { return `<input class="text-input" placeholder="${placeholder}">`; }
  function statusText(status) {
    if (status === 'active') return '<span class="status-dot">生效中</span>';
    if (status === 'waiting') return '<span class="status-dot wait">待生效</span>';
    if (status === 'expired') return '<span class="status-dot expired">已失效</span>';
    return '<span class="status-dot off">已停用</span>';
  }
  function rowSwitch(on, type, id) { return `<button class="switch-control ${on ? 'on' : ''}" data-action="row-toggle" data-kind="${type}" data-id="${id}"></button>`; }
  function pagination(total) { return `<div class="pagination"><span>共${total}条</span><span class="page-btn">‹</span><span class="page-btn active">1</span><span class="page-btn">2</span><span class="page-btn">›</span></div>`; }

  function openModal({ title, body, wide = false, small = false, confirm = '确定', confirmAction = '', cancel = '取消' }) {
    modalRoot.innerHTML = `<div class="modal-mask"><div class="modal ${wide ? 'wide' : ''} ${small ? 'small' : ''}"><div class="modal-head"><h2>${title}</h2><button class="modal-close" data-action="close-modal">×</button></div><div class="modal-body">${body}</div><div class="modal-foot"><button class="btn" data-action="close-modal">${cancel}</button>${confirmAction ? `<button class="btn primary" data-action="${confirmAction}">${confirm}</button>` : ''}</div></div></div>`;
  }

  function closeModal() { modalRoot.innerHTML = ''; }

  function openCampusRuleEditor(id) {
    const rule = state.campusRules.find(item => String(item.id) === String(id));
    if (!rule) return;
    const toggles = [['preset','预设班'],['custom','自组班'],['oneToOne','1V1']].map(([key,label]) => `<label class="check"><input type="checkbox" data-campus-class-toggle value="${key}" ${rule.classConfigs[key].enabled ? 'checked' : ''}>${label}</label>`).join('');
    const body = `<div class="modal-form campus-rule-base"><div class="modal-field full"><label>校区名称</label><input class="text-input readonly-input" id="rule-campus" value="${escapeHtml(rule.campus)}" readonly></div><div class="modal-field full"><label>配置班型</label><div class="check-group">${toggles}</div></div></div>
      <div class="campus-class-editor-grid">${['preset','custom','oneToOne'].map(key => campusClassEditorCard(key,rule.classConfigs[key])).join('')}</div>`;
    openModal({ title:'编辑校区特殊规则', body, wide:true, confirm:'保存并发布', confirmAction:'save-campus-rule' });
    modalRoot.querySelector('[data-action="save-campus-rule"]').dataset.id = rule.id;
  }

  function campusClassEditorCard(key,config) {
    const labels = { preset:'预设班特殊规则', custom:'自组班特殊规则', oneToOne:'1V1特殊规则' };
    const options = ['多媒体教室','白板教室','教学点','外租教室'];
    const priorities = config.priorities || state.commonRule.roomPriorities[key];
    const priorityControls = priorities.map((value,index) => `<select class="select-input priority-select" id="special-room-${key}-priority-${index}">${options.map(option => `<option ${option === value ? 'selected' : ''}>${option}</option>`).join('')}</select>`).join('');
    const dateMode = config.effectType === 'date';
    const seatLimitField = key === 'oneToOne' ? `<div class="modal-field"><label>教室座位数上限</label><div class="inline-number"><input class="number-input" id="special-seat-limit-${key}" type="number" min="1" max="99" value="${config.seatLimit || state.commonRule.oneToOneSeatLimit}"><span>座</span></div></div>` : '';
    return `<section class="campus-class-card editor ${config.enabled ? '' : 'is-hidden'}" data-campus-class-card="${key}"><div class="campus-class-card-head"><h3>${labels[key]}</h3></div>
      <div class="campus-class-fields">
        <div class="modal-field full"><label>适用课程项</label><div class="radio-group"><label class="radio"><input type="radio" name="special-course-mode-${key}" value="all" ${config.courseMode === 'all' ? 'checked' : ''}>全部课程项</label><label class="radio"><input type="radio" name="special-course-mode-${key}" value="specified" ${config.courseMode === 'specified' ? 'checked' : ''}>指定课程项</label></div>${courseCascadePicker(`special-courses-${key}`,config.courseMode === 'specified' ? config.courses : '',config.courseMode === 'specified','course-entry')}</div>
        <div class="modal-field"><label>预留座位数</label><div class="inline-number"><input class="number-input" id="special-reserve-${key}" type="number" min="0" max="99" value="${config.reserveSeats}"><span>座</span></div></div>
        ${seatLimitField}
        <div class="modal-field full"><label>教室优先级</label><div class="priority-chain compact">${priorityControls}</div></div>
        <div class="modal-field full"><label>生效方式</label><div class="radio-group"><label class="radio"><input type="radio" name="special-effect-${key}" value="long" ${dateMode ? '' : 'checked'}>长期有效</label><label class="radio"><input type="radio" name="special-effect-${key}" value="date" ${dateMode ? 'checked' : ''}>指定日期</label></div><div class="date-range special-effect-date ${dateMode ? '' : 'is-hidden'}" data-special-effect-date="${key}"><input class="datetime-input" type="datetime-local" step="1" id="special-effect-start-${key}" value="${config.effectStart || '2026-09-01T00:00:00'}" ${dateMode ? '' : 'disabled'}><span>至</span><input class="datetime-input" type="datetime-local" step="1" id="special-effect-end-${key}" value="${config.effectEnd || '2026-12-31T23:59:59'}" ${dateMode ? '' : 'disabled'}></div></div>
      </div>
    </section>`;
  }

  function saveCampusRule(id) {
    const rule = state.campusRules.find(item => String(item.id) === String(id));
    if (!rule) return;
    for (const key of ['preset','custom','oneToOne']) {
      const enabled = Boolean(modalRoot.querySelector(`[data-campus-class-toggle][value="${key}"]`)?.checked);
      if (!enabled) {
        rule.classConfigs[key].enabled = false;
        rule.classConfigs[key].status = 'off';
        continue;
      }
      const courseMode = modalRoot.querySelector(`input[name="special-course-mode-${key}"]:checked`)?.value || 'all';
      const courses = document.getElementById(`special-courses-${key}`).value.trim();
      if (courseMode === 'specified' && !courses) return toast('请输入指定课程项','error');
      const reserveSeats = Number(document.getElementById(`special-reserve-${key}`).value);
      if (!Number.isInteger(reserveSeats) || reserveSeats < 0 || reserveSeats > 99) return toast('预留座位数请输入0-99的整数','error');
      const seatLimit = key === 'oneToOne' ? Number(document.getElementById(`special-seat-limit-${key}`).value) : undefined;
      if (key === 'oneToOne' && (!Number.isInteger(seatLimit) || seatLimit < 1 || seatLimit > 99)) return toast('1V1教室座位数上限请输入1-99的整数','error');
      const priorities = [0,1,2,3].map(index => document.getElementById(`special-room-${key}-priority-${index}`).value);
      if (new Set(priorities).size !== priorities.length) return toast('同一班型的教室优先级不能重复','error');
      const effectType = modalRoot.querySelector(`input[name="special-effect-${key}"]:checked`)?.value || 'long';
      const effectStart = document.getElementById(`special-effect-start-${key}`).value;
      const effectEnd = document.getElementById(`special-effect-end-${key}`).value;
      if (effectType === 'date' && (!effectStart || !effectEnd || effectStart > effectEnd)) return toast('请选择正确的生效日期范围','error');
      const nextConfig = { enabled:true, courseMode, courses:courseMode === 'all' ? '全部课程项' : courses, reserveSeats, ...(key === 'oneToOne' ? { seatLimit } : {}), priorities, effectType, effectStart:effectType === 'date' ? effectStart : '', effectEnd:effectType === 'date' ? effectEnd : '', status:'active' };
      nextConfig.status = resolveCampusConfigStatus(nextConfig);
      rule.classConfigs[key] = nextConfig;
    }
    rule.updatedAt = new Date().toLocaleString('zh-CN',{ hour12:false }).replaceAll('/','-');
    rule.updatedBy = '李春玲（VA000261）';
    closeModal(); render(); toast(`${rule.campus}特殊规则已保存`);
  }

  function openRuleEditor(kind, id) {
    if (kind === 'campus') return openCampusRuleEditor(id);
    const data = kind === 'campus' ? state.campusRules : state.roomRules;
    const record = data.find(x => String(x.id) === String(id));
    const isRoom = kind === 'room';
    const isDateRange = !isRoom && record?.effectType === 'date';
    const effectStart = record?.effectStart || '2026-08-12';
    const effectEnd = record?.effectEnd || '2026-12-31';
    const title = record ? `编辑${isRoom ? '教室使用限制' : '校区匹配策略'}` : `新增${isRoom ? '教室使用限制' : '校区匹配策略'}`;
    const body = `<div class="modal-form">
      <div class="modal-field"><label><span style="color:#e55b61">*</span> 规则名称</label><input class="text-input" id="rule-name" value="${record ? escapeHtml(record.name) : ''}" placeholder="请输入便于识别的规则名称"></div>
      <div class="modal-field"><label><span style="color:#e55b61">*</span> 适用校区</label>${select(record ? (record.campuses || record.scope.split(' / ')[0]) : '请选择校区',['舜元','成都','西安','深圳南山','鸿寿'])}</div>
      ${isRoom ? `<div class="modal-field"><label>适用楼栋</label>${select('全部楼栋',['舜元A栋（201）','舜元B栋（202）','舜元C栋（203）'])}</div><div class="modal-field"><label>楼层 / 教室</label><input class="text-input" placeholder="全部楼层或指定教室"></div>` : `<div class="modal-field"><label>适用班型</label><div class="check-group"><label class="check"><input type="checkbox" checked>预设班</label><label class="check"><input type="checkbox">自组班</label><label class="check"><input type="checkbox">1V1</label></div></div><div class="modal-field"><label>课程项</label><input class="text-input" value="${record ? escapeHtml(record.courses) : ''}" placeholder="全部课程项或指定课程项"></div>`}
      <div class="modal-field"><label>生效方式</label><div class="radio-group"><label class="radio"><input type="radio" name="effect" value="long" ${isDateRange ? '' : 'checked'}>长期有效</label><label class="radio"><input type="radio" name="effect" value="date" ${isDateRange ? 'checked' : ''}>指定日期</label></div></div>
      ${isRoom ? '' : `<div class="modal-field full effect-date-field ${isDateRange ? '' : 'is-hidden'}" id="effect-date-field"><label><span style="color:#e55b61">*</span> 生效日期</label><div class="date-range"><input class="date-input" type="date" id="effect-start" value="${effectStart}" ${isDateRange ? '' : 'disabled'}><span>至</span><input class="date-input" type="date" id="effect-end" value="${effectEnd}" ${isDateRange ? '' : 'disabled'}></div></div>`}
    </div>
    ${isRoom ? `<div class="modal-section"><h3>教室使用限制</h3><div class="modal-form"><div class="modal-field"><label>允许课程项</label><input class="text-input" placeholder="全部或指定课程项"></div><div class="modal-field"><label>允许班型</label>${select('全部班型',['预设班','自组班','1V1'])}</div><div class="modal-field"><label>自动匹配</label>${select('参与自动匹配',['不参与自动匹配'])}</div><div class="modal-field"><label>人工关联权限</label><div class="check-group"><label class="check"><input type="checkbox" checked>教务</label><label class="check"><input type="checkbox">学管</label><label class="check"><input type="checkbox">行政</label></div></div></div></div>` : specialRuleSettings(record,false,'special')}`;
    openModal({ title, body, wide: true, confirm: '保存并发布', confirmAction: `save-${kind}-rule` });
    modalRoot.querySelector(`[data-action="save-${kind}-rule"]`).dataset.id = id || '';
  }

  function openPoolRule(id) {
    const room = state.rooms.find(x => x.id === id);
    if (!room) return;
    if (room.status === '无效') return toast('无效教室不支持编辑使用规则','error');
    const classOptions = poolClassTypes.map(item => item.label);
    const matchedClassTypes = room.restrictClass ? room.classTypes : classOptions;
    const specifiedCourse = Boolean(room.restrictCourse && room.courses && room.courses !== '全部课程项');
    const courseSetting = `<div class="pool-global-course-setting"><div class="radio-group"><label class="radio"><input type="radio" data-pool-course-mode name="pool-course-mode" value="all" ${specifiedCourse ? '' : 'checked'}>全部课程项</label><label class="radio"><input type="radio" data-pool-course-mode name="pool-course-mode" value="specified" ${specifiedCourse ? 'checked' : ''}>指定课程项</label></div>${courseCascadePicker('pool-courses',specifiedCourse ? room.courses : '',specifiedCourse,'pool-course-input')}</div>`;
    const periods = room.blockedPeriods?.length
      ? room.blockedPeriods.map(normalizeBlockedPeriod)
      : room.blockedTimes.length
        ? room.blockedTimes.map(time => normalizeBlockedPeriod({ time }))
        : [];
    const terminalBlacklist = normalizeTerminalBlacklist(room.terminalBlacklist);
    const body = `<div class="room-rule-overview"><div class="room-rule-heading"><b>${escapeHtml(room.name)}</b></div><span>${escapeHtml(room.id)} · ${escapeHtml(room.school)} · ${escapeHtml(room.campus)} · ${escapeHtml(room.building)} · ${escapeHtml(room.floor)} · ${escapeHtml(room.type)}</span></div>
      <div class="room-rule-form">
        <section class="room-rule-section full auto-match-settings"><h3>自动匹配设置</h3>
          <div class="auto-match-toggle-row"><span>自动匹配</span><div class="radio-group"><label class="radio"><input type="radio" name="pool-auto" value="on" ${room.inPool ? 'checked' : ''}>开启</label><label class="radio"><input type="radio" name="pool-auto" value="off" ${room.inPool ? '' : 'checked'}>关闭</label></div></div>
          <div data-auto-match-on class="auto-match-conditional ${room.inPool ? '' : 'is-hidden'}"><div class="section-title-row"><h4>自动匹配禁用时段设置</h4><button class="btn" data-action="add-blocked-period">添加时段</button></div><div class="blocked-periods" id="blocked-periods">${periods.length ? periods.map((period,index)=>blockedPeriodRow(period,index)).join('') : '<div class="empty-periods">暂未配置自动匹配禁用时段</div>'}</div></div>
        </section>
        <section class="room-rule-section full room-availability-settings"><h3>教室可用范围设置</h3>
          <div class="pool-setting-heading">教室禁用黑名单</div>
          ${terminalBlacklistSettingMarkup(terminalBlacklist,'data-room-terminal-blacklist')}
          <div class="pool-setting-heading divided">教室可用班型</div>
          <div class="conditional-config" id="pool-class-config">${classOptions.map(item => `<label class="check"><input type="checkbox" data-pool-class value="${item}" ${matchedClassTypes.includes(item) ? 'checked' : ''}>${item}</label>`).join('')}</div>
          <div data-pool-course-settings>
            <div class="pool-setting-heading divided">教室可用课程项</div>
            ${courseSetting}
          </div>
        </section>
      </div>`;
    openModal({ title: '配置教室使用规则', body, wide:true, confirm: '保存', confirmAction: 'save-pool-rule' });
    modalRoot.querySelector('[data-action="save-pool-rule"]').dataset.id = room.id;
    syncPoolClassCourseAvailability();
  }

  function openPoolRuleDetail(id) {
    const room = state.rooms.find(item => item.id === id);
    if (!room) return;
    const classTypes = room.restrictClass ? room.classTypes : poolClassTypes.map(item => item.label);
    const courses = room.restrictCourse && room.courses ? room.courses : '全部课程项';
    const periods = room.blockedPeriods?.length
      ? room.blockedPeriods.map(normalizeBlockedPeriod)
      : room.blockedTimes.length
        ? room.blockedTimes.map(time => normalizeBlockedPeriod({ time }))
        : [];
    const terminalBlacklist = normalizeTerminalBlacklist(room.terminalBlacklist);
    const periodMarkup = periods.length
      ? periods.map((period,index) => `<div class="pool-rule-view-period"><b>时段${index + 1}</b><span>${escapeHtml(`${period.startDate} 至 ${period.endDate} ${period.startTime}-${period.endTime}`)}</span></div>`).join('')
      : '<div class="pool-rule-view-empty">暂未配置自动匹配禁用时段</div>';
    const body = `<div class="room-rule-overview"><div class="room-rule-heading"><b>${escapeHtml(room.name)}</b><span class="pool-overview-status ${room.inPool ? 'on' : 'off'}">${room.inPool ? '开启自动匹配' : '关闭自动匹配'}</span></div><span>${escapeHtml(room.id)} · ${escapeHtml(room.school)} · ${escapeHtml(room.campus)} · ${escapeHtml(room.building)} · ${escapeHtml(room.floor)} · ${escapeHtml(room.type)}</span></div>
      <div class="room-rule-form pool-rule-view">
        <section class="room-rule-section full"><h3>自动匹配设置</h3>
          ${room.inPool ? `<div class="pool-rule-view-block"><h4>自动匹配禁用时段设置</h4><div class="pool-rule-view-periods">${periodMarkup}</div></div>` : '<div class="pool-rule-view-empty auto-off">自动匹配已关闭</div>'}
        </section>
        <section class="room-rule-section full"><h3>教室可用范围设置</h3><div class="pool-rule-view-grid pool-rule-range-view"><div><span>教室禁用黑名单</span><b>${escapeHtml(terminalBlacklist.length ? terminalBlacklist.join('、') : '无')}</b></div><div><span>教室可用班型</span><b>${escapeHtml(classTypes.join('、'))}</b></div><div><span>教室可用课程项</span><b>${escapeHtml(courses)}</b></div></div></section>
      </div>`;
    const editable = room.status !== '无效';
    openModal({ title:'查看教室使用规则', body, wide:true, confirm:'编辑', confirmAction:editable ? 'edit-pool-from-detail' : '', cancel:'关闭' });
    const editButton = modalRoot.querySelector('[data-action="edit-pool-from-detail"]');
    if (editButton) editButton.dataset.id = room.id;
  }

  function openBatchPoolRule() {
    const selected = state.rooms.filter(room => room.status !== '无效' && state.selectedRooms.has(room.id));
    if (!selected.length) return toast('请先选择教室','error');
    const classOptions = poolClassTypes.map(item => item.label);
    const courseSetting = `<div class="pool-global-course-setting"><div class="radio-group"><label class="radio"><input type="radio" data-pool-course-mode name="pool-course-mode" value="all" checked>全部课程项</label><label class="radio"><input type="radio" data-pool-course-mode name="pool-course-mode" value="specified">指定课程项</label></div>${courseCascadePicker('pool-courses','',false,'pool-course-input')}</div>`;
    const body = `<div class="room-rule-form">
        <section class="room-rule-section full auto-match-settings"><h3>自动匹配设置</h3>
          <div class="auto-match-toggle-row"><span>自动匹配</span><div class="radio-group"><label class="radio"><input type="radio" name="pool-auto" value="on" checked>开启</label><label class="radio"><input type="radio" name="pool-auto" value="off">关闭</label></div></div>
          <div data-auto-match-on class="auto-match-conditional"><div class="section-title-row"><h4>自动匹配禁用时段设置</h4><button class="btn" data-action="add-blocked-period">添加时段</button></div><div class="blocked-periods" id="blocked-periods"><div class="empty-periods">暂未配置自动匹配禁用时段</div></div></div>
        </section>
        <section class="room-rule-section full room-availability-settings"><h3>教室可用范围设置</h3>
          <div class="pool-setting-heading">教室禁用黑名单</div>
          ${terminalBlacklistSettingMarkup([],'data-room-terminal-blacklist')}
          <div class="pool-setting-heading divided">教室可用班型</div>
          <div class="conditional-config" id="pool-class-config">${classOptions.map(item => `<label class="check"><input type="checkbox" data-pool-class value="${item}" checked>${item}</label>`).join('')}</div>
          <div data-pool-course-settings>
            <div class="pool-setting-heading divided">教室可用课程项</div>
            ${courseSetting}
          </div>
        </section>
      </div>`;
    openModal({ title:'批量配置教室使用规则', body, wide:true, confirm:'保存', confirmAction:'save-batch-pool-rule' });
    syncPoolClassCourseAvailability();
  }

  function emptyBlockedPeriod() {
    return { startDate:'', endDate:'', startTime:'', endTime:'' };
  }

  function normalizeTerminalBlacklist(values) {
    if (!Array.isArray(values)) return [];
    return roomTerminalOptions.filter(item => values.includes(item));
  }

  function normalizeBlockedPeriod(period = {}) {
    if ('startDate' in period || 'endDate' in period || 'startTime' in period || 'endTime' in period) return { ...emptyBlockedPeriod(), ...period };
    const text = period.time || '';
    const dates = text.match(/(\d{4}-\d{2}-\d{2})\s*至\s*(\d{4}-\d{2}-\d{2})/);
    const times = text.match(/(\d{2}:\d{2})\s*[-至]\s*(\d{2}:\d{2})/);
    return {
      startDate:dates?.[1] || (text ? '2026-08-15' : ''),
      endDate:dates?.[2] || (text ? '2026-09-15' : ''),
      startTime:times?.[1] || (text ? '10:30' : ''),
      endTime:times?.[2] || (text ? '15:30' : '')
    };
  }

  function terminalBlacklistSettingMarkup(selectedTerminals = [],extraAttribute = '') {
    const selected = normalizeTerminalBlacklist(selectedTerminals);
    const options = roomTerminalOptions.map(item => `<label class="check"><input type="checkbox" data-terminal-blacklist-value value="${item}" ${selected.includes(item) ? 'checked' : ''}>${item}</label>`).join('');
    return `<div class="manual-permission-setting" ${extraAttribute}><div class="manual-permission-options">${options}</div></div>`;
  }

  function blockedPeriodRow(period,index) {
    const value = normalizeBlockedPeriod(typeof period === 'string' ? { time:period } : period);
    return `<div class="blocked-period-row"><div class="blocked-period-head"><b>时段${index + 1}</b><button class="link-btn danger-link" data-action="remove-blocked-period">删除</button></div><div class="blocked-period-config"><label>自动匹配禁用时段</label><div class="blocked-period-range"><input class="date-input" type="date" data-period-start-date value="${value.startDate}"><span>至</span><input class="date-input" type="date" data-period-end-date value="${value.endDate}"><input class="time-input" type="time" data-period-start-time value="${value.startTime}"><span>至</span><input class="time-input" type="time" data-period-end-time value="${value.endTime}"></div></div></div>`;
  }

  function readBlockedPeriods() {
    const blockedPeriods = [];
    for (const [index,row] of [...modalRoot.querySelectorAll('.blocked-period-row')].entries()) {
      const startDate = row.querySelector('[data-period-start-date]').value;
      const endDate = row.querySelector('[data-period-end-date]').value;
      const startTime = row.querySelector('[data-period-start-time]').value;
      const endTime = row.querySelector('[data-period-end-time]').value;
      if (!startDate || !endDate || !startTime || !endTime) { toast(`请完整填写时段${index + 1}的日期和时间`,'error'); return null; }
      if (startDate > endDate) { toast(`时段${index + 1}的结束日期不能早于开始日期`,'error'); return null; }
      if (startTime >= endTime) { toast(`时段${index + 1}的结束时间必须晚于开始时间`,'error'); return null; }
      blockedPeriods.push({ startDate,endDate,startTime,endTime });
    }
    return blockedPeriods;
  }

  function readTerminalBlacklist(target) {
    const container = typeof target === 'string' ? modalRoot.querySelector(target) : target;
    if (!container) return [];
    return roomTerminalOptions.filter(name => [...container.querySelectorAll('[data-terminal-blacklist-value]:checked')].some(input => input.value === name));
  }

  function savePoolRule(id) {
    const room = state.rooms.find(item => item.id === id);
    const autoEnabled = modalRoot.querySelector('input[name="pool-auto"]:checked')?.value === 'on';
    const classTypes = [...modalRoot.querySelectorAll('[data-pool-class]:checked')].map(input => input.value);
    if (!classTypes.length) return toast('请至少选择一个教室可用班型','error');
    const enabledClassTypes = classTypes;
    const courseMode = modalRoot.querySelector('input[name="pool-course-mode"]:checked')?.value || 'all';
    const courses = courseMode === 'specified' ? document.getElementById('pool-courses').value.trim() : '';
    if (courseMode === 'specified' && !courses) return toast('请选择教室可用课程项','error');
    const blockedPeriods = autoEnabled ? readBlockedPeriods() : [];
    if (!blockedPeriods) return;
    const terminalBlacklist = readTerminalBlacklist('[data-room-terminal-blacklist]');
    room.inPool = autoEnabled;
    room.restrictClass = enabledClassTypes.length < poolClassTypes.length;
    room.classTypes = enabledClassTypes;
    room.restrictCourse = courseMode === 'specified';
    room.courses = courseMode === 'specified' ? courses : '全部课程项';
    delete room.classCourses;
    delete room.classCourseModes;
    room.terminalBlacklist = terminalBlacklist;
    delete room.disabledTerminals;
    delete room.availableTerminals;
    delete room.manualPermissions;
    room.blockedPeriods = blockedPeriods;
    room.blockedTimes = blockedPeriods.map(period => `${period.startDate} 至 ${period.endDate} ${period.startTime}-${period.endTime}`);
    closeModal(); render(); toast('教室使用规则已保存');
  }

  function saveBatchPoolRule() {
    const autoEnabled = modalRoot.querySelector('input[name="pool-auto"]:checked')?.value === 'on';
    const classTypes = [...modalRoot.querySelectorAll('[data-pool-class]:checked')].map(input => input.value);
    if (!classTypes.length) return toast('请至少选择一个教室可用班型','error');
    const courseMode = modalRoot.querySelector('input[name="pool-course-mode"]:checked')?.value || 'all';
    const courses = courseMode === 'specified' ? document.getElementById('pool-courses').value.trim() : '';
    if (courseMode === 'specified' && !courses) return toast('请选择教室可用课程项','error');
    const blockedPeriods = autoEnabled ? readBlockedPeriods() : [];
    if (!blockedPeriods) return;
    const terminalBlacklist = readTerminalBlacklist('[data-room-terminal-blacklist]');
    const selected = state.rooms.filter(room => room.status !== '无效' && state.selectedRooms.has(room.id));
    selected.forEach(room => {
      room.inPool = autoEnabled;
      room.restrictClass = classTypes.length < poolClassTypes.length;
      room.classTypes = [...classTypes];
      room.restrictCourse = courseMode === 'specified';
      room.courses = courseMode === 'specified' ? courses : '全部课程项';
      delete room.classCourses;
      delete room.classCourseModes;
      room.terminalBlacklist = [...terminalBlacklist];
      delete room.disabledTerminals;
      delete room.availableTerminals;
      delete room.manualPermissions;
      room.blockedPeriods = blockedPeriods.map(period => ({ ...period }));
      room.blockedTimes = blockedPeriods.map(period => `${period.startDate} 至 ${period.endDate} ${period.startTime}-${period.endTime}`);
    });
    state.selectedRooms.clear();
    closeModal(); render(); toast(`已批量更新${selected.length}间教室的使用规则`);
  }

  function openMatrix() {
    const rows = [['舜元A栋（201）','舜元B栋（202）','10'],['舜元A栋（201）','舜元C栋（203）','15'],['舜元B栋（202）','舜元C栋（203）','8'],['舜元A栋（201）','雅仕A栋（1401）','30']];
    openModal({ title: '地点通行时间矩阵', wide: true, body: `${notice('通行时间已包含出入楼、电梯、门禁和步行耗时，不再额外叠加缓冲时间。')}<div class="modal-table" style="margin-top:14px"><table><thead><tr><th>出发地点</th><th>到达地点</th><th>最短通行时间</th><th>方向</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><input class="number-input" value="${r[2]}"> 分钟</td><td>双向一致</td><td><span class="action-link">编辑</span></td></tr>`).join('')}</tbody></table></div>`, confirm: '保存矩阵', confirmAction: 'save-matrix' });
  }

  function prioritySummary(priorities) {
    return `预设班：${priorities.preset.join(' → ')}；自组班：${priorities.custom.join(' → ')}；1V1：${priorities.oneToOne.join(' → ')}`;
  }

  function openImpactPreview() {
    const rule = state.commonRule;
    openModal({ title: '通用规则影响预览', wide: true, body: `${stats([['▤','9','使用通用参数的校区'],['▦','286','匹配范围内课节'],['◇','72','自动池内教室'],['△','0','参数冲突']])}<div class="modal-table" style="margin-top:15px"><table><thead><tr><th>配置项</th><th>当前值</th><th>影响说明</th></tr></thead><tbody><tr><td>匹配范围</td><td>${rangeSettingText(rule.ranges.preset)} / ${rangeSettingText(rule.ranges.custom)} / ${rangeSettingText(rule.ranges.oneToOne)}</td><td>依次对应预设班、自组班、1V1</td></tr><tr><td>教室匹配优先级</td><td>${prioritySummary(rule.roomPriorities)}</td><td>不同班型分别使用独立的教室类型排序</td></tr><tr><td>需要的教室容量</td><td>预设班+${rule.reserveSeats.preset}；自组班+${rule.reserveSeats.custom}；1V1+${rule.reserveSeats.oneToOne}（教室上限${rule.oneToOneSeatLimit}座）</td><td>需要的教室容量=<b>当前进班人数+预留座位数</b>；1V1同时限制教室座位数上限</td></tr></tbody></table></div>`, confirm: '确认无误', confirmAction: 'close-modal' });
  }

  function rangeSettingText(setting) {
    return setting.mode === 'all' ? '全部课节' : `未来${setting.days}天`;
  }

  function saveCommonSection(section) {
    if (section === 'auto') {
      const ranges = {};
      for (const key of ['preset','custom','oneToOne']) {
        const mode = document.getElementById(`range-${key}`).value;
        const days = Number(document.getElementById(`range-${key}-days`).value);
        if (mode === 'days' && (!Number.isInteger(days) || days < 1 || days > 365)) return toast('未来天数请输入1-365的整数','error');
        ranges[key] = { mode, days: Number.isInteger(days) && days > 0 ? days : state.commonRule.ranges[key].days };
      }
      state.commonRule.ranges = ranges;
    } else if (section === 'priority') {
      const roomPriorities = {};
      for (const key of ['preset','custom','oneToOne']) {
        roomPriorities[key] = [0,1,2,3].map(index => document.getElementById(`room-${key}-priority-${index}`).value);
        if (new Set(roomPriorities[key]).size !== roomPriorities[key].length) return toast('同一班型的教室优先级不能选择重复项','error');
      }
      state.commonRule.roomPriorities = roomPriorities;
    } else if (section === 'capacity') {
      const reserveSeats = {};
      for (const key of ['preset','custom','oneToOne']) {
        const value = Number(document.getElementById(`reserve-${key}`).value);
        if (!Number.isInteger(value) || value < 0 || value > 99) return toast('预留座位数请输入0-99的整数','error');
        reserveSeats[key] = value;
      }
      const oneToOneSeatLimit = Number(document.getElementById('one-to-one-seat-limit').value);
      if (!Number.isInteger(oneToOneSeatLimit) || oneToOneSeatLimit < 1 || oneToOneSeatLimit > 99) return toast('1V1教室座位数上限请输入1-99的整数','error');
      state.commonRule.reserveSeats = reserveSeats;
      state.commonRule.oneToOneSeatLimit = oneToOneSeatLimit;
    }
    state.globalSavedAt = new Date().toLocaleString('zh-CN',{hour12:false});
    state.commonEditing = null;
    render();
    const messages = { auto:'匹配范围设置已保存', priority:'教室匹配优先级设置已保存', capacity:'需要的教室容量设置已保存' };
    toast(messages[section]);
  }

  function openManualTask() {
    openModal({ title: '人工启动系统匹配', body: `<div class="modal-form"><div class="modal-field"><label>匹配校区</label>${select('舜元',['成都','西安','深圳南山'])}</div><div class="modal-field"><label>日期范围</label><input class="text-input" value="2026-08-12 至 2026-08-31"></div><div class="modal-field"><label>每日时段</label><input class="text-input" value="00:00 - 23:59"></div><div class="modal-field"><label>班型</label>${select('全部班型',['预设班','自组班','1V1'])}</div><div class="modal-field"><label>课程项</label><input class="text-input" placeholder="全部课程项"></div><div class="modal-field"><label>处理对象</label>${select('无教室和匹配失败课节',['仅无教室课节','仅匹配失败课节'])}</div></div><div class="warning-box" style="margin-top:15px">人工启动任务仍只处理无教室课节，不会修改已有教室或执行人工换配方案。</div>`, confirm: '启动匹配', confirmAction: 'confirm-manual-task' });
  }

  function openRecords() {
    openModal({ title: '教室匹配记录', wide: true, body: `<div class="filter-box" style="margin-top:0"><div class="filter-grid" style="grid-template-columns:1fr 1fr 1fr auto"><div class="filter-item"><label>触发方式</label>${select('全部',['定时自动','人工闭环换配','人工教室转移'])}</div><div class="filter-item"><label>匹配结果</label>${select('全部',['成功','失败','部分完成'])}</div><div class="filter-item"><label>课程日期</label>${input('2026-08-01 至 2026-08-31')}</div><div class="filter-actions"><button class="btn primary">查询</button></div></div></div><div class="modal-table" style="margin-top:14px"><table><thead><tr><th>操作时间</th><th>触发方式</th><th>班级</th><th>校区</th><th>教室变化</th><th>结果</th><th>规则 / 方案</th><th>操作人</th></tr></thead><tbody>${state.records.map(r=>`<tr>${r.map((x,i)=>`<td>${i===5 ? `<span class="status-dot ${x.includes('失败') ? 'fail' : ''}">${x}</span>` : x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`, confirm: '', confirmAction: '' });
  }

  function findManual(id) { return state.manualRows.find(x => x.id === id); }

  function openTransferRoom(id) {
    const lesson = [...state.missingLessons,...state.capacityLessons].find(item => item.id === id);
    const candidates = state.transferCandidates[id] || [];
    if (!lesson) return;
    const capacityMode = id.startsWith('CL-');
    if (capacityMode) return openCapacityTransferRoom(lesson,candidates);
    const eligibleCandidates = candidates.filter(item => item.kind === 'free');
    state.transferSelection = { lessonId:id, candidateId:eligibleCandidates[0]?.id || null };
    const freeRooms = eligibleCandidates.filter(item => item.kind === 'free');
    const cards = items => items.length ? items.map(candidate => `<label class="transfer-candidate ${state.transferSelection.candidateId === candidate.id ? 'selected' : ''}" data-candidate-kind="${candidate.kind}" data-candidate-id="${candidate.id}"><input type="radio" name="transfer-candidate" value="${candidate.id}" ${state.transferSelection.candidateId === candidate.id ? 'checked' : ''}><div class="transfer-room-main"><div><b>${escapeHtml(candidate.room)}</b><span>${candidate.roomCode} · ${candidate.seats}座 · ${candidate.type} · ${candidate.location}</span></div><span class="tag green">空闲教室</span></div><div class="candidate-result success">确认后直接分配该教室</div></label>`).join('') : '<div class="empty-candidates">暂无符合条件的教室</div>';
    const body = `<div class="transfer-target"><div><span>待安排课节</span><b>${escapeHtml(lesson.className)}</b></div><div><span>上课时间</span><b>${lesson.date} ${lesson.time}</b></div><div><span>校区 / 班型</span><b>${lesson.campus} · ${lesson.classType}</b></div><div><span>需要的教室容量</span><b>${lesson.capacity}座</b></div></div>
      <div class="transfer-group"><div class="transfer-group-title"><h3>空闲教室</h3><span>${freeRooms.length}间</span></div>${cards(freeRooms)}</div>
      `;
    openModal({ title:'匹配教室', body, wide:true, confirm:'一键确认', confirmAction:'confirm-transfer-room', cancel:'取消' });
    const confirm = modalRoot.querySelector('[data-action="confirm-transfer-room"]');
    confirm.dataset.id = id;
    updateTransferConfirmation();
  }

  function capacityRoomText(room) {
    return `${room.name}（${room.code}） · ${room.campus} · ${room.building} · ${room.floor} · ${room.type}`;
  }

  function capacityMetric(scope,seats,required) {
    const difference = Number(seats) - Number(required);
    return {
      label:`${scope}差额`,
      value:difference > 0 ? `+${difference}` : String(difference),
      className:difference >= 0 ? 'capacity-value-good' : 'capacity-value-bad'
    };
  }

  function capacityCandidatePriority(candidate,currentRoom) {
    const candidateFloor = Number.parseInt(candidate.floor,10);
    const currentFloor = Number.parseInt(currentRoom.floor,10);
    if (candidate.building === currentRoom.building && candidate.floor === currentRoom.floor) return 0;
    if (candidate.building === currentRoom.building && Math.abs(candidateFloor - currentFloor) === 1) return 1;
    if (candidate.building === currentRoom.building) return 2;
    return 3;
  }

  function renderCapacityCandidateFilter(candidates) {
    const buildings = [...new Set(candidates.map(candidate => candidate.building))];
    const floors = [...new Set(candidates.map(candidate => candidate.floor))];
    const types = [...new Set(candidates.map(candidate => candidate.type))];
    return `<div class="capacity-query-block"><button class="capacity-query-toggle" type="button" data-action="toggle-capacity-query" aria-expanded="false"><span>教室查询</span><b><em>展开</em><i>⌄</i></b></button><div class="capacity-transfer-filter replacement-query-panel" data-capacity-query-panel hidden><div class="filter-item"><label>所在楼栋</label><select class="select-input" id="capacity-room-filter-building"><option value="">全部楼栋</option>${buildings.map(building => `<option value="${escapeHtml(building)}">${escapeHtml(building)}</option>`).join('')}</select></div><div class="filter-item"><label>教室楼层</label><select class="select-input" id="capacity-room-filter-floor"><option value="">全部楼层</option>${floors.map(floor => `<option value="${floor}">${floor}</option>`).join('')}</select></div><div class="filter-item"><label>教室类型</label><select class="select-input" id="capacity-room-filter-type"><option value="">全部类型</option>${types.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('')}</select></div><div class="filter-item"><label>教室名称</label><input class="text-input" id="capacity-room-filter-name" placeholder="请输入教室名称"></div><div class="replacement-query-actions"><button class="btn" data-action="reset-capacity-room-filter">重置</button><button class="btn primary" data-action="filter-capacity-rooms">查询</button></div></div></div>`;
  }

  function renderCapacityCandidateMeta(candidate,lesson) {
    const result = capacityMetric('更换后',candidate.seats,lesson.capacity);
    return `<div class="capacity-room-meta"><span><em>所属校区</em>${candidate.campus}</span><span><em>楼栋</em>${candidate.building}</span><span><em>楼层</em>${candidate.floor}</span><span><em>教室类型</em>${candidate.type}</span><span><em>教室座位数</em>${candidate.seats}</span><span><em>${result.label}</em><b class="${result.className}">${result.value}</b></span></div>`;
  }

  function renderCapacityFreeCandidate(candidate,lesson) {
    const selected = state.transferSelection.candidateId === candidate.id;
    return `<label class="transfer-candidate capacity-room-candidate ${selected ? 'selected' : ''}" data-capacity-room-option data-candidate-kind="free" data-candidate-id="${candidate.id}" data-room-name="${escapeHtml(candidate.roomName)}" data-room-building="${escapeHtml(candidate.building)}" data-room-floor="${candidate.floor}" data-room-type="${candidate.type}" data-room-seats="${candidate.seats}"><input type="radio" name="transfer-candidate" value="${candidate.id}" ${selected ? 'checked' : ''}><div class="capacity-candidate-head"><b>${escapeHtml(candidate.roomName)}</b><span class="capacity-room-code">（${escapeHtml(candidate.roomCode)}）</span></div>${renderCapacityCandidateMeta(candidate,lesson)}</label>`;
  }

  function renderCapacityOccupiedCandidate(candidate,lesson) {
    const selected = state.transferSelection.candidateId === candidate.id;
    const originalEnrolled = Number(candidate.originalEnrolled ?? candidate.originalStudents ?? 0);
    const originalCapacity = Number(candidate.originalCapacity ?? candidate.originalStudents ?? 0);
    const result = capacityMetric('更换后',lesson.currentSeats,originalCapacity);
    return `<label class="transfer-candidate capacity-room-candidate occupied ${selected ? 'selected' : ''}" data-capacity-room-option data-candidate-kind="occupied" data-candidate-id="${candidate.id}" data-room-name="${escapeHtml(candidate.roomName)}" data-room-building="${escapeHtml(candidate.building)}" data-room-floor="${candidate.floor}" data-room-type="${candidate.type}" data-room-seats="${candidate.seats}"><input type="radio" name="transfer-candidate" value="${candidate.id}" ${selected ? 'checked' : ''}><div class="capacity-candidate-head"><b>${escapeHtml(candidate.roomName)}</b><span class="capacity-room-code">（${escapeHtml(candidate.roomCode)}）</span></div>${renderCapacityCandidateMeta(candidate,lesson)}<div class="capacity-occupied-detail"><div class="capacity-detail-title">教室当前课节信息</div><div class="original-lesson-grid"><div><span>班级名称：</span><b>${escapeHtml(candidate.originalClassName)}</b></div><div><span>课节名称：</span><b>${escapeHtml(candidate.originalLessonName)}</b></div><div><span>上课时间：</span><b>${candidate.originalTime}</b></div><div><span>班课班主任：</span><b>${candidate.originalManager}</b></div><div><span>授课老师：</span><b>${candidate.originalTeacher}</b></div><div><span>更换后教室容量：</span><b>当前进班 ${originalEnrolled} / 需要的教室容量 ${originalCapacity} / 更换后教室座位数 ${lesson.currentSeats} / ${result.label} <i class="${result.className}">${result.value}</i></b></div></div></div></label>`;
  }

  function openCapacityTransferRoom(lesson,candidates) {
    const room = capacityCurrentRooms[lesson.id];
    const eligibleCandidates = candidates
      .filter(candidate => candidate.campus === lesson.campus)
      .sort((left,right) => capacityCandidatePriority(left,room) - capacityCandidatePriority(right,room));
    const freeRooms = eligibleCandidates.filter(candidate => candidate.kind === 'free');
    const occupiedRooms = eligibleCandidates.filter(candidate => candidate.kind === 'occupied');
    state.transferSelection = { lessonId:lesson.id, candidateId:occupiedRooms[0]?.id || freeRooms[0]?.id || null };
    const currentRoom = capacityRoomText(room);
    const currentResult = capacityMetric('当前',lesson.currentSeats,lesson.capacity);
    const body = `<div class="capacity-section-title">待调整课节信息</div><div class="capacity-transfer-summary"><div class="capacity-summary-card capacity-summary-grid"><div><span>班级名称：</span><b>${escapeHtml(lesson.className)}</b></div><div><span>上课时间：</span><b>${lesson.date} ${lesson.time}</b></div><div><span>当前教室：</span><b>${escapeHtml(currentRoom)}</b></div><div><span>教室容量：</span><b>当前进班 ${lesson.enrolled} / 需要的教室容量 ${lesson.capacity} / 当前教室座位数 ${lesson.currentSeats} / ${currentResult.label} <i class="${currentResult.className}">${currentResult.value}</i></b></div></div></div>${renderCapacityCandidateFilter(eligibleCandidates)}
      <div class="transfer-group capacity-transfer-group"><div class="transfer-group-title"><h3 class="capacity-group-tag free">空闲教室</h3><span data-capacity-room-count="free">${freeRooms.length}间</span></div>${freeRooms.map(candidate => renderCapacityFreeCandidate(candidate,lesson)).join('')}<div class="empty-candidates ${freeRooms.length ? 'is-hidden' : ''}" data-capacity-room-empty="free">暂无符合条件的空闲教室</div></div>
      <div class="transfer-group capacity-transfer-group"><div class="transfer-group-title"><h3 class="capacity-group-tag occupied">可更换教室</h3><span data-capacity-room-count="occupied">${occupiedRooms.length}间</span></div>${occupiedRooms.map(candidate => renderCapacityOccupiedCandidate(candidate,lesson)).join('')}<div class="empty-candidates ${occupiedRooms.length ? 'is-hidden' : ''}" data-capacity-room-empty="occupied">暂无符合条件的可更换教室</div></div>`;
    openModal({ title:'更换教室<span class="capacity-difference-formula">当前差额 = 当前教室座位数 - 需要的教室容量；更换后差额 = 更换后新教室座位数 - 需要的教室容量</span>', body, wide:true, confirm:'确认更换', confirmAction:'confirm-transfer-room', cancel:'取消' });
    modalRoot.querySelector('[data-action="confirm-transfer-room"]').dataset.id = lesson.id;
    updateTransferConfirmation();
  }

  function applyCapacityRoomFilter() {
    const building = document.getElementById('capacity-room-filter-building')?.value || '';
    const floor = document.getElementById('capacity-room-filter-floor')?.value || '';
    const type = document.getElementById('capacity-room-filter-type')?.value || '';
    const name = document.getElementById('capacity-room-filter-name')?.value.trim() || '';
    const options = [...modalRoot.querySelectorAll('[data-capacity-room-option]')];
    const visible = options.filter(option => {
      const matched = (!building || option.dataset.roomBuilding === building) && (!floor || option.dataset.roomFloor === floor) && (!type || option.dataset.roomType === type) && (!name || option.dataset.roomName.includes(name));
      option.classList.toggle('is-hidden',!matched);
      return matched;
    });
    ['free','occupied'].forEach(kind => {
      const count = visible.filter(option => option.dataset.candidateKind === kind).length;
      modalRoot.querySelector(`[data-capacity-room-count="${kind}"]`).textContent = `${count}间`;
      modalRoot.querySelector(`[data-capacity-room-empty="${kind}"]`).classList.toggle('is-hidden',count > 0);
    });
    let selected = options.find(option => option.dataset.candidateId === state.transferSelection?.candidateId);
    if (!selected || selected.classList.contains('is-hidden')) selected = visible[0] || null;
    state.transferSelection.candidateId = selected?.dataset.candidateId || null;
    options.forEach(option => { option.querySelector('input[name="transfer-candidate"]').checked = option === selected; });
    updateTransferConfirmation();
    const confirm = modalRoot.querySelector('[data-action="confirm-transfer-room"]');
    if (confirm) confirm.disabled = !selected;
  }

  function resetCapacityRoomFilter() {
    const building = document.getElementById('capacity-room-filter-building');
    const floor = document.getElementById('capacity-room-filter-floor');
    const type = document.getElementById('capacity-room-filter-type');
    const name = document.getElementById('capacity-room-filter-name');
    if (building) building.value = '';
    if (floor) floor.value = '';
    if (type) type.value = '';
    if (name) name.value = '';
    applyCapacityRoomFilter();
  }

  function updateTransferConfirmation() {
    const selection = state.transferSelection;
    if (!selection) return;
    modalRoot.querySelectorAll('.transfer-candidate').forEach(card => card.classList.toggle('selected',card.dataset.candidateId === selection.candidateId));
    if (selection.lessonId.startsWith('CL-')) {
      modalRoot.querySelector('.transfer-confirm-notice')?.remove();
      return;
    }
    const candidate = (state.transferCandidates[selection.lessonId] || []).find(item => item.id === selection.candidateId);
    let notice = modalRoot.querySelector('.transfer-confirm-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'transfer-confirm-notice';
      modalRoot.querySelector('.modal-foot').prepend(notice);
    }
    if (!candidate) return;
    notice.className = `transfer-confirm-notice ${candidate.kind === 'occupied' && !candidate.replacement ? 'danger' : ''}`;
    notice.textContent = candidate.kind === 'free' ? '将直接分配所选空闲教室' : candidate.replacement ? '将同时完成两节课的教室更换' : '原课节将变为未匹配到教室状态';
  }

  function confirmTransferRoom(id) {
    const selection = state.transferSelection;
    const capacityMode = id.startsWith('CL-');
    const lesson = (capacityMode ? state.capacityLessons : state.missingLessons).find(item => item.id === id);
    const candidate = (state.transferCandidates[id] || []).find(item => item.id === selection?.candidateId);
    if (!lesson || !candidate) return toast('请选择需要转入的教室','error');
    if (capacityMode) return openCapacityTransferConfirmation(lesson,candidate);
    if (!capacityMode && candidate.kind !== 'free') return toast('缺教室课节仅支持匹配空闲教室','error');
    if (candidate.kind === 'occupied' && !candidate.replacement) {
      return openNonClosedTransferConfirmation(lesson,candidate);
    }
    lesson.status = capacityMode ? '已更换' : '已匹配';
    lesson.assignedRoom = candidate.room;
    closeModal(); render(); openMissingLessonsDrawer(capacityMode ? 'capacity' : 'missing');
    toast(candidate.kind === 'free' ? `已为课节分配${candidate.room}` : `已完成闭环更换，当前课节使用${candidate.room}`);
  }

  function openCapacityTransferConfirmation(lesson,candidate) {
    const body = `<div class="capacity-confirm-message"><b>确认互换教室课节？</b><span>确认后再进行更换</span></div><div class="capacity-confirm-preview"><div><span>当前课节</span><b>${escapeHtml(lesson.className)}</b></div><div><span>目标教室</span><b>${escapeHtml(candidate.roomName || candidate.room)}</b></div></div>`;
    openModal({ title:'更换教室提示', body, small:true, confirm:'确认更换', confirmAction:'complete-capacity-transfer', cancel:'取消' });
    const confirm = modalRoot.querySelector('[data-action="complete-capacity-transfer"]');
    confirm.dataset.lessonId = lesson.id;
    confirm.dataset.candidateId = candidate.id;
  }

  function completeCapacityTransfer(lessonId,candidateId) {
    const lesson = state.capacityLessons.find(item => item.id === lessonId);
    const candidate = (state.transferCandidates[lessonId] || []).find(item => item.id === candidateId);
    if (!lesson || !candidate) return;
    lesson.status = '已更换';
    lesson.assignedRoom = candidate.room;
    closeModal();
    render();
    openMissingLessonsDrawer('capacity');
    toast(candidate.kind === 'occupied' ? `已完成课节教室互换，当前课节使用${candidate.roomName || candidate.room}` : `已更换至${candidate.roomName || candidate.room}`);
  }

  function openNonClosedTransferConfirmation(lesson,candidate) {
    const body = `<div class="danger-box"><b>所选教室存在课节，且原课节暂无可承接教室。</b>确认后，当前待调整课节将使用${escapeHtml(candidate.room)}，原课节“${escapeHtml(candidate.occupiedLesson)}”将变为未匹配到教室状态。</div><div class="transfer-result-preview"><div><span>当前待调整课节</span><b>${escapeHtml(lesson.className)}</b><em>→ ${escapeHtml(candidate.room)}</em></div><div><span>原课节</span><b>${escapeHtml(candidate.occupiedLesson)}</b><em class="danger-text">→ 未匹配到教室</em></div></div><label class="check transfer-ack"><input type="checkbox" id="transfer-unmatched-ack">我已知晓原课节将变为未匹配到教室状态</label>`;
    openModal({ title:'确认非闭环转教室', body, wide:true, confirm:'确认转教室', confirmAction:'confirm-unmatched-transfer', cancel:'返回' });
    modalRoot.querySelector('[data-action="confirm-unmatched-transfer"]').dataset.lessonId = lesson.id;
    modalRoot.querySelector('[data-action="confirm-unmatched-transfer"]').dataset.candidateId = candidate.id;
  }

  function completeUnmatchedTransfer(lessonId,candidateId) {
    if (!document.getElementById('transfer-unmatched-ack')?.checked) return toast('请确认已知晓原课节将变为未匹配状态','error');
    const capacityMode = lessonId.startsWith('CL-');
    const lesson = (capacityMode ? state.capacityLessons : state.missingLessons).find(item => item.id === lessonId);
    const candidate = (state.transferCandidates[lessonId] || []).find(item => item.id === candidateId);
    if (!lesson || !candidate) return;
    lesson.status = capacityMode ? '已更换' : '已匹配';
    lesson.assignedRoom = candidate.room;
    state.missingLessons.push({ id:`UNMATCHED-${Date.now()}`, date:lesson.date, time:lesson.time, className:candidate.occupiedLesson.split(' · ')[0], student:'--', classType:'--', capacity:candidate.seats, enrolled:'--', campus:lesson.campus, teacher:'--', manager:'--', note:'转教室后待重新匹配', available:0, status:'缺教室' });
    closeModal(); render(); openMissingLessonsDrawer(capacityMode ? 'capacity' : 'missing'); toast('转教室完成，原课节已进入未匹配教室列表','info');
  }

  function convertLessonOnline(id) {
    const lesson = state.missingLessons.find(item => item.id === id);
    if (!lesson) return;
    const body = `<div class="warning-box"><b>确认将当前课节转为线上课？</b>转线上后无需再匹配线下教室。</div><div class="transfer-target online-target"><div><span>班级</span><b>${escapeHtml(lesson.className)}</b></div><div><span>上课时间</span><b>${lesson.date} ${lesson.time}</b></div><div><span>上课校区</span><b>${lesson.campus}</b></div><div><span>班主任</span><b>${lesson.teacher}</b></div></div>`;
    openModal({ title:'转线上', body, confirm:'确认转线上', confirmAction:'confirm-convert-online', cancel:'取消' });
    modalRoot.querySelector('[data-action="confirm-convert-online"]').dataset.id = id;
  }

  function confirmConvertOnline(id) {
    const lesson = state.missingLessons.find(item => item.id === id);
    if (!lesson) return;
    lesson.status = '已转线上';
    closeModal(); render(); openMissingLessonsDrawer('missing'); toast('课节已转为线上课');
  }

  function openClosedPlan(id) {
    const r = findManual(id);
    openModal({ title: '闭环一键换配方案', wide: true, body: `<div class="plan-summary"><div class="course-box"><h4>目标课节 A</h4><dl><dt>班级</dt><dd>${r.className}</dd><dt>当前状态</dt><dd>${r.current}</dd><dt>需要的教室容量</dt><dd>${r.students + r.reserve}座</dd><dt>调整后</dt><dd><b style="color:#2f80ed">${r.targetRoom}</b></dd></dl></div><div class="plan-arrow">⇄</div><div class="course-box"><h4>被调整课节 B</h4><dl><dt>班级</dt><dd>${r.occupiedCourse}</dd><dt>当前教室</dt><dd>${r.targetRoom}</dd><dt>调整后</dt><dd><b style="color:#2f80ed">${r.replacement}</b></dd><dt>规则校验</dt><dd style="color:#24a866">全部通过</dd></dl></div></div><div class="modal-table"><table><thead><tr><th>校验项</th><th>目标课节A</th><th>被调整课节B</th><th>结果</th></tr></thead><tbody><tr><td>容量</td><td>需要的教室容量9座 / R1实际12座</td><td>需要的教室容量5座 / R2实际5座</td><td><span class="status-dot">通过</span></td></tr><tr><td>时间冲突</td><td>无冲突</td><td>无冲突</td><td><span class="status-dot">通过</span></td></tr><tr><td>空间与通行</td><td>同楼栋相邻楼层</td><td>同楼层</td><td><span class="status-dot">通过</span></td></tr><tr><td>特殊限制</td><td>符合</td><td>符合</td><td><span class="status-dot">通过</span></td></tr></tbody></table></div><div class="warning-box" style="margin-top:13px">确认后系统将锁定两个课节和两间教室，并在同一事务中完成换配；任一校验失败则整体不生效。</div>`, confirm: '确认一键换配', confirmAction: 'confirm-closed-plan' });
    modalRoot.querySelector('[data-action="confirm-closed-plan"]').dataset.id = id;
  }

  function openDirectPlan(id) {
    const r = findManual(id);
    openModal({ title: '人工更换教室', body: `<div class="course-box"><h4>${r.className}</h4><dl><dt>当前教室</dt><dd>${r.current}</dd><dt>当前人数</dt><dd>${r.students}人</dd><dt>预留座位</dt><dd>${r.reserve}座</dd><dt>需要的教室容量</dt><dd>${r.students + r.reserve}座</dd></dl></div><div class="modal-section"><h3>请选择符合规则的空闲教室</h3><div class="choice-list"><label class="choice-card selected"><input type="radio" name="room" checked><div><b>B301 · 16座</b><br><span>舜元B栋（202） / 3F / 多媒体</span></div></label><label class="choice-card"><input type="radio" name="room"><div><b>C305 · 18座</b><br><span>舜元C栋（203） / 3F / 白板</span></div></label></div></div>`, confirm: '确认更换', confirmAction: 'confirm-direct-plan' });
    modalRoot.querySelector('[data-action="confirm-direct-plan"]').dataset.id = id;
  }

  function openNonClosedPlan(id) {
    const r = findManual(id);
    openModal({ title: '非闭环教室转移', wide: true, body: `<div class="danger-box"><b>当前方案无法形成闭环：</b>系统未找到适合被调整课节的新教室。确认后，目标课节将获得教室，但被调整课节会变为“无教室—待匹配”。</div><div class="plan-summary"><div class="course-box"><h4>目标课节 A</h4><dl><dt>班级</dt><dd>${r.className}</dd><dt>调整前</dt><dd>${r.current}</dd><dt>调整后</dt><dd><b style="color:#2f80ed">${r.targetRoom}</b></dd></dl></div><div class="plan-arrow">←</div><div class="course-box"><h4>被调整课节 B</h4><dl><dt>班级</dt><dd>${r.occupiedCourse}</dd><dt>当前教室</dt><dd>${r.targetRoom}</dd><dt>替代教室</dt><dd style="color:#e15a60">未找到</dd><dt>调整后</dt><dd style="color:#e15a60">无教室—待匹配</dd></dl></div></div><div class="modal-form"><div class="modal-field full"><label>调整原因</label><textarea class="textarea" id="transfer-reason" placeholder="请填写需要优先保障目标课节的原因"></textarea></div><div class="modal-field full"><label class="check"><input type="checkbox" id="transfer-ack">我已知晓被调整课节将变为无教室，并需要继续匹配</label></div><div class="modal-field full"><label class="check"><input type="checkbox" id="transfer-auto" checked>被调整课节重新进入后续自动匹配队列</label></div></div>`, confirm: '确认转移教室', confirmAction: 'confirm-open-plan' });
    modalRoot.querySelector('[data-action="confirm-open-plan"]').dataset.id = id;
  }

  function openCandidates(id) {
    const r = findManual(id);
    openModal({ title: '资源可优化候选', body: `<div class="course-box"><h4>${r.className}</h4><dl><dt>当前教室</dt><dd>${r.current}</dd><dt>当前人数</dt><dd>${r.students}人</dd><dt>匹配所需</dt><dd>${r.students + r.reserve}座</dd><dt>空余容量</dt><dd>10座</dd></dl></div><div class="modal-section"><h3>可更换的空闲教室</h3><div class="choice-list"><label class="choice-card selected"><input type="radio" checked><div><b>A101 · 5座</b><br><span>舜元A栋（201） / 1F / 白板教室</span></div></label></div></div><div class="warning-box">系统只提供候选，是否更换由教务人工确认。更换后原12座教室将释放给其他无教室课节。</div>`, confirm: '确认人工更换', confirmAction: 'confirm-candidate' });
    modalRoot.querySelector('[data-action="confirm-candidate"]').dataset.id = id;
  }

  function optionList(items, selected) {
    return items.map(item => `<option value="${escapeHtml(item.value ?? item)}" ${(item.value ?? item) === selected ? 'selected' : ''}>${escapeHtml(item.label ?? item)}</option>`).join('');
  }

  function generateClassroomId() {
    const maxNumber = state.classrooms.reduce((max,room) => {
      const match = String(room.id || '').match(/^VISION(\d+)$/i);
      return match ? Math.max(max,Number(match[1])) : max;
    },0);
    return `VISION${maxNumber + 1}`;
  }

  function openClassroomEditor(id) {
    const existing = state.classrooms.find(room => room.id === id);
    const room = existing || {
      id: '',
      name: '', seats: 1, type: '多媒体教室', building: '101', floor: '17F',
      lifecycle: '永久有效', status: '有效', campus: '南山校区', school: '唯寻深圳'
    };
    const availableBuildings = state.buildings.filter(building => building.campus === room.campus && building.status === '启用');
    const currentBuilding = availableBuildings.find(building => building.id === room.building) || availableBuildings[0];
    const permanent = room.lifecycle === '永久有效';
    const campusOptions = state.campuses.map(item => ({ value: item.name, label: item.name }));
    const schoolOptions = [...new Set([...state.campuses.map(item => item.school),room.school].filter(Boolean))];
    const buildingOptions = availableBuildings.map(item => ({ value: item.id, label: `${item.name}（${item.id}）` }));
    const body = `<div class="modal-form classroom-modal-form">
      ${existing ? `<div class="modal-field full"><label>教室编号</label><input class="text-input readonly-input" id="classroom-id" value="${escapeHtml(room.id)}" readonly><span class="field-help">编号由系统生成，保存后不可修改</span></div>` : ''}
      <div class="modal-field full"><label><span class="required">*</span> 教室名称</label><input class="text-input" id="classroom-name" maxlength="30" value="${escapeHtml(room.name)}" placeholder="请输入教室名称"></div>
      <div class="modal-field"><label><span class="required">*</span> 所属学校</label><select class="select-input" id="classroom-school">${optionList(schoolOptions,room.school)}</select></div>
      <div class="modal-field"><label><span class="required">*</span> 所属校区</label><select class="select-input" id="classroom-campus">${optionList(campusOptions, room.campus)}</select></div>
      <div class="modal-field"><label><span class="required">*</span> 所属楼栋</label><select class="select-input" id="classroom-building">${optionList(buildingOptions, currentBuilding?.id)}</select></div>
      <div class="modal-field"><label><span class="required">*</span> 所在楼层</label><select class="select-input" id="classroom-floor">${optionList(currentBuilding?.floors || [], room.floor)}</select></div>
      <div class="modal-field"><label><span class="required">*</span> 正常座位数</label><div class="number-stepper"><button data-action="seat-down">−</button><input id="classroom-seats" value="${room.seats}" inputmode="numeric"><button data-action="seat-up">＋</button></div></div>
      <div class="modal-field"><label><span class="required">*</span> 状态</label><select class="select-input" id="classroom-status">${optionList(['有效','无效'],room.status)}</select></div>
      <div class="modal-field"><label><span class="required">*</span> 教室类型</label><select class="select-input" id="classroom-type">${optionList(['多媒体教室','白板教室','实验室'],room.type)}</select></div>
      <div class="modal-field full"><label><span class="required">*</span> 生命周期</label><label class="check lifecycle-check"><input type="checkbox" id="classroom-permanent" ${permanent ? 'checked' : ''}>永久有效</label><div class="date-range ${permanent ? 'is-disabled' : ''}"><input class="date-input" id="classroom-start" type="date" value="${permanent ? '' : room.lifecycle.split(' ~ ')[0]}"><span>至</span><input class="date-input" id="classroom-end" type="date" value="${permanent ? '' : room.lifecycle.split(' ~ ')[1]}"></div></div>
    </div>`;
    openModal({ title: existing ? '修改教室' : '新增教室', body, confirm: '确定', confirmAction: 'save-classroom' });
    modalRoot.querySelector('[data-action="save-classroom"]').dataset.originalId = existing?.id || '';
  }

  function refreshClassroomLocation(campus, buildingId) {
    const campusInfo = state.campuses.find(item => item.name === campus);
    const school = document.getElementById('classroom-school');
    if (school) school.value = campusInfo?.school || '';
    const buildings = state.buildings.filter(item => item.campus === campus && item.status === '启用');
    const buildingSelect = document.getElementById('classroom-building');
    if (!buildingSelect) return;
    const selected = buildings.some(item => item.id === buildingId) ? buildingId : buildings[0]?.id;
    buildingSelect.innerHTML = optionList(buildings.map(item => ({ value:item.id, label:`${item.name}（${item.id}）` })), selected);
    refreshFloorOptions(selected);
  }

  function refreshFloorOptions(buildingId) {
    const building = state.buildings.find(item => item.id === buildingId);
    const floorSelect = document.getElementById('classroom-floor');
    if (floorSelect) floorSelect.innerHTML = optionList(building?.floors || [], floorSelect.value);
  }

  function saveClassroom(originalId) {
    const id = originalId || generateClassroomId();
    const name = document.getElementById('classroom-name').value.trim();
    const school = document.getElementById('classroom-school').value;
    const campus = document.getElementById('classroom-campus').value;
    const building = document.getElementById('classroom-building').value;
    const floor = document.getElementById('classroom-floor').value;
    const seats = Number(document.getElementById('classroom-seats').value);
    if (!name) return toast('请输入教室名称','error');
    if (!school) return toast('请选择所属学校','error');
    if (!building) return toast('当前校区没有可用楼栋，请先维护楼栋','error');
    if (!floor) return toast('当前楼栋没有可用楼层，请先维护楼层','error');
    if (!Number.isInteger(seats) || seats < 1) return toast('正常座位数必须为大于0的整数','error');
    const permanent = document.getElementById('classroom-permanent').checked;
    const start = document.getElementById('classroom-start').value;
    const end = document.getElementById('classroom-end').value;
    if (!permanent && (!start || !end || start > end)) return toast('请填写正确的生命周期','error');
    const values = { id, name, campus, school, building, floor, seats,
      type:document.getElementById('classroom-type').value, status:document.getElementById('classroom-status').value,
      lifecycle:permanent ? '永久有效' : `${start} ~ ${end}` };
    const index = state.classrooms.findIndex(item => item.id === originalId);
    if (index >= 0) state.classrooms[index] = values;
    else state.classrooms.unshift(values);
    closeModal(); render(); toast(index >= 0 ? '教室信息已更新，楼栋楼层归属已同步' : '教室已新增');
  }

  document.querySelector('.sidebar').addEventListener('click', (event) => {
    const nav = event.target.closest('[data-nav-page]');
    if (!nav) return;
    state.shellPage = nav.dataset.navPage;
    closeModal();
    render();
  });

  modalRoot.addEventListener('input', (event) => {
    if (event.target.matches('.inline-building-id:not([readonly])')) {
      event.target.value = event.target.value.replace(/\D/g,'');
    }
  });

  modalRoot.addEventListener('change', (event) => {
    if (event.target.matches('input[name="media-room"]')) {
      modalRoot.querySelectorAll('[data-media-room-option]').forEach(option => option.classList.toggle('selected',option.contains(event.target)));
      return;
    }
    if (event.target.matches('input[name="effect"]')) {
      const dateField = document.getElementById('effect-date-field');
      if (!dateField) return;
      const isDateRange = event.target.value === 'date';
      dateField.classList.toggle('is-hidden',!isDateRange);
      dateField.querySelectorAll('input').forEach(input => input.disabled = !isDateRange);
      return;
    }
    if (event.target.matches('[data-pool-class]')) {
      syncPoolClassCourseAvailability();
      return;
    }
    if (event.target.matches('[data-pool-course-mode]')) {
      syncPoolClassCourseAvailability(true);
      return;
    }
    if (event.target.matches('[data-building-floor]')) {
      const details = event.target.closest('.floor-multiselect');
      const selected = [...details.querySelectorAll('input:checked')].map(input => input.value);
      details.querySelector('summary').textContent = selected.length ? `已选择${selected.length}个楼层：${selected.join('、')}` : '请选择启用楼层';
      return;
    }
    if (event.target.id === 'classroom-campus') return refreshClassroomLocation(event.target.value);
    if (event.target.id === 'classroom-building') return refreshFloorOptions(event.target.value);
    if (event.target.id === 'classroom-permanent') {
      const range = event.target.closest('.modal-field').querySelector('.date-range');
      range.classList.toggle('is-disabled',event.target.checked);
      range.querySelectorAll('input').forEach(input => input.disabled = event.target.checked);
    }
  });

  workspace.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-tab]');
    if (tab) { state.activeTab = tab.dataset.tab; render(); return; }
    const el = event.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    if (action === 'toggle-order-selection') { state.scheduleSelectAll = !state.scheduleSelectAll; render(); return; }
    if (action === 'toggle-schedule-media-preference') { state.scheduleMediaPreferred = !state.scheduleMediaPreferred; render(); return; }
    if (action === 'toggle-order-section') {
      if (el.dataset.section === 'teacher') state.scheduleTeacherCollapsed = !state.scheduleTeacherCollapsed;
      if (el.dataset.section === 'calendar') state.scheduleCalendarCollapsed = !state.scheduleCalendarCollapsed;
      render();
      return;
    }
    if (action === 'add-campus-entity') return openCampusEditor();
    if (action === 'view-campus-entity') return openCampusViewer(el.dataset.code);
    if (action === 'edit-campus-entity') return openCampusEditor(el.dataset.code);
    if (action === 'edit-campus-buildings') return openCampusBuildingEditor(el.dataset.code);
    if (action === 'add-classroom') return openClassroomEditor();
    if (action === 'edit-classroom') return openClassroomEditor(el.dataset.id);
    if (action === 'toggle-switch') { el.classList.toggle('on'); return; }
    if (action === 'edit-common-section') { state.commonEditing = el.dataset.section; render(); return; }
    if (action === 'cancel-common-section') { state.commonEditing = null; render(); return; }
    if (action === 'save-common-section') return saveCommonSection(el.dataset.section);
    if (action === 'preview-global') return openImpactPreview();
    if (action === 'matrix') return openMatrix();
    if (action === 'add-campus') return openRuleEditor('campus');
    if (action === 'view-campus-rule') return openCampusRuleDetail(el.dataset.id);
    if (action === 'view-pool-rule') return openPoolRuleDetail(el.dataset.id);
    if (action === 'adjust-pool-seat') {
      const target = document.getElementById(el.dataset.target);
      const next = Math.max(0,Number(target.value || 0) + Number(el.dataset.step || 0));
      target.value = String(next);
      return;
    }
    if (action === 'adjust-capacity-filter') {
      const target = document.getElementById(el.dataset.target);
      const next = Math.max(0,Number(target.value || 0) + Number(el.dataset.delta || 0));
      target.value = String(next);
      return;
    }
    if (action === 'batch-pool-rule') return openBatchPoolRule();
    if (action === 'missing-overview-tab') { state.missingOverviewTab = el.dataset.type; render(); return; }
    if (action === 'open-media-failure-detail') return openMediaMatchingFailureDrawer(el.dataset.date || '');
    if (action === 'open-missing-detail') return openMissingLessonsDrawer(el.dataset.type || state.missingOverviewTab);
    if (action === 'open-capacity-date-detail') return openMissingLessonsDrawer('capacity',el.dataset.date);
    if (action === 'toggle-auto-matching-task') return toggleAutoMatchingTask();
    if (action === 'open-auto-task-log') return openAutoTaskLog();
    if (action === 'quick-transfer-room') return openTransferRoom(el.dataset.id);
    if (action === 'transfer-room') return openTransferRoom(el.dataset.id);
    if (action === 'convert-online') return convertLessonOnline(el.dataset.id);
    if (action === 'start-manual-task') return openManualTask();
    if (action === 'row-toggle') return toggleRow(el);
    if (action === 'reset-filter') { toast('筛选条件已重置','info'); return; }
    if (action === 'query') { toast('已按当前条件完成查询'); return; }
    if (action === 'manual-filter') { state.manualFilter = el.dataset.type; render(); return; }
    if (action === 'closed-plan') return openClosedPlan(el.dataset.id);
    if (action === 'open-plan') return openNonClosedPlan(el.dataset.id);
    if (action === 'direct-plan') return openDirectPlan(el.dataset.id);
    if (action === 'view-candidates') return openCandidates(el.dataset.id);
    if (action === 'select-all-rooms') { state.rooms.filter(r=>r.status !== '无效').forEach(r=>state.selectedRooms.add(r.id)); render(); return; }
    if (action === 'batch-in') return batchPool(true);
    if (action === 'batch-out') return batchPool(false);
  });

  workspace.addEventListener('change', (event) => {
    if (event.target.matches('[data-missing-lesson-type]')) {
      state.missingLessonType = event.target.value;
      render();
      return;
    }
    if (event.target.id === 'capacity-date-start' || event.target.id === 'capacity-date-end') {
      const key = event.target.id === 'capacity-date-start' ? 'start' : 'end';
      state.capacityDateRange[key] = event.target.value;
      return;
    }
    if (event.target.matches('[data-range-choice]')) {
      const key = event.target.dataset.rangeChoice;
      const control = event.target.closest('.range-control');
      const choices = [...control.querySelectorAll('[data-range-choice]')];
      choices.forEach(choice => { choice.checked = choice === event.target; });
      const hidden = document.getElementById(`range-${key}`);
      hidden.value = event.target.value;
      const daysWrap = control.querySelector('.range-days');
      const daysInput = document.getElementById(`range-${key}-days`);
      const enabled = event.target.value === 'days';
      daysWrap.classList.toggle('is-hidden',!enabled);
      daysInput.disabled = !enabled;
      if (enabled) daysInput.focus();
      return;
    }
    if (event.target.matches('[data-room-check]')) {
      const id = event.target.dataset.roomCheck;
      event.target.checked ? state.selectedRooms.add(id) : state.selectedRooms.delete(id);
      render();
    }
  });

  modalRoot.addEventListener('change', (event) => {
    if (event.target.matches('input[name="pool-auto"]')) {
      const enabled = event.target.value === 'on';
      modalRoot.querySelector('[data-auto-match-on]')?.classList.toggle('is-hidden',!enabled);
      return;
    }
    if (event.target.matches('[data-campus-class-toggle]')) {
      const card = modalRoot.querySelector(`[data-campus-class-card="${event.target.value}"]`);
      card?.classList.toggle('is-hidden',!event.target.checked);
      return;
    }
    if (event.target.name?.startsWith('special-course-mode-')) {
      const key = event.target.name.replace('special-course-mode-','');
      const picker = document.getElementById(`special-courses-${key}`).closest('[data-course-cascade]');
      const specified = event.target.value === 'specified';
      picker.classList.toggle('is-hidden',!specified);
      picker.querySelectorAll('input,button').forEach(control => { control.disabled = !specified; });
      setCourseCascadeOpen(picker,specified);
      return;
    }
    if (event.target.matches('[data-course-root-check]')) {
      const picker = event.target.closest('[data-course-cascade]');
      picker.querySelectorAll(`[data-course-leaf-row][data-root-id="${event.target.dataset.rootId}"] [data-course-leaf]`).forEach(input => { input.checked = event.target.checked; });
      updateCourseCascadeSelection(picker);
      return;
    }
    if (event.target.matches('[data-course-group-check]')) {
      const picker = event.target.closest('[data-course-cascade]');
      picker.querySelectorAll(`[data-course-leaf-row][data-group-id="${event.target.dataset.groupId}"] [data-course-leaf]`).forEach(input => { input.checked = event.target.checked; });
      updateCourseCascadeSelection(picker);
      return;
    }
    if (event.target.matches('[data-course-leaf]')) {
      updateCourseCascadeSelection(event.target.closest('[data-course-cascade]'));
      return;
    }
    if (event.target.name?.startsWith('special-effect-')) {
      const key = event.target.name.replace('special-effect-','');
      const field = modalRoot.querySelector(`[data-special-effect-date="${key}"]`);
      const dateMode = event.target.value === 'date';
      field.classList.toggle('is-hidden',!dateMode);
      field.querySelectorAll('input').forEach(input => { input.disabled = !dateMode; });
      return;
    }
    if (event.target.matches('input[name="transfer-candidate"]')) {
      state.transferSelection.candidateId = event.target.value;
      updateTransferConfirmation();
      return;
    }
  });

  modalRoot.addEventListener('click', (event) => {
    const openLocation = modalRoot.querySelector('.campus-location-cascader.is-open');
    if (openLocation && !event.target.closest('[data-location-cascader]')) {
      openLocation.classList.remove('is-open');
      openLocation.querySelector('[data-location-panel]').hidden = true;
      openLocation.querySelector('[data-action="toggle-campus-location"]').setAttribute('aria-expanded','false');
    }
    const openCoursePicker = modalRoot.querySelector('.course-cascade-picker.is-open');
    if (openCoursePicker && !event.target.closest('[data-course-cascade]')) setCourseCascadeOpen(openCoursePicker,false);
    const el = event.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    if (action === 'toggle-campus-location') {
      const cascader = el.closest('[data-location-cascader]');
      const panel = cascader.querySelector('[data-location-panel]');
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      cascader.classList.toggle('is-open',willOpen);
      el.setAttribute('aria-expanded',String(willOpen));
      return;
    }
    if (action === 'select-campus-province') {
      const cascader = el.closest('[data-location-cascader]');
      const province = el.dataset.province;
      const location = campusLocationOptions.find(item => item.province === province);
      cascader.querySelector('#campus-province').value = province;
      cascader.querySelector('#campus-city').value = '';
      cascader.querySelector('[data-location-label]').textContent = `${province} / 请选择城市`;
      cascader.querySelectorAll('[data-province-list] .campus-location-option').forEach(option => option.classList.toggle('active',option === el));
      const cityList = cascader.querySelector('[data-city-list]');
      cityList.innerHTML = (location?.cities || []).map(city => `<button type="button" class="campus-location-option city" data-action="select-campus-city" data-city="${city}"><span>${city}</span></button>`).join('');
      cityList.classList.remove('is-hidden');
      return;
    }
    if (action === 'select-campus-city') {
      const cascader = el.closest('[data-location-cascader]');
      const province = cascader.querySelector('#campus-province').value;
      const city = el.dataset.city;
      cascader.querySelector('#campus-city').value = city;
      cascader.querySelector('[data-location-label]').textContent = `${province} / ${city}`;
      cascader.querySelectorAll('[data-city-list] .campus-location-option').forEach(option => option.classList.toggle('active',option === el));
      cascader.classList.remove('is-open');
      cascader.querySelector('[data-location-panel]').hidden = true;
      cascader.querySelector('[data-action="toggle-campus-location"]').setAttribute('aria-expanded','false');
      return;
    }
    if (action === 'toggle-course-cascade') {
      const picker = el.closest('[data-course-cascade]');
      setCourseCascadeOpen(picker,!picker.classList.contains('is-open'));
      return;
    }
    if (action === 'course-cascade-root') {
      activateCourseCascade(el.closest('[data-course-cascade]'),el.dataset.rootId);
      return;
    }
    if (action === 'course-cascade-group') {
      activateCourseCascade(el.closest('[data-course-cascade]'),el.dataset.rootId,el.dataset.groupId);
      return;
    }
    if (action === 'open-media-lesson-copy') return openMediaLessonCopyDialog(el.dataset.id);
    if (action === 'close-media-copy-dialog') {
      el.closest('[data-media-copy-dialog]')?.remove();
      return;
    }
    if (action === 'copy-media-lesson-content') return copyMediaLessonInfo(el.dataset.id,el);
    if (action === 'replace-media-room') return openMediaRoomReplacement(el.dataset.id);
    if (action === 'filter-media-rooms') return applyMediaRoomFilter();
    if (action === 'reset-media-room-filter') return resetMediaRoomFilter();
    if (action === 'filter-capacity-rooms') return applyCapacityRoomFilter();
    if (action === 'reset-capacity-room-filter') return resetCapacityRoomFilter();
    if (action === 'confirm-media-room') return confirmMediaRoom(el.dataset.id);
    if (action === 'transfer-room') return openTransferRoom(el.dataset.id);
    if (action === 'convert-online') return convertLessonOnline(el.dataset.id);
    if (action === 'close-modal') {
      return closeModal();
    }
    if (action === 'toggle-capacity-query') {
      const panel = modalRoot.querySelector('[data-capacity-query-panel]');
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      el.setAttribute('aria-expanded',String(willOpen));
      el.querySelector('em').textContent = willOpen ? '收起' : '展开';
      return;
    }
    if (action === 'seat-down' || action === 'seat-up') {
      const input = document.getElementById('classroom-seats');
      input.value = Math.max(1, Number(input.value || 1) + (action === 'seat-up' ? 1 : -1));
      return;
    }
    if (action === 'save-campus-entity') return saveCampusEntity(el.dataset.originalCode);
    if (action === 'save-campus-buildings') return saveCampusBuildings(el.dataset.code);
    if (action === 'add-inline-building') {
      const container = document.getElementById('inline-buildings');
      const index = container.querySelectorAll('.inline-building').length;
      if (index >= 10) return toast('单个校区最多配置10栋楼','error');
      container.insertAdjacentHTML('beforeend',inlineBuildingForm(null,index));
      return;
    }
    if (action === 'remove-inline-building') {
      const forms = modalRoot.querySelectorAll('.inline-building');
      if (forms.length <= 1) return toast('楼栋信息最少保留一栋','error');
      el.closest('.inline-building').remove();
      return renumberInlineBuildings();
    }
    if (action === 'save-classroom') return saveClassroom(el.dataset.originalId);
    if (action === 'save-campus-rule') return saveCampusRule(el.dataset.id);
    if (action === 'edit-campus-from-detail') return openCampusRuleEditor(el.dataset.id);
    if (action === 'edit-pool-from-detail') return openPoolRule(el.dataset.id);
    if (action === 'save-room-rule') return saveRule('room',el.dataset.id);
    if (action === 'save-pool-rule') return savePoolRule(el.dataset.id);
    if (action === 'save-batch-pool-rule') return saveBatchPoolRule();
    if (action === 'confirm-transfer-room') return confirmTransferRoom(el.dataset.id);
    if (action === 'complete-capacity-transfer') return completeCapacityTransfer(el.dataset.lessonId,el.dataset.candidateId);
    if (action === 'confirm-unmatched-transfer') return completeUnmatchedTransfer(el.dataset.lessonId,el.dataset.candidateId);
    if (action === 'confirm-convert-online') return confirmConvertOnline(el.dataset.id);
    if (action === 'add-blocked-period') {
      const container = document.getElementById('blocked-periods');
      container.querySelector('.empty-periods')?.remove();
      container.insertAdjacentHTML('beforeend',blockedPeriodRow(emptyBlockedPeriod(),container.querySelectorAll('.blocked-period-row').length));
      return;
    }
    if (action === 'remove-blocked-period') {
      el.closest('.blocked-period-row').remove();
      modalRoot.querySelectorAll('.blocked-period-row').forEach((row,index) => { row.querySelector('.blocked-period-head b').textContent = `时段${index + 1}`; });
      if (!modalRoot.querySelector('.blocked-period-row')) document.getElementById('blocked-periods').innerHTML = '<div class="empty-periods">暂未配置自动匹配禁用时段</div>';
      return;
    }
    if (action === 'save-matrix') { closeModal(); toast('地点通行时间矩阵已保存'); return; }
    if (action === 'confirm-manual-task') { closeModal(); toast('人工匹配任务已启动，可在匹配任务中心查看进度'); return; }
    if (action === 'confirm-closed-plan') return completeManual(el.dataset.id,'人工闭环换配成功');
    if (action === 'confirm-direct-plan') return completeManual(el.dataset.id,'人工更换教室成功');
    if (action === 'confirm-candidate') return completeManual(el.dataset.id,'资源优化人工更换成功');
    if (action === 'confirm-open-plan') {
      const ack = document.getElementById('transfer-ack')?.checked;
      const reason = document.getElementById('transfer-reason')?.value.trim();
      if (!ack) return toast('请确认已知晓被调整课节将变为无教室','error');
      if (!reason) return toast('请填写调整原因','error');
      return completeManual(el.dataset.id,'人工教室转移完成：原课节已进入待匹配');
    }
  });

  function toggleRow(el) {
    const kind = el.dataset.kind;
    if (kind === 'pool') {
      const room = state.rooms.find(x=>x.id === el.dataset.id);
      room.inPool = !room.inPool;
      toast(`${room.name} 已${room.inPool ? '开启' : '关闭'}自动匹配`);
    } else {
      const data = kind === 'campus' ? state.campusRules : state.roomRules;
      const row = data.find(x=>String(x.id) === String(el.dataset.id));
      row.enabled = !row.enabled;
      row.status = row.enabled ? 'active' : 'off';
      toast(`${row.name} 已${row.enabled ? '启用' : '停用'}`);
    }
    render();
  }

  function copyRule(kind,id) {
    const data = kind === 'campus' ? state.campusRules : state.roomRules;
    const source = data.find(x=>String(x.id) === String(id));
    const copy = { ...source, id: Date.now(), name: `${source.name}-副本`, status: 'off', enabled: false };
    data.unshift(copy); render(); toast('规则已复制为停用状态，请编辑后发布');
  }

  function saveRule(kind,id) {
    const name = document.getElementById('rule-name')?.value.trim();
    if (!name) return toast('请输入规则名称','error');
    const data = kind === 'campus' ? state.campusRules : state.roomRules;
    const row = data.find(x=>String(x.id) === String(id));
    let campusSettings = null;
    if (kind === 'campus') {
      const effectType = modalRoot.querySelector('input[name="effect"]:checked')?.value || 'long';
      const effectStart = document.getElementById('effect-start')?.value || '';
      const effectEnd = document.getElementById('effect-end')?.value || '';
      if (effectType === 'date' && (!effectStart || !effectEnd || effectStart > effectEnd)) return toast('请选择正确的生效日期范围','error');
      const reserveSeats = {};
      const roomPriorities = {};
      for (const key of ['preset','custom','oneToOne']) {
        const reserve = Number(document.getElementById(`special-reserve-${key}`).value);
        if (!Number.isInteger(reserve) || reserve < 0 || reserve > 99) return toast('预留座位数请输入0-99的整数','error');
        reserveSeats[key] = reserve;
        roomPriorities[key] = [0,1,2,3].map(index => document.getElementById(`special-room-${key}-priority-${index}`).value);
        if (new Set(roomPriorities[key]).size !== roomPriorities[key].length) return toast('同一班型的教室优先级不能选择重复项','error');
      }
      campusSettings = { reserveSeats, roomPriorities, effectType, effectStart, effectEnd, time:effectType === 'date' ? `${effectStart} 至 ${effectEnd}` : '长期有效' };
    }
    if (row) {
      row.name = name;
      if (campusSettings) Object.assign(row,campusSettings,{ summary:`容量：预设班+${campusSettings.reserveSeats.preset}、自组班+${campusSettings.reserveSeats.custom}、1V1+${campusSettings.reserveSeats.oneToOne}；已配置分班型教室优先级` });
    }
    else if (kind === 'campus') data.unshift({ id: Date.now(), name, campuses:'舜元', classTypes:['预设班'], courses:'全部课程项', summary:`容量：预设班+${campusSettings.reserveSeats.preset}、自组班+${campusSettings.reserveSeats.custom}、1V1+${campusSettings.reserveSeats.oneToOne}；已配置分班型教室优先级`, reserveSeats:campusSettings.reserveSeats, roomPriorities:campusSettings.roomPriorities, effectType:campusSettings.effectType, effectStart:campusSettings.effectStart, effectEnd:campusSettings.effectEnd, time:campusSettings.time, status:'active', enabled:true });
    else data.unshift({ id: Date.now(), name, scope:'舜元 / 全部楼栋', allowed:'全部课程项 · 全部班型', auto:'参与自动匹配', roles:'教务', time:'长期有效', status:'active', enabled:true });
    closeModal(); render(); toast('规则已保存并发布');
  }

  function batchPool(inPool) {
    if (!state.selectedRooms.size) return toast('请先选择教室','error');
    const editableRooms = state.rooms.filter(r=>r.status !== '无效' && state.selectedRooms.has(r.id));
    editableRooms.forEach(r=>{ r.inPool = inPool; });
    const count = editableRooms.length; state.selectedRooms.clear(); render(); toast(`已为${count}间教室${inPool ? '开启' : '关闭'}自动匹配`);
  }

  function completeManual(id,message) {
    const row = findManual(id); if (row) row.status = '人工处理完成';
    closeModal(); render(); toast(message);
  }

  render();
})();
