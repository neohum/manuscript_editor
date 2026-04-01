const hanspell = require('hanspell');

const sentence = '안되요 할수 있다.';
const end = function () {
  console.log("END");
};
const error = function (err) {
  console.error("ERROR:", err);
};

hanspell.spellCheckByDAUM(
  sentence,
  6000,
  console.log,
  end,
  error
);
