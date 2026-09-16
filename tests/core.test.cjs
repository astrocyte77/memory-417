const assert=require('node:assert/strict');const C=require('../core.js');const S=require('../content.js');let passed=0;function check(name,fn){fn();console.log('PASS '+name);passed++;}
check('17 pages and 5 questions',()=>{assert.equal(S.pages.length,17);assert.equal(S.questions.length,5);});
check('first correct = 100',()=>{for(const q of S.questions){const r=C.answer(C.fresh().questions[0],q.correct,q.correct);assert.equal(r.points,100);}});
check('wrong then correct = 60, immutable first answer',()=>{for(const q of S.questions){const wrong=(q.correct+1)%4;let r=C.answer(C.fresh().questions[0],wrong,q.correct);r=C.answer(r,q.correct,q.correct);assert.equal(r.points,60);assert.equal(r.first,wrong);assert.equal(r.attempts.length,2);}});
check('hint before first correct = 30',()=>{assert.equal(C.answer(C.hint(C.fresh().questions[0]),2,2).points,30);});
check('wrong then hint then correct = 30',()=>{let q=C.answer(C.fresh().questions[0],0,2);q=C.hint(q);assert.equal(C.answer(q,2,2).points,30);});
check('solved record cannot be rescored or hinted',()=>{let q=C.answer(C.fresh().questions[0],2,2);assert.strictEqual(C.answer(q,0,2),q);assert.strictEqual(C.hint(q),q);});
check('score mixed categories = 64',()=>{const result=C.summary([100,60,30,100,70-40].map(points=>({points})));assert.deepEqual(result,{score:64,independent:2,corrected:1,hinted:2});});
check('4 independent and 1 corrected = 92',()=>assert.equal(C.summary([100,100,100,100,60].map(points=>({points}))).score,92));
check('all 10 comparison combinations',()=>{for(const selected of [true,false])for(let choice=0;choice<5;choice++){const r=C.comparison({items:selected?['雨伞']:[]},choice);assert.equal(r.kind,selected?'initial':choice<2?'changed':choice===3?'uncertain':'stable');}});
check('state survives JSON serialization',()=>assert.ok(C.valid(JSON.parse(JSON.stringify(C.fresh())))));
check('corrupt schema rejected',()=>{assert.equal(C.valid(null),false);const s=C.fresh();s.page=99;assert.equal(C.valid(s),false);});
console.log(`${passed} test groups passed.`);

