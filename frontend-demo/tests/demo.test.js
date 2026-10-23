const test = require("node:test");
const assert = require("node:assert/strict");
const {amount, calculate, canTransition, transition} = require("../core.js");

test("cash arithmetic for RWF-only demo input", () => {
  const x = calculate({opening:100000,cash:250000,momo:120000,card:80000,expenses:10000,withdrawn:200000,counted:139000});
  assert.deepEqual(x,{sales:450000,expected:140000,difference:-1000});
});
test("negative and non-integer inputs cannot enter the report", () => {
  assert.throws(()=>amount(-1));
  assert.throws(()=>amount("10.5"));
  assert.throws(()=>amount("not a number"));
});
test("manager approval, employee submission, and invalid transitions", () => {
  assert.equal(canTransition("manager","Pending","approve"),true);
  assert.equal(canTransition("employee","Pending","approve"),false);
  assert.equal(canTransition("manager","Returned","approve"),false);
  assert.equal(canTransition("employee","Returned","submit"),true);
  assert.equal(transition({status:"Pending"}, "manager","approve").status,"Approved");
  assert.throws(()=>transition({status:"Approved"},"manager","return"));
});
test("returning needs a reason and resubmission is possible", () => {
  assert.throws(()=>transition({status:"Pending"},"manager","return"," "));
  const returned=transition({status:"Pending"},"manager","return","Recheck cash");
  assert.equal(returned.returnReason,"Recheck cash");
  assert.equal(transition(returned,"employee","submit").status,"Pending");
});
