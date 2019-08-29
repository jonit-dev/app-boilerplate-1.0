const doWorkPromise = new Promise((resolve, reject) => {
  const n = Math.floor(Math.random() * 100);

  setTimeout(() => {
    if (n >= 50) {
      resolve([1, 2, 3, 4, 5]);
    } else {
      reject("an error has occured!");
    }
  }, 2000);
});

doWorkPromise
  .then(result => {
    console.log(result);
  })
  .catch(err => console.log(err));
