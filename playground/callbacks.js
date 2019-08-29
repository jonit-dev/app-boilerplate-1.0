const showNumbers = callback => {
  const n = Math.floor(Math.random() * 100);

  setTimeout(() => {
    if (n >= 50) {
      callback(undefined, [1, 2, 3, 4]);
    } else {
      callback("An error has occured!", undefined);
    }
  }, 2000);
};

showNumbers((error, result) => {
  if (error) {
    return console.log(error);
  }

  console.log(result);
});
