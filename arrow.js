function* iterFunc() {
  yield console.log("첫번째 출력");
  yield console.log("두번째 출력");
  yield console.log("세번째 출력");
  yield console.log("네번째 출력");
}

const iter = iterFunc();
iter.next();
iter.next();
