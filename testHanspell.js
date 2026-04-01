const hanspell = require('hanspell');
hanspell.spellCheckByDAUM('안되요 할수 있다.', 6000, console.log, () => {}, console.error);
