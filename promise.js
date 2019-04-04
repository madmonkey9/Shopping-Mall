const p1 = new Promise((resolve, reject) => {
  console.log("프라미스 함수제작");

  setTimeout(() => {
    resolve({ p1: "~.~" });
  }, 500);
});

const p2 = new Promise((resolve, reject) => {
  console.log("프라미스 함수제작");

  setTimeout(() => {
    resolve({ p2: "ㅡㅡ" });
  }, 300);
});

const p3 = new Promise((resolve, reject) => {
  reject("끊어짐");
});

Promise.all([p1, p2]).then(result => {
  console.log(result);
  console.log("p1 = " + result[0].p1);
  console.log(`p2 = ${result[1].p2}`);
});

// p1.then(result => {
//   console.log(result.p1);
// });
