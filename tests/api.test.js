const test = require('node:test');
const assert = require('node:assert/strict');
const { profile, match, questions } = require('../server');

test('profile calculates readiness and gaps', () => {
  const result = profile({ id: 'x', skills: { communication: 4, teamwork: 4, problemSolving: 4, python: 4, sql: 2, dataAnalysis: 4, webDevelopment: 2, ayushDomain: 2 } });
  assert.equal(result.readiness, 65);
  assert.equal(result.gaps.length, 3);
});
test('match gives credit for required skills', () => {
  const result = match({ skills: { python: 4, sql: 3 }, interests: ['Digital Health'] }, { skills: ['python', 'sql', 'dataAnalysis'], domain: 'Digital Health' });
  assert.equal(result.score, 70);
  assert.deepEqual(result.missingSkills, ['dataAnalysis']);
});
test('assessment has a meaningful skill set', () => assert.equal(questions.length, 8));